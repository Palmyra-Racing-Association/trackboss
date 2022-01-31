import { QueryOptions } from 'mysql2/promise';
import { INSERT_BIKE_SQL, GET_BIKE_SQL } from '../../../database/bike';
import pool from '../../../database/pool';
import { getBikeResponse, insertBikeResponse } from './mockHelpers/bike';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql: QueryOptions, values: any): Promise<any> => {
    switch (String(sql)) {
        case GET_BIKE_SQL:
            return getBikeResponse(values[0]);
        case INSERT_BIKE_SQL:
            return insertBikeResponse(values[0]);
        default:
            return Promise.resolve();
    }
});

export default mockQuery;
