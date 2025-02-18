import fs from 'fs';
import { schedule } from 'node-cron';
import Handlebars from 'handlebars';
import logger from '../logger';
import { getDefaultSettingValue } from '../database/defaultSettings';
import { getBillList } from '../database/billing';
import { Bill } from '../typedefs/bill';
import { MemberCommunication } from '../typedefs/memberCommunication';
import publishCommunicationSqs from '../util/sqspublisher';

export default function startPointsEmailJob() {
    schedule('41 23 15 * *', async () => {
        const templatePath = './src/jobs/pointsEmailTemplate.hbs';
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        const billingYear = new Date().getFullYear();
        const billingOn = ((await getDefaultSettingValue('BILLING_ENABLED')) === 'true');
        logger.info(`Starting billing with billing setting of ${billingOn}`);
        if (billingOn) {
            const billingList: Bill[] = await getBillList({
                year: Number(billingYear),
                membershipStatus: 'active',
            });
            billingList.forEach(async (bill) => {
                const htmlEmail = template(bill);
                const pointsCommunication : MemberCommunication = {
                    subject: `Palmyra Racing Association statement for ${billingYear} season`,
                    mechanism: 'EMAIL',
                    selectedTags: [],
                    senderId: 0,
                    text: htmlEmail,
                    members: [],
                };
                const member = {
                    email: bill.membershipAdminEmail,
                };
                pointsCommunication.members.push(member);
                const sqsResult = await publishCommunicationSqs(pointsCommunication);
                logger.debug(JSON.stringify(sqsResult));
            });
        } else {
            logger.info('Skipped billing statement runs due to setting being turned off.');
        }
    });
}
