import { ErrorResponse } from './errorResponse';

export type Bill = {
    billId: number,
    generatedDate: string,
    year: number,
    amount: number,
    amountWithFee: number,
    membershipAdmin: string,
    membershipAdminEmail: string,
    emailedBill: string,
    curYearPaid: boolean
}

export type WorkPointThreshold = {
    year: number,
    threshold: number
}

export type GetWorkPointThresholdRequest = {}

export type GetWorkPointThresholdResponse = WorkPointThreshold | ErrorResponse

export type GetBillListRequest = {}

// Used only for the backend: API layer -> DB layer communication
export type GetBillListRequestFilters = {
    membershipId?: number,
    year?: number,
    paymentStatus?: string
}

export type GetBillListResponse = Bill[] | ErrorResponse

export type PostCalculateBillsRequest = {}

export type PostCalculateBillsResponse = Bill[] | ErrorResponse

// Used only for the backend: API layer -> DB layer communication
export type GenerateSingleBillRequest = {
    amount: number,
    amountWithFee: number,
    membershipId: number
}

export type GetMembershipBillListRequest = {}

export type GetMembershipBillListResponse = Bill[] | ErrorResponse

export type PostPayBillRequest = {}

export type PostPayBillResponse = {} | ErrorResponse
