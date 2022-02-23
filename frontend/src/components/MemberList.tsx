import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getFormattedMemberList } from '../controller/member';

const columns: any = [
    {
        name: 'Name',
        selector: (row: { name: any; }) => row.name,
    },
    {
        name: 'Role',
        selector: (row: { role: any; }) => row.role,
    },
];

async function getFormattedMemberListLocal() {
    const response = await getFormattedMemberList('test');
    console.debug(response);
    return response;
}

const customStyles = {
    headCells: {
        style: {
            paddingTop: '3em',
            fontSize: '2.5em',
            backgroundColor: '#f9f9f9',
            color: '#626262',
        },
    },
    cells: {
        style: {
            fontSize: '1.5em',
        },
    },
};

function MemberList() {
    const [cells, setCells] = useState([]);
    useEffect(() => {
        async function getData() {
            const c: any = await getFormattedMemberListLocal();
            setCells(c);
        }
        getData();
    }, []);
    return (
        <DataTable
            columns={columns}
            data={cells}
            fixedHeaderScrollHeight="300px"
            highlightOnHover
            pagination
            responsive
            subHeaderWrap
            customStyles={customStyles}
        />
    );
}

export default MemberList;
