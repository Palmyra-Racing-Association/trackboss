import { ErrorResponse } from './errorResponse';

export type GateCode = {
    id?: number,
    year: number,
    gateCode?: string,
    message?: string,
}

export type PostGateCodeRequest = {
    year: number,
    gateCode: string,
}

export type PostGateCodeResponse = GateCode | ErrorResponse;

export type GetGateCodeRequest = Record<string, never>;

export type GetGateCodeResponse = GateCode | ErrorResponse;
