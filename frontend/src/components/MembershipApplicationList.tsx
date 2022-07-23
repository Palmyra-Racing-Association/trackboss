import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { MembershipApplication } from '../../../src/typedefs/membershipApplication';
import { UserContext } from '../contexts/UserContext';
import { getMembershipApplications } from '../controller/membershipApplication';

const columns: any = [
    {
        name: 'Last Name',
        selector: (row: MembershipApplication) => row.lastName,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: (row: MembershipApplication) => row.firstName,
        sortable: true,
    },
    {
        name: 'City',
        selector: (row: MembershipApplication) => row.city,
        sortable: true,
    },
    {
        name: 'Google Link',
        selector: (row: MembershipApplication) => row.googleLink,
        sortable: true,
    },
];

const customStyles = {
    rows: {
        style: {
            minHeight: '65px',
        },
    },
    headCells: {
        style: {
            marginTop: '20px',
            paddingTop: '0',
            fontSize: '1.5em',
            backgroundColor: '#f9f9f9',
            color: '#626262',
        },
    },
    cells: {
        style: {
            fontSize: '1.2em',
        },
    },
};

export default function MembershipApplicationList() {
    const [cells, setCells] = useState<MembershipApplication[]>([]);

    const { state } = useContext(UserContext);

    useEffect(() => {
        async function getData() {
            const c: MembershipApplication[] = await getMembershipApplications(state.token);
            setCells(c);
        }
        getData();
    }, []);

    return (
        <div>
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                responsive
                striped
                subHeaderWrap
                defaultSortFieldId={1}
                customStyles={customStyles}
                paginationComponentOptions={
                    {
                        selectAllRowsItem: true,
                    }
                }
            />
        </div>
    );
}
