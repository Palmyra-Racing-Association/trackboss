export type Bill = {
    billId: number,
    generatedDate: Date,
    year: number,
    amount: number,
    amountWithFee: number,
    membershipAdmin: string,
    membershipAdminEmail: string,
    emailedBill: Date,
    curYearPaid: boolean
}
