export type JobType = {
    jobTypeId: number,
    title: string,
    pointValue: number,
    cashValue: number,
    jobDayNumber: number,
    reserved: boolean,
    online: boolean,
    mealTicket: boolean,
    sortOrder: number,
    active: boolean,
    lastModifiedDate: Date,
    lastModifiedBy: string
}
