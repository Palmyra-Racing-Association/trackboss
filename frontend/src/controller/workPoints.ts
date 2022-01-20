export async function getByMember(memberId: Number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
    });
    if (response.status === 200) {
        return response.json();
    }
    return 'error: endpoint not found';
}

export async function getByMembership(membershipId: Number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}`, {
        method: 'GET',
        mode: 'no-cors',
    });
    if (response.status === 200) {
        return response.json();
    }
    return 'error: endpoint not found';
}
