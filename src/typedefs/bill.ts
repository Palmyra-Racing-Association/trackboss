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

export type GetBillListResponse = Bill[] | ErrorResponse

export type PostCalculateBillsRequest = {}

export type PostCalculateBillsResponse = Bill[] | ErrorResponse

export type GetMembershipBillListRequest = {}

export type GetMembershipBillListResponse = Bill[] | ErrorResponse

export type PostPayBillRequest = {}

export type PostPayBillResponse = {} | ErrorResponse
