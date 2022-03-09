import { destroyPool, getPool } from '../../../database/pool';

beforeEach(() => {
    process.env.MYSQL_DB = 'dummyDB';
    process.env.MYSQL_USER = 'dummyUser';
    process.env.MYSQL_PASS = 'dummyPassword';
    process.env.MYSQL_HOST = 'dummyHost';
});

afterEach(async () => {
    await destroyPool();
});

describe('getPool()', () => {
    it('Succeeds in creation with all env vars', () => {
        expect(getPool).not.toThrowError();
    });

    it('Only creates a single pool', () => {
        const pool1 = getPool();
        const pool2 = getPool();
        expect(pool1 === pool2);
    });

    it('Fails in creation without all env vars', () => {
        delete process.env.MYSQL_HOST;
        expect(getPool).toThrowError('Terminating server');
    });
});

describe('destroyPool()', () => {
    it('Destroys an existing pool', async () => {
        getPool();
        await destroyPool();
    });
    it('Does not error without prior creation', async () => {
        await destroyPool();
    });
});
