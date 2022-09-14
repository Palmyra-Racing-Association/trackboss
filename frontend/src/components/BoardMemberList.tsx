import { Box, Center, Input, InputGroup, InputLeftElement, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsSearch } from 'react-icons/bs';
import { BoardMember } from '../../../src/typedefs/boardMember';
import { UserContext } from '../contexts/UserContext';
import { getAllBoardMembersForYear } from '../controller/boardMember';
import BoardMemberListRow from './BoardMemberListRow';
import YearsDropDown from './shared/YearsDropDown';

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

export default function BoardMemberList() {
    const [cells, setCells] = useState<BoardMember[]>([]);
    const [allCells, setAllCells] = useState<BoardMember[]>([]);
    const [year, setYear] = useState<number>((new Date()).getFullYear());

    const { state } = useContext(UserContext);
    const [error, setError] = useState<any | undefined>(undefined);

    const [searchTerm, setSearchTerm] = useState<string>('');

    async function getBoardMemberData() {
        let boardMembers : BoardMember[] = [];
        try {
            boardMembers = await getAllBoardMembersForYear(state.token, year) as BoardMember[];
        } catch (e) {
            setError(e);
        }
        setCells(boardMembers);
        setAllCells(boardMembers);
    }

    useEffect(() => {
        getBoardMemberData();
    }, [year]);

    useEffect(() => {
        if (searchTerm === '') {
            setCells(allCells);
        } else {
            const newCells =
                allCells.filter((cell: any) => {
                    const firstNameFound = cell.firstName.toLowerCase().includes(searchTerm);
                    const lastNameFound = cell.lastName.toLowerCase().includes(searchTerm);
                    const titleFound = cell.title?.toLowerCase().includes(searchTerm);
                    return (firstNameFound || lastNameFound || titleFound);
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
                <VStack>
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
                    <YearsDropDown
                        years={[2023, 2022, 2021]}
                        header=""
                        setYear={setYear}
                    />
                </VStack>
            </Center>
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                expandableRows={state.user?.memberType === 'Admin'}
                expandableRowsComponent={BoardMemberListRow}
                expandableRowsComponentProps={
                    {
                        year,
                        updateCallback: getBoardMemberData,
                    }
                }
                pagination
                paginationPerPage={20}
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
