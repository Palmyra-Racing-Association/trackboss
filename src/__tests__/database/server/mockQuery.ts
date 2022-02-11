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
import {
    GET_MEMBERSHIP_LIST_BY_STATUS_SQL,
    GET_MEMBERSHIP_LIST_SQL,
    GET_MEMBERSHIP_SQL,
    GET_REGISTERED_MEMBER_ID_SQL,
    GET_REGISTRATION_SQL,
    INSERT_MEMBERSHIP_SQL,
    PATCH_MEMBERSHIP_SQL,
    REGISTER_MEMBERSHIP_SQL,
} from '../../../database/membership';
import { GET_WORK_POINTS_BY_MEMBERSHIP_SQL, GET_WORK_POINTS_BY_MEMBER_SQL } from '../../../database/workPoints';
import {
    GET_EVENT_TYPE_LIST_SQL,
    GET_EVENT_TYPE_SQL,
    INSERT_EVENT_TYPE_SQL,
    PATCH_EVENT_TYPE_SQL,
} from '../../../database/eventType';

import pool from '../../../database/pool';
import * as bikeHelpers from './mockHelpers/bike';
import * as memberHelpers from './mockHelpers/member';
import * as membershipHelpers from './mockHelpers/membership';
import { getWorkPointsByMemberResponse, getWorkPointsByMembershipResponse } from './mockHelpers/workPoints';
import * as eventTypeHelpers from './mockHelpers/eventType';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation(async (sql: QueryOptions, values: any): Promise<any> => {
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
        case INSERT_MEMBERSHIP_SQL:
            return membershipHelpers.insertMembershipResponse(values[0]);
        case GET_MEMBERSHIP_LIST_BY_STATUS_SQL:
        case GET_MEMBERSHIP_LIST_SQL:
            return membershipHelpers.getMembershipListResponse(values);
        case GET_MEMBERSHIP_SQL:
            return membershipHelpers.getMembershipResponse(values[0]);
        case PATCH_MEMBERSHIP_SQL:
            return membershipHelpers.patchMembershipResponse(values[0]);
        case REGISTER_MEMBERSHIP_SQL:
            return membershipHelpers.registerMembershipResponse(values[0]);
        case GET_REGISTERED_MEMBER_ID_SQL:
            return membershipHelpers.getRegisteredMemberIdResponse();
        case GET_REGISTRATION_SQL:
            return membershipHelpers.getRegistrationResponse(values[0]);
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
        default:
            return Promise.resolve();
    }
});

export default mockQuery;
