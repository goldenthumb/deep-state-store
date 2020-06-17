import equal from 'deep-equal';

type State = { [name: string]: any };
type Listener = (...args: any) => void;

export default class Store<T extends State> {
    private _state: T;
    private _events: { [event: string]: Listener[] };
    private _defer: Promise<void> | null;

    constructor(initState: T) {
        this._state = initState;
        this._events = {};
        this._defer = null;
    }

    get state() {
        return this._state;
    }

    on<K extends (keyof T & string)>(deps: K[], listener: Listener) {
        deps.forEach((dep) => {
            (this._events[dep] = this._events[dep] || []).push(listener);
        });

        return () => {
            deps.forEach((dep) => {
                this._events[dep] = this._events[dep].filter((fn) => fn !== listener);
            });
        };
    }

    set(nextState: T) {
        for (const [key, value] of Object.entries(nextState)) {
            if (!hasOwn(this._state, key)) throw new Error(`State does not exist. (${key})`);
            if (equal(this._state[key], value)) continue;
            this._state = { ...this._state, [key]: value };

            if (!this._defer) {
                this._defer = Promise.resolve().then(() => {
                    this._defer = null;
                    (this._events[key] || []).forEach((fn) => fn(this._state));
                });
            }
        }
    }
}

function hasOwn(obj: Record<string, any>, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}