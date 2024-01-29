import { useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { MembershipApplication } from '../../../src/typedefs/membershipApplication';
import { UserContext } from '../contexts/UserContext';
import { getMembershipApplications } from '../controller/membershipApplication';
import DataSearchBox from './input/DataSearchBox';
import MembershipApplicationModal from './modals/MembershipApplicationModal';

const columns: any = [
    {
        name: 'ID',
        selector: (row: MembershipApplication) => row.id,
        sortable: true,
    },
    {
        name: 'Priority',
        selector: (row: MembershipApplication) => (row.applicationPriority ? 'High' : 'Medium'),
        sortable: true,
    },
    {
        name: 'Last Name',
        selector: (row: MembershipApplication) => row.lastName,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: (row: MembershipApplication) => row.firstName,
        sortable: true,
        hide: 'sm',
    },
    {
        name: 'Application date',
        selector: (row: MembershipApplication) => row.receivedDate,
        sortable: true,
        wrap: true,
        hide: 'sm',
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
    const [filteredCells, setFilteredCells] = useState<MembershipApplication[]>([]);
    const { state } = useContext(UserContext);
    const [dirty, setDirty] = useState<boolean>(false);

    const { isOpen, onClose, onOpen } = useDisclosure(
        { onClose: () => setDirty((olDirtyGotYaMoney) => !olDirtyGotYaMoney) },
    );
    const [selectedApplication, setSelectedApplication] = useState<MembershipApplication>();
    const [searchTerm, setSearchTerm] = useState<string>('');

    async function getMembershipApplicationsData() {
        const allApplications: MembershipApplication[] = await getMembershipApplications(state.token);
        setCells(allApplications);
        setFilteredCells(allApplications);
    }

    useEffect(() => {
        getMembershipApplicationsData();
    }, [dirty]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCells(cells);
        } else {
            const filteredApplications = cells.filter((application) => {
                const firstNameFound = (application.firstName.toLowerCase().includes(searchTerm));
                const lastNameFound = (application.lastName.toLowerCase().includes(searchTerm));
                const statusFound = (application.status.toLowerCase().includes(searchTerm));
                return firstNameFound || lastNameFound || statusFound;
            });
            setFilteredCells(filteredApplications);
        }
    }, [searchTerm, cells]);

    return (
        <div>
            <DataSearchBox
                onTextChange={setSearchTerm}
                searchValue={searchTerm}
            />
            <DataTable
                columns={columns}
                data={filteredCells as MembershipApplication[]}
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
                        // eslint-disable-next-line react/jsx-no-bind
                        addAction={getMembershipApplicationsData}
                        membershipApplication={selectedApplication}
                        token={state.token}
                    />
                )
                )
            }
        </div>
    );
}
