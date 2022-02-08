export function generateHeaders(token: string, range?: string): Headers {
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

export function getTodaysDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const todayString = `${yyyy}${mm}${dd}-`;
    return todayString;
}
