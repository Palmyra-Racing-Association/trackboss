import { getWorkPointsByMember, getWorkPointsByMembership } from '../../../database/workPoints';
import mockQuery from './mockQuery';

describe('getWorkPointsByMember()', () => {
    it('Returns a valid WorkPoints', async () => {
        const memberId = 7;
        const year = 2021;

        const result = await getWorkPointsByMember(memberId, year);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.total).toBe(13);
    });

    it('Throws for internal server error', async () => {
        const memberId = -17;
        const year = 2021;

        await expect(getWorkPointsByMember(memberId, year)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for member not found', async () => {
        const memberId = 19;
        const year = 2021;

        await expect(getWorkPointsByMember(memberId, year)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for year not found', async () => {
        const memberId = 7;
        const year = 2019;

        await expect(getWorkPointsByMember(memberId, year)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getWorkPointsByMembership()', () => {
    it('Returns a valid WorkPoints', async () => {
        const membershipId = 7;
        const year = 2021;

        const result = await getWorkPointsByMembership(membershipId, year);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.total).toBe(4);
    });

    it('Throws for internal server error', async () => {
        const membershipid = -17;
        const year = 2021;

        await expect(getWorkPointsByMembership(membershipid, year)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for membership not found', async () => {
        const membershipId = 19;
        const year = 2021;

        await expect(getWorkPointsByMembership(membershipId, year)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for year not found', async () => {
        const membershipId = 7;
        const year = 2019;

        await expect(getWorkPointsByMembership(membershipId, year)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });
});
