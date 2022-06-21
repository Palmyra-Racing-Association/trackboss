/* eslint-disable import/prefer-default-export */
import { parse, addDays, format } from 'date-fns';

/**
 * Parse a string and get the correct date based on the job day number.
 * @param stringDate a date represented as a string.
 * @param jobDayNumber The job day number associated with this job (Wednesday = 1, Sunday = 6)
 * @returns string date with the correct date.
 */
export function calculateStartDate(stringDate: string, jobDayNumber: number) : string {
    const eventStart = parse(stringDate, 'yyyy-MM-dd HH:mm:ss', new Date());
    const jobDate = format(addDays(eventStart, (jobDayNumber - 1)), 'yyyy-MM-dd');
    return jobDate;
}
