export function getBikeResponse(id: number) {
    switch (id) {
        case 18:
            return Promise.resolve([[{
                bike_id: 18,
                year: '1996',
                make: 'Honda',
                model: 'WR450F',
                membership_admin: 'Addia Shipway',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertBikeResponse(year: string) {
    switch (year) {
        case '-100':
            throw new Error('error message');
        case '2010':
            return Promise.resolve([{ insertId: 321 }]);
        default:
            return Promise.resolve();
    }
}
