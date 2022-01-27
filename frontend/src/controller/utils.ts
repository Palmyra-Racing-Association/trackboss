export default function generateHeaders(token: string) {
    return ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    });
}
