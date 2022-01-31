export default function generateHeaders(token: string, range?: string): Headers {
    if (typeof range !== 'undefined') {
        return new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }
    return new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Range: `${range}`,
    });
}
