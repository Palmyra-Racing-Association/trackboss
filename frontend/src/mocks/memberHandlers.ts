import { rest } from 'msw';

const memberList = [{
    memberId: 1,
    firstName: 'Squeak',
    lastName: 'Trainywhel',
    membershipAdmin: 'Squeak Trainywhel',
    uuid: null,
    active: true,
    memberType: 'Admin',
    phoneNumber: '223-321-4438',
    occupation: 'Software Engineer',
    email: 'squeaky@trainingwheels.com',
    birthdate: '1981-08-13',
    dateJoined: '2016-10-18',
    address: '25 Laurel Hill',
    city: 'North Las Vegas',
    state: 'NV',
    zip: '59294',
    lastModifiedDate: null,
    lastModifiedBy: null,
},
{
    memberId: 2,
    firstName: 'Isobel',
    lastName: 'Jennery',
    membershipAdmin: 'Isobel Jennery',
    uuid: null,
    active: true,
    memberType: 'Membership Admin',
    phoneNumber: '223-321-4438',
    occupation: 'Account Executive',
    email: 'ijennery0@wikia.com',
    birthdate: '1981-08-13',
    dateJoined: '2016-10-18',
    address: '1869 Mifflin Park',
    city: 'Gatesville',
    state: 'TX',
    zip: '62140',
    lastModifiedDate: null,
    lastModifiedBy: null,
}];

const memberHandlers = [
    // createMember
    rest.post(`${process.env.REACT_APP_API_URL}/api/member/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.firstName === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.firstName === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.firstName === 'Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.firstName === 'Internal Server Error') {
            return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ memberId: 1 }));
    }),

    // getMemberList
    rest.get(`${process.env.REACT_APP_API_URL}/api/member/list`, (req, res, ctx) => {
        const status = req.url.searchParams.get('status');

        if (status === 'Badrequest') {
            return res(ctx.status(400), ctx.json({ reason: 'Badrequest' }));
        } if (status === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (status === 'NotFound') {
            return res(ctx.status(404), ctx.json({ reason: 'NotFound' }));
        } if (status === 'InternalServerError') {
            return res(ctx.status(404), ctx.json({ reason: 'InternalServerError' }));
        }
        return res(ctx.status(200), ctx.json(memberList));
    }),

    // getMember
    rest.get(`${process.env.REACT_APP_API_URL}/api/member/:memberID`, (req, res, ctx) => {
        const { memberID } = req.params;
        if (memberID === '1') {
            return res(ctx.status(200), ctx.json({ memberId: 1 }));
        } if (memberID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (memberID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (memberID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateMember
    rest.patch(`${process.env.REACT_APP_API_URL}/api/member/:memberID`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.firstName === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.firstName === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.firstName === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.firstName === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ memberId: 1 }));
    }),
];

export default memberHandlers;
