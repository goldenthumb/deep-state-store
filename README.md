# deep-state-store [![npm](https://img.shields.io/npm/v/deep-state-store.svg)](https://www.npmjs.com/package/deep-state-store)
Simple global state library for javascript.<br><br>

Deep state store is an state management library which will trigger an update only when the state is completely different.
<br />
<br />

## Example
```js
import Store from 'deep-state-store';

const store = new Store({ test: 0, data: ['test']});

store.on(['test', 'data'], (state) => {
    console.log(state); 
});

store.set({ test: 1 });
store.set({ data: ['test1'] });
store.set({ test: 2, data: ['test1', 'test2', 'test3'] });
store.set({ test: 3, data: ['test2'] });
store.set({ test: 5 });
```
<br />
<br />

## API
### new Store(initialState)
Create instance.
```js
const store = new Store({ test: 0 });
```
<br />

### get state
Get current state.
```js
const store = new Store({ test: 0 });

console.log(store.state);
```
<br />

### set(nextState)
Update state.
```js
const store = new Store({ test: 0 });

store.set({ test: 1 });
```
<br />

### on([deps], fn)
Listening to event when state changes.
```js
const store = new Store({ test: 0, data: 'test' });

store.on(['test', 'data'], (state) => {
    console.log(state);  // { test: 1, data: 'test2' }
});

store.set({ test: 1, data: 'test2' });
```
<br />

### off
Remove Listener
```js
const off = store.on(deps, listener);
off();
```
<br />
<br />

## License
MIT

<br />

