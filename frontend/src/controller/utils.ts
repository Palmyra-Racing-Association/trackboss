export function errorHandler(response: any) {
    if (response.status === 400) {
        return 'Bad request';
    } if (response.status === 401) {
        return 'Unauthorized';
    } if (response.status === 404) {
        return 'Not found / No data';
    }
    return 'Error'; // Generic catch all
}


export function generateHeaders(token: string) {
    return ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    });
}
