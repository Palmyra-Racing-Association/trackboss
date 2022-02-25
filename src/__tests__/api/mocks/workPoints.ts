import { WorkPoints } from '../../../typedefs/workPoints';
import * as workPoints from '../../../database/workPoints';

export const pointsThisYear: WorkPoints = { total: 1000 };
export const pointsInTheDarkAges: WorkPoints = { total: 0 };

const mockImplementation = (id: number, year: number): Promise<WorkPoints> => {
    switch (id) {
        case 1: {
            if (year === 2020) {
                return Promise.resolve(pointsInTheDarkAges);
            }
            return Promise.resolve(pointsThisYear);
        }
        case 3000:
            throw new Error('not found');
        case -100:
            throw new Error('internal server error');
        default:
            throw new Error('reached unexpected case in mock');
    }
};

export const mockGetWorkPointsByMember =
    jest.spyOn(workPoints, 'getWorkPointsByMember').mockImplementation(mockImplementation);

export const mockGetWorkPointsByMembership =
    jest.spyOn(workPoints, 'getWorkPointsByMembership').mockImplementation(mockImplementation);
