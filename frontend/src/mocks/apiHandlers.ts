import { rest } from 'msw';

const apiHandlers = [
    // me
    rest.get(`${process.env.REACT_APP_API_URL}/api/me`, (req, res, ctx) => res(ctx.status(200), ctx.json({
        memberId: 7,
        membershipAdmin: 'Some Guy',
        uuid: 'someUuid',
        active: true,
        memberType: 'Admin',
        firstName: 'Martin',
        lastName: 'Martian',
        phoneNumber: '000-000-0000',
        occupation: 'Champion Fake Man',
        email: 'fake@man.com',
        birthdate: '1997-08-13',
        dateJoined: '2020-01-01',
        address: '1 Street Way',
        city: 'Rochester',
        state: 'NY',
        zip: '14467',
        lastModifiedDate: '2020-01-01',
        lastModifiedBy: 'Some Guy',
    }))),
];

export default apiHandlers;
