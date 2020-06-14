import equal from 'deep-equal';
import Emitter, { Listener } from './EventEmitter';

interface State {
    [name: string]: any;
}

export default class Store<T extends State> {
    private _state: T;
    private _emitter: Emitter;
    private _defer: Promise<void> | null;

    constructor(initState: T) {
        this._state = initState;
        this._emitter = new Emitter();
        this._defer = null;
    }

    get state() {
        return this._state;
    }

    on<K extends (keyof T & string)>(deps: K[], listener: Listener) {
        const clearEvents = deps.map((dep) => this._emitter.on(dep, () => listener(this._state)));

        return () => {
            clearEvents.forEach(clearEvent => clearEvent());
        };
    }

    set(nextState: T) {
        for (const [key, value] of Object.entries(nextState)) {
            if (!this._state.hasOwnProperty(key)) throw new Error(`State does not exist. (${key})`);
            if (equal(this._state[key], value)) continue;
            this._state = { ...this._state, [key]: value };

            if (!this._defer) {
                this._defer = Promise.resolve().then(() => {
                    this._defer = null;
                    this._emitter.emit(key, this._state[key]);
                });
            }
        }
    }
}