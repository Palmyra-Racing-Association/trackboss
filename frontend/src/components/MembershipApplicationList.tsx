import { useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { MembershipApplication } from '../../../src/typedefs/membershipApplication';
import { UserContext } from '../contexts/UserContext';
import { getMembershipApplications } from '../controller/membershipApplication';
import MembershipApplicationModal from './modals/MembershipApplicationModal';

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
        name: 'Recommended By',
        selector: (row: MembershipApplication) => row.recommendedBy,
        sortable: true,
    },
    {
        name: 'Application date',
        selector: (row: MembershipApplication) => row.receivedDate,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: MembershipApplication) => row.status,
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
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [selectedApplication, setSelectedApplication] = useState<MembershipApplication>();
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
                onRowClicked={
                    (row: MembershipApplication) => {
                        setSelectedApplication(row);
                        onOpen();
                    }
                }
            />
            {
                (selectedApplication && (
                    <MembershipApplicationModal
                        isOpen={isOpen}
                        onClose={onClose}
                        addAction={() => undefined}
                        membershipApplication={selectedApplication}
                        token={state.token}
                    />
                )
                )
            }
        </div>
    );
}
