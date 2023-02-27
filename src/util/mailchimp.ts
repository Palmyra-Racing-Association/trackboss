import { setConfig, lists } from '@mailchimp/mailchimp_marketing';
import { Member } from '../typedefs/member';
import logger from '../logger';

function initConfig() {
    setConfig({
        apiKey: process.env.MAILCHIMP,
        server: 'us15',
    });
}

/*
export async function getMailchimpMembers() {
    initConfig();
    // magic numberism - this is the client ID that we are assigned by mailchimp because they only allow us one list
    const mailchimpList = await lists.getListMembersInfo('099d152f4d', { count: 1000 });
    return mailchimpList.members;
}
*/

export async function addMailchimpMember(member: Member) {
    initConfig();
    const newMailchimpContact = await lists.addListMember('099d152f4d', {
        email_address: member.email,
        status: 'subscribed',
        merge_fields: {
            FNAME: member.firstName,
            LNAME: member.lastName,
        },
    });
    logger.info('created new mailchimp contact', newMailchimpContact);
    return newMailchimpContact;
}

export async function removeMailchimpMember(member: Member) {
    initConfig();
    await lists.deleteListMember(
        '099d152f4d',
        member.email,
    );
    logger.info(`removed mailchimp contact with email ${member.email}`);
}
