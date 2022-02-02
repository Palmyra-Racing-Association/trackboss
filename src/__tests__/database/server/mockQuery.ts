import { QueryOptions } from 'mysql2/promise';

import {
    GET_BIKE_LIST_BY_MEMBERSHIP_SQL,
    GET_BIKE_LIST_SQL,
    GET_BIKE_SQL,
    INSERT_BIKE_SQL,
} from '../../../database/bike';
import pool from '../../../database/pool';
import { getBikeListResponse, getBikeResponse, insertBikeResponse } from './mockHelpers/bike';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql: QueryOptions, values: any): Promise<any> => {
    switch (String(sql)) {
        case INSERT_BIKE_SQL:
            return insertBikeResponse(values[0]);
        case GET_BIKE_LIST_BY_MEMBERSHIP_SQL:
        case GET_BIKE_LIST_SQL:
            return getBikeListResponse(values);
        case GET_BIKE_SQL:
            return getBikeResponse(values[0]);
        default:
            return Promise.resolve();
    }
});

export default mockQuery;
