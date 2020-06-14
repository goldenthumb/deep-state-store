import Store from './index';

describe('Store', () => {
    it('create', () => {
        const store = new Store<{
            test?: number;
            data?: string;
        }>({ test: 0, data: 'test' });
        expect(store.state).toEqual({ test: 0, data: 'test' });
    });
});