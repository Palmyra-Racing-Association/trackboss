import { ErrorResponse } from './errorResponse';

export type Bike = {
    bikeId: number,
    year: string,
    make: string,
    model: string,
    membershipAdmin: string
}

export type DeletedBike = {
    bikeId: number
}

export type PostNewBikeRequest = {
    year: string,
    make: string,
    model: string,
    membershipId: number
}

export type PostNewBikeResponse = Bike | ErrorResponse

export type GetBikeRequest = {}

export type GetBikeResponse = Bike | ErrorResponse

export type PatchBikeRequest = {
    year?: string,
    make?: string,
    model?: string,
    membershipId?: number
}

export type PatchBikeResponse = Bike | ErrorResponse

export type DeleteBikeRequest = {}

export type DeleteBikeResponse = DeletedBike | ErrorResponse

export type GetBikeListRequest = {}

export type GetBikeListResponse = Bike[] | ErrorResponse
