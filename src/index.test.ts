import Store from './index';

describe('Store', () => {
    it('get state', () => {
        const store = new Store<{
            test?: number;
            data?: string;
        }>({ test: 0, data: 'test' });

        expect(store.state).toEqual({ test: 0, data: 'test' });
    });

    it('does not call listener if state is same. (deep equal)', () => {
        const store = new Store<{
            test?: number;
            data?: string[];
        }>({ test: 3, data: ['test1', 'test2'] });

        let calls = 0;

        store.on(['test', 'data'], () => { calls++; });
        store.set({ test: 3 });
        store.set({ data: ['test1', 'test2'] });
        store.set({ test: 3 });
        store.set({ data: ['test1', 'test2'] });
        store.set({ test: 3, data: ['test1', 'test2'] });

        Promise.resolve().then(() => {
            expect(calls).toBe(0);
        });
    });

    it('defer task. (only tasks of the current round will be called.)', () => {
        const store = new Store<{
            test?: number;
            data?: string[];
        }>({ test: 3, data: ['test1', 'test2'] });

        let calls = 0;

        store.on(['test', 'data'], () => { calls++; });
        store.set({ test: 1 });
        store.set({ data: ['test1'] });
        store.set({ test: 2, data: ['test1', 'test2', 'test3'] });
        store.set({ test: 3, data: ['test2'] });
        store.set({ test: 1 });
        
        Promise.resolve().then(() => {
            expect(calls).toBe(1);
            expect(store.state.test).toEqual(1);
            expect(store.state.data).toEqual(['test2']);
        });
    });
    
    it('remove listener', () => {
        const store = new Store<{
            test?: number;
            data?: string[];
        }>({ test: 3, data: ['test1', 'test2'] });
        
        let calls = 0;
        
        const clearEvent = store.on(['test'], () => { calls++; });
        store.on(['test'], () => { calls++; });
        store.set({ test: 3 });
        store.set({ test: 4 });
        store.set({ test: 5 });
        clearEvent();
        
        Promise.resolve().then(() => {
            expect(calls).toBe(1);
        });
    });
});