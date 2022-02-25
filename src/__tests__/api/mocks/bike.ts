import _ from 'lodash';
import * as bike from '../../../database/bike';
import { Bike, PatchBikeRequest, PostNewBikeRequest } from '../../../typedefs/bike';

export const bikeList: Bike[] = [
    {
        bikeId: 0,
        year: '2001',
        make: 'Suzuki',
        model: 'TT-R230',
        membershipAdmin: 'Guy Fieri',
    },
    {
        bikeId: 1,
        year: '2013',
        make: 'Kawasaki',
        model: 'YZ125',
        membershipAdmin: 'Joe Blow',
    },
];

export const mockInsertBike = jest.spyOn(bike, 'insertBike').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((req: PostNewBikeRequest): Promise<number> => {
    const newBike = {
        bikeId: bikeList.length,
        year: req.year as string,
        make: req.make as string,
        model: req.model as string,
        membershipAdmin: '',
    };
    return Promise.resolve(bikeList.push(newBike) - 1);
});

export const mockGetBike = jest.spyOn(bike, 'getBike').mockImplementation((bikeId: number) => {
    let returnBike: Bike[] = [];
    if (bikeId === 400) {
        throw new Error('internal server error');
    }
    returnBike = _.filter(bikeList, (mem: Bike) => mem.bikeId === bikeId);

    if (returnBike.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnBike[0]);
});

export const mockGetBikeList = jest.spyOn(bike, 'getBikeList').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((membershipId?: number): Promise<Bike[]> => {
    let bikes: Bike[] = [];
    if (typeof membershipId === 'undefined') {
        bikes = bikeList;
    } else if (membershipId === 0) {
        bikes = _.filter(bikeList, (b: Bike) => b.membershipAdmin === 'Guy Fieri');
    } else if (membershipId === 1) {
        bikes = _.filter(bikeList, (b: Bike) => b.membershipAdmin === 'Joe Blow');
    }
    return Promise.resolve(bikes);
});

export const mockPatchBike = jest.spyOn(bike, 'patchBike').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (bikeId: number, req: PatchBikeRequest): Promise<void> => {
    const filtered = _.filter(bikeList, (b: Bike) => b.bikeId === bikeId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    bikeList[bikeId] = {
        ...bikeList[bikeId],
        ...req,
    };
});

export const mockDeleteBike = jest.spyOn(bike, 'deleteBike').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementation(async (bikeId: number): Promise<void> => {
    const deleted = _.remove(bikeList, (b: Bike) => b.bikeId === bikeId);
    if (deleted.length === 0) {
        throw new Error('not found');
    }
});
