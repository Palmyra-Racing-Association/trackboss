export async function getByMember(memberId: Number) {
    const response = await fetch(`http://localhost:8080/api/workPoints/byMember/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
    });
    return response;
}

export async function getByMembership(membershipId: Number) {
    const response = await fetch(`http://localhost:8080/api/workPoints/byMembership/${membershipId}`, {
        method: 'GET',
        mode: 'no-cors',
    });
    return response;
}
