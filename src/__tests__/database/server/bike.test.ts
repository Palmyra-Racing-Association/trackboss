import { PatchBikeRequest } from 'src/typedefs/bike';
import { getBike, getBikeList, insertBike, patchBike } from '../../../database/bike';
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

describe('getBikeList()', () => {
    it('Returns an unfiltered list of bikes', async () => {
        const results = await getBikeList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of bikes', async () => {
        const membershipId = 42;
        const membershipAdmin = 'membership42Admin';

        const results = await getBikeList(membershipId);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.membershipAdmin).toBe(membershipAdmin);
        });
    });

    it('Returns an empty list of bikes without error', async () => {
        const membershipId = 1000;
        const results = await getBikeList(membershipId);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(0);
    });

    it('Throws for internal server error', async () => {
        const membershipId = -100;
        await expect(getBikeList(membershipId)).rejects.toThrow('internal server error');
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

describe('patchBike()', () => {
    const testPatchWithObject = async (req: PatchBikeRequest) => {
        const bikeId = 42;
        // no error means success
        await patchBike(bikeId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a bike with year field', async () => {
        await testPatchWithObject({ year: '2000' });
    });

    it('Patches a bike with make field', async () => {
        await testPatchWithObject({ make: 'Yamahondayota' });
    });

    it('Patches a bike with model field', async () => {
        await testPatchWithObject({ model: 'Impossible Chicken Sandwich' });
    });

    it('Patches a bike with membershipId field', async () => {
        await testPatchWithObject({ membershipId: 42 });
    });

    it('Throws for bike not found', async () => {
        const bikeId = 3000;
        await expect(patchBike(bikeId, {})).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const bikeId = -100;
        await expect(patchBike(bikeId, {})).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
