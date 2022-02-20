import _ from 'lodash';

export function getWorkPointsByMemberResponse(values: number[]) {
    const pointsList = [
        {
            member_id: 7,
            year: 2021,
            total_points: 13,
        },
    ];

    const filterList =
        (memberId: number, year: number) => _.filter(
            pointsList,
            (points) => points.member_id === memberId && points.year === year,
        );

    if (values[0] < 0) {
        throw new Error('error message');
    }
    return Promise.resolve([filterList(values[0], values[1])]);
}

export function getWorkPointsByMembershipResponse(values: number[]) {
    const pointsList = [
        {
            membership_id: 7,
            year: 2021,
            total_points: 4,
        },
    ];
    const filterList =
    (memberId: number, year: number) => _.filter(
        pointsList,
        (points) => points.membership_id === memberId && points.year === year,
    );

    if (values[0] < 0) {
        throw new Error('error message');
    }
    return Promise.resolve([filterList(values[0], values[1])]);
}
