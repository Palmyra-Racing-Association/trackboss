import { QueryOptions } from 'mysql2/promise';
import {
    GET_BIKE_LIST_BY_MEMBERSHIP_SQL,
    GET_BIKE_LIST_SQL,
    GET_BIKE_SQL,
    INSERT_BIKE_SQL,
    PATCH_BIKE_SQL,
    DELETE_BIKE_SQL,
} from '../../../database/bike';
import {
    GET_MEMBER_LIST_SQL,
    GET_MEMBER_LIST_BY_TYPE_SQL,
    GET_MEMBER_SQL,
    INSERT_MEMBER_SQL,
    PATCH_MEMBER_SQL,
} from '../../../database/member';
import { GET_WORK_POINTS_BY_MEMBERSHIP_SQL, GET_WORK_POINTS_BY_MEMBER_SQL } from '../../../database/workPoints';
import {
    GET_EVENT_TYPE_LIST_SQL,
    GET_EVENT_TYPE_SQL,
    INSERT_EVENT_TYPE_SQL,
    PATCH_EVENT_TYPE_SQL,
} from '../../../database/eventType';
import {
    GET_JOB_LIST_SQL,
    GET_JOB_SQL,
    INSERT_JOB_SQL,
    PATCH_JOB_SQL,
    DELETE_JOB_SQL,
} from '../../../database/job';

import pool from '../../../database/pool';
import * as bikeHelpers from './mockHelpers/bike';
import * as memberHelpers from './mockHelpers/member';
import { getWorkPointsByMemberResponse, getWorkPointsByMembershipResponse } from './mockHelpers/workPoints';
import * as eventTypeHelpers from './mockHelpers/eventType';
import * as jobHelpers from './mockHelpers/job';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql: QueryOptions, values: any): Promise<any> => {
    switch (String(sql)) {
        case INSERT_BIKE_SQL:
            return bikeHelpers.insertBikeResponse(values[0]);
        case GET_BIKE_LIST_BY_MEMBERSHIP_SQL:
        case GET_BIKE_LIST_SQL:
            return bikeHelpers.getBikeListResponse(values);
        case GET_BIKE_SQL:
            return bikeHelpers.getBikeResponse(values[0]);
        case PATCH_BIKE_SQL:
            return bikeHelpers.patchBikeResponse(values[0]);
        case DELETE_BIKE_SQL:
            return bikeHelpers.deleteBikeResponse(values[0]);
        case INSERT_MEMBER_SQL:
            return memberHelpers.insertMemberResponse(values[0]);
        case GET_MEMBER_LIST_BY_TYPE_SQL:
        case GET_MEMBER_LIST_SQL:
            return memberHelpers.getMemberListResponse(values);
        case GET_MEMBER_SQL:
            return memberHelpers.getMemberResponse(values[0]);
        case PATCH_MEMBER_SQL:
            return memberHelpers.patchMemberResponse(values[0]);
        case GET_WORK_POINTS_BY_MEMBER_SQL:
            return getWorkPointsByMemberResponse(values);
        case GET_WORK_POINTS_BY_MEMBERSHIP_SQL:
            return getWorkPointsByMembershipResponse(values);
        case GET_EVENT_TYPE_SQL:
            return eventTypeHelpers.getEventTypeResponse(values[0]);
        case GET_EVENT_TYPE_LIST_SQL:
            return eventTypeHelpers.getEventTypeListResponse();
        case INSERT_EVENT_TYPE_SQL:
            return eventTypeHelpers.insertEventTypeResponse(values[0]);
        case PATCH_EVENT_TYPE_SQL:
            return eventTypeHelpers.patchEventTypeResponse(values[0]);
        case GET_JOB_SQL:
            return jobHelpers.getJobResponse(values[0]);
        case INSERT_JOB_SQL:
            return jobHelpers.insertJobResponse(values[0]);
        case PATCH_JOB_SQL:
            return jobHelpers.patchJobResponse(values[0]);
        case DELETE_JOB_SQL:
            return jobHelpers.deleteJobResponse(values[0]);
        default:
            return Promise.resolve();
    }
});

export default mockQuery;
