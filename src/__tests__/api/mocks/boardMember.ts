import _ from 'lodash';
import { BoardMember, PostNewBoardMemberRequest } from '../../../typedefs/boardMember';
import * as boardMember from '../../../database/boardMember';

export const boardMemberList: BoardMember[] = [
    {
        boardId: 0,
        title: 'President',
        year: 2022,
        memberId: 0,
    },
    {
        boardId: 1,
        title: 'President',
        year: 2022,
        memberId: 1,
    },
    {
        boardId: 2,
        title: 'President',
        year: 2022,
        memberId: 2,
    },
];

export const mockInsertBoardMember = jest.spyOn(boardMember, 'insertBoardMember')
    .mockImplementationOnce((): Promise<number> => {
        throw new Error('internal server error');
    }).mockImplementationOnce((): Promise<number> => {
        throw new Error('user input error');
    }).mockImplementation((req: PostNewBoardMemberRequest): Promise<number> => {
        let title = '';
        switch (req.boardMemberTitleId) {
            case 0:
                title = 'President';
                break;
            case 1:
                title = 'Secretary';
                break;
            default:
                title = 'a new board member';
        }
        const newMember = {
            boardId: boardMemberList.length,
            title,
            year: req.year,
            memberId: req.memberId,
        };
        return Promise.resolve(boardMemberList.push(newMember) - 1);
    });

export const mockGetBoardMember = jest.spyOn(boardMember, 'getBoardMember')
    .mockImplementation((id: number): Promise<BoardMember> => {
        let returnMemeber: BoardMember[] = [];
        // if (id === 400) {
        //     throw new Error('internal server error');
        // }
        returnMemeber = _.filter(boardMemberList, (mem: BoardMember) => mem.boardId === id);
        if (returnMemeber.length === 0) {
            throw new Error('not found');
        }
        return Promise.resolve(returnMemeber[0]);
    });
