export type Job = {
    jobId: number,
    member: string,
    event: string,
    jobDate: Date,
    jobType: string,
    verified: boolean,
    verifiedDate: Date,
    pointsAwarded: number,
    paid: boolean,
    paidDate: Date,
    lastModifiedDate: Date,
    lastModifiedBy: string
}
