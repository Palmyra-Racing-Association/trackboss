import _ from 'lodash';
import {
    BoardMemberType,
    PatchBoardMemberTypeRequest,
    PostNewBoardMemberTypeRequest,
} from '../../../typedefs/boardMemberType';
import * as boardMemberType from '../../../database/boardMemberType';

export const boardMemberTypeList: BoardMemberType[] = [
    {
        boardTypeId: 0,
        title: 'President',
    },
    {
        boardTypeId: 1,
        title: 'Secretary',
    },
];

export const mockInsertBoardMemberType = jest.spyOn(boardMemberType, 'insertBoardMemberType')
    .mockImplementationOnce((): Promise<number> => {
        throw new Error('internal server error');
    }).mockImplementationOnce((): Promise<number> => {
        throw new Error('user input error');
    }).mockImplementation((req: PostNewBoardMemberTypeRequest): Promise<number> => {
        const newType = {
            boardTypeId: boardMemberTypeList.length,
            title: req.title,
        };
        return Promise.resolve(boardMemberTypeList.push(newType) - 1);
    });

export const mockGetBoardMemberType = jest.spyOn(boardMemberType, 'getBoardMemberType')
    .mockImplementation((id: number): Promise<BoardMemberType> => {
        let returnMemeber: BoardMemberType[] = [];
        if (id === 400) {
            throw new Error('internal server error');
        }
        returnMemeber = _.filter(boardMemberTypeList, (mem: BoardMemberType) => mem.boardTypeId === id);
        if (returnMemeber.length === 0) {
            throw new Error('not found');
        }
        return Promise.resolve(returnMemeber[0]);
    });

export const mockGetBoardMemberTypeList =
    jest.spyOn(boardMemberType, 'getBoardMemberTypeList').mockImplementationOnce((): Promise<BoardMemberType[]> => {
        throw new Error('internal server error');
    }).mockImplementation((): Promise<BoardMemberType[]> => Promise.resolve(boardMemberTypeList));

export const mockPatchBoardMemberType = jest.spyOn(boardMemberType, 'patchBoardMemberType')
    .mockImplementationOnce(() => {
        throw new Error('internal server');
    }).mockImplementationOnce(async (): Promise<void> => {
        throw new Error('user input error');
    }).mockImplementation(async (boardId: number, req: PatchBoardMemberTypeRequest): Promise<void> => {
        const filtered = _.filter(boardMemberTypeList, (mem: BoardMemberType) => mem.boardTypeId === boardId);
        if (filtered.length === 0) {
            throw new Error('not found');
        }
        boardMemberTypeList[boardId] = {
            ...boardMemberTypeList[boardId],
            ...req,
        };
    });

export const mockDeleteBoardMemberType = jest.spyOn(boardMemberType, 'deleteBoardMemberType')
    .mockImplementationOnce(() => {
        throw new Error('internal server');
    }).mockImplementation(async (boardId: number): Promise<void> => {
        const deleted = _.remove(boardMemberTypeList, (mem: BoardMemberType) => mem.boardTypeId === boardId);
        if (deleted.length === 0) {
            throw new Error('not found');
        }
    });
