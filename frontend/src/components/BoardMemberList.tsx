import { Box, Center, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsSearch } from 'react-icons/bs';
import { BoardMember } from '../../../src/typedefs/boardMember';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';
import { Member } from '../../../src/typedefs/member';
import { UserContext } from '../contexts/UserContext';
import { getAllBoardMembersForCurrentYear } from '../controller/boardMember';
import { getMemberList } from '../controller/member';
import MemberSummaryModal from './MemberSummaryModal';

const columns: any = [
    {
        name: 'Last Name',
        selector: (row: BoardMember) => row.lastName,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: (row: BoardMember) => row.firstName,
        sortable: true,
    },
    {
        name: 'Title',
        selector: (row: BoardMember) => row.title,
        sortable: true,
    },
    {
        name: 'Email',
        selector: (row: BoardMember) => row.email,
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

export default function MemberList() {
    const [selectedMember, setSelectedMember] = useState<Member>();
    const [cells, setCells] = useState<BoardMember[]>([]);
    const [allCells, setAllCells] = useState<BoardMember[]>([]);

    const { state } = useContext(UserContext);
    const [error, setError] = useState<ErrorResponse | undefined>(undefined);
    const [dirty, setDirty] = useState<boolean>(false);
    const { onClose, isOpen, onOpen } = useDisclosure({ onClose: () => setDirty((oldDirty) => !oldDirty) });
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        async function getData() {
            const c: Member[] | ErrorResponse = await getMemberList(state.token);
            const boardMembers = await getAllBoardMembersForCurrentYear(state.token) as BoardMember[];
            setCells(boardMembers);
            setAllCells(boardMembers);
            if ('reason' in c) {
                setError(c);
            } else {
                if ('reason' in boardMembers) {
                    // do nothing, an error here isn't a big deal, it just means we can't show board member data
                } else {
                    _.forEach(boardMembers, (boardMember) => {
                        _.forEach(c, (member: Member) => {
                            if (member.memberId === boardMember.memberId) {
                                member.membershipType = `Board Member - ${boardMember.title}(${member.membershipType})`;
                                member.boardMemberData = boardMember;
                                return false;
                            }
                            return true;
                        });
                    });
                }
                // setCells(activeMembers);
                // setAllCells(activeMembers);
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
                    const typeFound = cell.membershipType?.toLowerCase().includes(searchTerm);
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
                paginationPerPage={100}
                paginationRowsPerPageOptions={[100, 200, cells.length]}
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
