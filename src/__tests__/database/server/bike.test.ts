import _ from 'lodash';
import mysql, { OkPacket, QueryOptions, RowDataPacket } from 'mysql2/promise';
import { getBike, insertBike}  from '../../../database/bike';
import pool from '../../../database/pool';
import { PostNewBikeRequest } from '../../../typedefs/bike';
//import { mockGetQuery, mockInsertQuery } from './mocks/bike';
import { mockQuery } from './mock';


describe('insertBike' , () => {
    it('Insert a single bike', async () => {
        const origValues  = {year: '2010', make: 'Prius', model: 'OK123', membershipId: 20};

        const result = await insertBike(origValues)
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });
})


describe('getBike' , () => {
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

})

