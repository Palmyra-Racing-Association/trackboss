// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('@mailchimp/mailchimp_marketing');

client.setConfig({
    apiKey: process.env.MAILCHIMP,
    server: 'us15',
});

async function run() {
    const response = await client.lists.getListMembersInfo('099d152f4d', { count: 1000 });
    const { members } = response;
    members.forEach((element) => {
        console.log(element);
    });
    console.log(members.length);
}

run();
