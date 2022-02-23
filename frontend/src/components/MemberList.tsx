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

function getFormattedMemberListLocal() {
    const response = getFormattedMemberList('test');
    return response;
}

const customStyles = {
    rows: {
        style: {
            minHeight: '72px',
        },
    },
    headCells: {
        style: {
            paddingTop: '3em',
            fontSize: '3.5em',
            backgroundColor: '#f9f9f9',
            color: '#626262',
        },
    },
    cells: {
        style: {
            fontSize: '2.5em',
        },
    },
};

interface Member {
    id: number,
    name: string,
    role: string,
}

function MemberList() {
    const [cells, setCells] = useState([] as Member[]);
    useEffect(() => {
        async function getData() {
            const c: Member[] = getFormattedMemberListLocal();
            setCells(c);
        }
        getData();
    }, []);
    return (
        <div data-testid="table">
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
        </div>
    );
}

export default MemberList;
