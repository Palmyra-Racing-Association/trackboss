export default function generateHeaders(token: string, range?: string) {
    if (typeof range !== 'undefined') {
        return ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }
    return ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Range: `${range}`,
    });
}
