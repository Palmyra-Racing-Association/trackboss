import 'dotenv/config';
import {
    deleteBoardMember,
    getBoardMember,
    getBoardMemberList,
    insertBoardMember,
    patchBoardMember,
} from '../../../database/boardMember';
import { PatchBoardMemberRequest } from '../../../typedefs/boardMember';
import { mockQuery } from './mockQuery';

describe('insertBoardMember()', () => {
    it('Inserts a board member', async () => {
        const request = { year: 2050, memberId: 5, boardMemberTitleId: 2 };
        const result = await insertBoardMember(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { year: 1452, memberId: 5, boardMemberTitleId: 2 };
        await expect(insertBoardMember(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { year: -100, memberId: 5, boardMemberTitleId: 2 };
        await expect(insertBoardMember(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { year: -200, memberId: 5, boardMemberTitleId: 2 };
        await expect(insertBoardMember(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getBoardMemberList()', () => {
    it('Returns an unfiltered list of board members', async () => {
        const results = await getBoardMemberList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of board members on year', async () => {
        const year = '2022';
        const results = await getBoardMemberList(year);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.year).toBe(+year);
        });
    });

    it('Returns an empty list of events without error', async () => {
        const year = '9999';
        const results = await getBoardMemberList(year);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(0);
    });

    it('Throws for internal server error', async () => {
        const year = '-100';
        await expect(getBoardMemberList(year)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getBoardMember()', () => {
    it('Selects a board member', async () => {
        const boardId = 10;
        const origValues = [
            10,
            'Public Relations',
            2022,
            1,
        ];
        const result = await getBoardMember(boardId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.boardId).toBe(boardId);
        expect(result.title).toBe(origValues[1]);
        expect(result.year).toBe(origValues[2]);
        expect(result.memberId).toBe(origValues[3]);
    });

    it('Throws for boardMember not found', async () => {
        const boardId = 765;
        await expect(getBoardMember(boardId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardId = -100;
        await expect(getBoardMember(boardId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchBoardMember()', () => {
    const testPatchWithObject = async (req: PatchBoardMemberRequest) => {
        const boardId = 42;
        // no error means success
        await patchBoardMember(boardId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches an event with year field', async () => {
        await testPatchWithObject({ year: 2025 });
    });

    it('Patches an event with memberId field', async () => {
        await testPatchWithObject({ memberId: 10 });
    });

    it('Patches an event with boardMemberTitleId field', async () => {
        await testPatchWithObject({ boardMemberTitleId: 5 });
    });

    it('Throws for user error', async () => {
        const boardId = 1451;
        await expect(patchBoardMember(boardId, { })).rejects.toThrow('user input error');
    });

    it('Throws for member not found', async () => {
        const boardId = 3000;
        await expect(patchBoardMember(boardId, { year: 2020 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardId = -100;
        await expect(patchBoardMember(boardId, { year: 2020 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const boardId = -200;
        await expect(patchBoardMember(boardId, { year: 2020 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('deleteBoardMember()', () => {
    it('deletes a single board member', async () => {
        const boardId = 50;
        await deleteBoardMember(boardId);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const boardId = 5000;
        await expect(deleteBoardMember(boardId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardId = -100;
        await expect(deleteBoardMember(boardId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
