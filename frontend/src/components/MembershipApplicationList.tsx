import { Box, Center, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsSearch } from 'react-icons/bs';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';
import { Member } from '../../../src/typedefs/member';
import { UserContext } from '../contexts/UserContext';
import { getMemberList } from '../controller/member';
import MemberSummaryModal from './MemberSummaryModal';

const columns: any = [
    {
        name: 'Last Name',
        selector: (row: Member) => row.lastName,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: (row: Member) => row.firstName,
        sortable: true,
    },
    {
        name: 'Membership Type',
        selector: (row: Member) => row.membershipType,
        sortable: true,
    },
    {
        name: 'Role',
        selector: (row: Member) => row.memberType,
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
    const [selectedMember, setSelectedMember] = useState<Member>();
    const [cells, setCells] = useState<Member[]>([]);
    const [allCells, setAllCells] = useState<Member[]>([]);

    const { state } = useContext(UserContext);
    const [error, setError] = useState<ErrorResponse | undefined>(undefined);
    const [dirty, setDirty] = useState<boolean>(false);
    const { onClose, isOpen, onOpen } = useDisclosure({ onClose: () => setDirty((oldDirty) => !oldDirty) });
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        async function getData() {
            const c: Member[] | ErrorResponse = await getMemberList(state.token);
            if ('reason' in c) {
                setError(c);
            } else {
                const activeMembers = _.filter(c, (member) => member.active);
                setCells(activeMembers);
                setAllCells(activeMembers);
                setError(undefined);
            }
        }
        getData();
    }, [dirty]);

    useEffect(() => {
        if (searchTerm === '') {
            setCells(allCells);
        } else {
            const newCells =
                allCells.filter((cell: any) => {
                    const firstNameFound = cell.firstName.toLowerCase().includes(searchTerm);
                    const lastNameFound = cell.lastName.toLowerCase().includes(searchTerm);
                    const typeFound = cell.membershipType.toLowerCase().includes(searchTerm);
                    return (firstNameFound || lastNameFound || typeFound);
                });
            setCells(newCells);
        }
    }, [searchTerm, allCells]);

    if (error) {
        return (
            <div>
                {error.reason}
            </div>
        );
    }
    return (
        <div>
            <Center>
                <Box maxWidth={300}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <BsSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                            size="lg"
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value?.toLowerCase())}
                        />
                    </InputGroup>
                </Box>
            </Center>
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
                    (row: Member) => {
                        setSelectedMember(row);
                        onOpen();
                    }
                }
            />
            {
                selectedMember && (
                    <MemberSummaryModal
                        isOpen={isOpen}
                        onClose={onClose}
                        memberInfo={selectedMember}
                    />
                )
            }
        </div>
    );
}
