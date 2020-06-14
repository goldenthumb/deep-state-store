import Emitter, { Listener } from './EventEmitter';

interface State {
    [name: string]: any;
}

export default class Store<T extends State> {
    private _state: T;
    private _emitter: Emitter;

    constructor(initState: T) {
        this._state = initState;
        this._emitter = new Emitter();
    }

    get state() {
        return this._state;
    }

    on<K extends (keyof T & string)>(state: K, listener: Listener) {
        return this._emitter.on(state, listener);
    }

    set(state: T) {
        this._state = { ...this._state, ...state };
        for (const [key, value] of Object.entries(state)) {
            this._emitter.emit(key, value);
        }
    }
}