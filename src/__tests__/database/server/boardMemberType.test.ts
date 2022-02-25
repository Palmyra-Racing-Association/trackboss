import {
    deleteBoardMemberType,
    getBoardMemberType,
    getBoardMemberTypeList,
    insertBoardMemberType,
    patchBoardMemberType,
} from '../../../database/boardMemberType';
import { PatchBoardMemberTypeRequest } from '../../../typedefs/boardMemberType';

import { mockQuery } from './mockQuery';

describe('insertBoardMember()', () => {
    it('Inserts a board member', async () => {
        const request = { title: 'awesome new title' };
        const result = await insertBoardMemberType(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { title: '1452 badinput' };
        await expect(insertBoardMemberType(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { title: '-100 ISE' };
        await expect(insertBoardMemberType(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { title: '-200 bad' };
        await expect(insertBoardMemberType(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getBoardMemberTypeList()', () => {
    it('Returns a list of board members types', async () => {
        const results = await getBoardMemberTypeList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });
});

describe('getBoardMember()', () => {
    it('Selects a board member', async () => {
        const boardTypeId = 9;
        const origValues = [
            9,
            'Public Relations',
        ];
        const result = await getBoardMemberType(boardTypeId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.boardTypeId).toBe(boardTypeId);
        expect(result.title).toBe(origValues[1]);
    });

    it('Throws for board type not found', async () => {
        const boardTypeId = 765;
        await expect(getBoardMemberType(boardTypeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardTypeId = -100;
        await expect(getBoardMemberType(boardTypeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchBoardMemberType()', () => {
    const emptyReq = { boardTypeId: 100, title: '' };
    it('Patches an event with boardMemberTitleId field', async () => {
        const boardTypeId = 42;
        const title: PatchBoardMemberTypeRequest = { boardTypeId: 5, title: 'test pro' };
        // no error means success
        await patchBoardMemberType(boardTypeId, title);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const boardTypeId = 1451;
        await expect(patchBoardMemberType(boardTypeId, emptyReq)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for member not found', async () => {
        const boardTypeId = 3000;
        await expect(patchBoardMemberType(boardTypeId, emptyReq)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardTypeId = -100;
        await expect(patchBoardMemberType(boardTypeId, emptyReq)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const boardTypeId = -200;
        await expect(patchBoardMemberType(boardTypeId, emptyReq)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('deleteBoardMemberType()', () => {
    it('deletes a board member type', async () => {
        const boardTypeId = 50;
        await deleteBoardMemberType(boardTypeId);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const boardTypeId = 5000;
        await expect(deleteBoardMemberType(boardTypeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const boardTypeId = -100;
        await expect(deleteBoardMemberType(boardTypeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
