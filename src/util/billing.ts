import _ from 'lodash';
import { compareDesc, isFuture } from 'date-fns';
import { getJobList } from '../database/job';
import { generateBill, getBillList, markBillPaid } from '../database/billing';
import { getBaseDues } from '../database/membership';
import { getWorkPointsByMembership } from '../database/workPoints';
import logger from '../logger';
import { Bill } from '../typedefs/bill';
import { Membership } from '../typedefs/membership';
import { Job } from '../typedefs/job';

/**
 * Generate new bills in the database
 *
 * Note that an error generating a bill **does not** short-circuit the loop. The
 * function will create all the bills it can.
 *
 * (Extracted into helper function to ease testing)
 *
 * @param membershipList A bill is generated for each membership in this list
 * @param preGeneratedBills Any preexisting bills for the specified year so that
 * duplicate bills are not created
 * @param threshold The work point threshold for the specified year
 * @param year The year to generate bills for
 * @returns A list of *only* the bills that were just generated (does not
 * include preexisting bills)
 */
export async function generateNewBills(
    membershipList: Membership[],
    preGeneratedBills: Bill[],
    threshold: number,
    year: number,
): Promise<Bill[]> {
    await Promise.all(membershipList.map(async (membership) => {
        // only generate a bill if one hasn't already been generated
        if (typeof _.find(
            preGeneratedBills,
            (bill) => bill.membershipAdmin === membership.membershipAdmin,
        ) === 'undefined') {
            try {
                const baseDues = await getBaseDues(membership.membershipId);
                const earned = (await getWorkPointsByMembership(membership.membershipId, year)).total;
                const owed = Math.max((1 - earned / threshold) * baseDues, 0);
                // the Paypal Fee is 0.0290%, plus $0.30.  We hard code this here, with a big ole comment
                // describing what it is.  It's not great but their rule is generally static.
                let fee = (owed * 0.0290) + 0.30;
                if (owed === 0) {
                    fee = 0;
                }
                let workDetail = await getJobList({ membershipId: membership.membershipId, year });
                workDetail = workDetail.filter((job: Job) => (!job.paid && !isFuture(job.start as Date)));
                // sort by date.  I have to do this in JS due to the way jobs are stored in two different tables and
                // messed with here.  Post 2022 this will no longer be required.
                workDetail.sort((a: Job, b: Job) => compareDesc(a.start as Date, b.start as Date));
                const billId = await generateBill({
                    amount: owed,
                    amountWithFee: (owed + fee),
                    membershipId: membership.membershipId,
                    pointsEarned: earned,
                    pointsThreshold: threshold,
                    workDetail,
                });
                if (owed === 0) {
                    // flip the bill to paid if they owe zero. This is just easy record keeping.
                    await markBillPaid(billId);
                }
            } catch (e) {
                // generate more bills even if this one failed
                logger.error(`Failed to generate bill for membership with ID ${membership.membershipId}: ${e}`);
            }
        }
    }));
    const allBills = await getBillList({ year });
    return _.differenceWith(allBills, preGeneratedBills, _.isEqual);
}

/**
 * Email out all bills in the given list
 *
 * Ostensibly, none of the bills should have been emailed yet, but this function
 * protects against duplicate emails anyway.
 *
 * Note that an error emailing a bill **does not** short-circuit the loop. The
 * function will email all the bills it can.
 *
 * (Extracted into helper function to ease testing)
 *
 * @param billList The list of all bills to email out
 * @returns The updated list of bills (successfully-emailed bills are marked as
 * such)
 */
// TODO: remove this line when emailBills tests are un-skipped
/* istanbul ignore next */
export async function emailBills(billList: Bill[]): Promise<Bill[]> {
    await Promise.all(billList.map(async (bill) => {
        // prevent sending duplicate emails
        if (typeof bill.emailedBill === 'undefined') {
            try {
                //
                // TODO: send the email
                //
                // // (gonna need to import this fn from '../database/billing')
                // await markBillEmailed(bill.billId);
                // // update our local copy of the bill
                // bill.emailedBill = format(new Date(), 'yyyy-MM-dd');
                throw new Error('sending emails is unimplemented!');
            } catch (e) {
                // send more emails even if this one failed
                logger.error(`Failed to email bill ${bill.billId} to ${bill.membershipAdminEmail}: ${e}`);
            }
        }
    }));
    return billList;
}
