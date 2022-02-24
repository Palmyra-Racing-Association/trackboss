import me from '../controller/api';

describe('me controller', () => {
    it('returns a valid member', async () => {
        const member = await me('TestingToken');
        expect(member.memberId).toBe(7);
        expect(member.membershipAdmin).toBe('Some Guy');
        expect(member.uuid).toBe('someUuid');
        expect(member.active).toBe(true);
        expect(member.memberType).toBe('Admin');
        expect(member.firstName).toBe('Martin');
        expect(member.lastName).toBe('Martian');
        expect(member.phoneNumber).toBe('000-000-0000');
        expect(member.occupation).toBe('Champion Fake Man');
        expect(member.email).toBe('fake@man.com');
        expect(member.birthdate).toBe('1997-08-13');
        expect(member.dateJoined).toBe('2020-01-01');
        expect(member.address).toBe('1 Street Way');
        expect(member.city).toBe('Rochester');
        expect(member.state).toBe('NY');
        expect(member.zip).toBe('14467');
        expect(member.lastModifiedDate).toBe('2020-01-01');
        expect(member.lastModifiedBy).toBe('Some Guy');
    });
});
