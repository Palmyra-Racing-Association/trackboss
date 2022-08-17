import { ErrorResponse } from './errorResponse';

export type RidingAreaStatus = {
    id?: number,
    name: string,
    isOpen: boolean,
}

export type PostRidingAreaStatusRequest = {
    name: string
    isOpen: boolean,
}

export type PostRidingAreaStatusResponse = RidingAreaStatus | ErrorResponse;

export type GetRidingAreaStatusRequest = Record<string, never>;

export type GetRidingAreaStatusResponse = RidingAreaStatus[] | ErrorResponse;
