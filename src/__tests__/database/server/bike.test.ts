import { getBike, insertBike } from '../../../database/bike';
import mockQuery from './mockQuery';

describe('insertBike()', () => {
    it('Inserts a single bike', async () => {
        const request = { year: '2010', make: 'Prius', model: 'OK123', membershipId: 20 };

        const result = await insertBike(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { year: '-100', make: 'Toyonda', model: 'OK124', membershipId: 21 };

        await expect(insertBike(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getBike()', () => {
    it('Selects a single bike', async () => {
        const bikeId = 18;
        const origValues = [bikeId, '1996', 'Honda', 'WR450F', 'Addia Shipway'];

        const result = await getBike(bikeId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.bikeId).toBe(bikeId);
        expect(result.year).toBe(origValues[1]);
        expect(result.make).toBe(origValues[2]);
        expect(result.model).toBe(origValues[3]);
        expect(result.membershipAdmin).toBe(origValues[4]);
    });

    it('Throws for bike not found', async () => {
        const bikeId = 765;
        await expect(getBike(bikeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const bikeId = -100;
        await expect(getBike(bikeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
