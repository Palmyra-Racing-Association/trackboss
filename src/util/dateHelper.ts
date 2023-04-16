import { addDays, format, isBefore } from 'date-fns';

/**
 * Parse a string and get the correct date based on the job day number.
 * @param stringDate a date represented as a string.
 * @param jobDayNumber The job day number associated with this job (Wednesday = 1, Sunday = 6)
 * @returns string date with the correct date.
 */
export function calculateStartDate(stringDate: string, jobDayNumber: number) : string {
    const eventStart = new Date(Date.parse(stringDate));
    if (!jobDayNumber) {
        // eslint-disable-next-line no-param-reassign
        jobDayNumber = 1;
    }
    const jobDate = format(addDays(eventStart, (jobDayNumber - 1)), 'yyyy-MM-dd');
    return jobDate;
}

/**
 * Calculate the billing year based on the current date.  The rules are as follows:
 * Before April 30, it's the prior billing year because we are still working on renewals,
 * new memberships.
 * After April 30, it's the current billing year because all that paperwork is done so it is business as usual.
 *
 * @return number The billing year based on the logic.
 */
export function calculateBillingYear() : number {
    const rightNow = new Date();
    const rightNowYear = rightNow.getFullYear();
    let billingYear = rightNowYear;
    if (isBefore(rightNow, (new Date(rightNowYear, 4)))) {
        billingYear -= 1;
    }
    return billingYear;
}
