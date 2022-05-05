import {
    Box, Center, Flex, Icon, IconButton, Input, InputGroup, InputLeftElement,
    Tag, Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsPrinter, BsSearch, BsTrashFill } from 'react-icons/bs';
import { getSignupList, removeSignup, signupForJob } from '../controller/job';
import { UserContext } from '../contexts/UserContext';

const columns: any = [
    {
        name: 'Name',
        // eslint-disable-next-line max-len
        cell: (row: { filled: boolean, jobId: number, member: string, memberId: number }) => (
            // <SignupButton jobId={row.jobId} member={row.member} memberId={row.memberId} />
            <div data-tag="allowRowEvents">
                {
                    row.member &&
                    (
                        <>
                            {row.member}
                            <Icon data-tag="allowRowEvents" color="red" as={BsTrashFill} />
                        </>
                    ) ||
                    <Tag data-tag="allowRowEvents" height="50" background="orange.300" color="white">Sign up</Tag>
                }
            </div>
        ),
    },
    {
        name: 'Job',
        selector: (row: { title: string; }) => row.title,
        sortable: true, // Just until we can figure out why it doesnt work.  I think it's a state thing.
        wrap: true,
    },
    {
        name: 'Points',
        selector: (row: { pointsAwarded: number; }) => row.pointsAwarded,
        sortable: true, // Just until we can figure out why it doesn't work.  I think it's a state thing.
    },
    {
        name: 'Job Day',
        selector: (row: {jobDay: string; }) => row.jobDay,
        sortable: true,
        wrap: true,
        hide: 'sm',
    },
];

const printingColumns: any = [
    {
        name: 'Name',
        selector: (row: { name: string; }) => row.name,
    },
    {
        name: 'Job',
        selector: (row: { job: string; }) => row.job,
    },
    {
        cell: () => (<Text align="right" fontSize="xl">Sign Here: __________________</Text>),
        minWidth: '10em',
        style: {
            paddingRight: '2em',
        },
    },
];

interface Worker {
    name: string,
    job: string,
    verified: boolean
}

// not strictly necessary now but will be when the api is done and these become async functions

const customStyles = {
    rows: {
        style: {
            minHeight: '72px',
        },
    },
    headCells: {
        style: {
            paddingTop: '2em',
            fontSize: '1.5em',
            fontWeight: 'bold',
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

const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All Rows',
};

export default function SignUpList(props: any) {
    const [cells, setCells] = useState([] as Worker[]);
    const [printing, setPrinting] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allCells, setAllCells] = useState<Worker[]>([]);
    const { state } = useContext(UserContext);

    useEffect(() => {
        async function getData() {
            const eventJobs = await getSignupList(state?.token, props.eventId);
            setCells(eventJobs);
            setAllCells(eventJobs);
        }
        getData();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setCells(allCells);
        } else {
            const newCells =
                allCells.filter((cell: any) => {
                    const titleSearch = cell.title.toLowerCase().includes(searchTerm.toLowerCase());
                    const daySearch = cell.jobDay.toLowerCase().includes(searchTerm.toLowerCase());
                    const nameSearch = cell.member?.toLowerCase().includes(searchTerm.toLowerCase());
                    return (titleSearch || daySearch || nameSearch);
                });
            setCells(newCells);
        }
    }, [searchTerm, allCells]);
    return (
        <div data-testid="table">
            <Center>
                <Flex mt={5}>
                    <Box>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <BsSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                                size="lg"
                                placeholder="Search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Box>
                    <Box pl={5}>
                        <IconButton
                            size="lg"
                            aria-label="Print"
                            background="orange.300"
                            color="white"
                            onClick={
                                () => {
                                    setPrinting(true);
                                    setTimeout(() => {
                                        // Allows the data table to re-render before the print window opens
                                        window.print();
                                    }, 0);
                                    window.onafterprint = () => {
                                        setPrinting(false);
                                    };
                                }
                            }
                            icon={<BsPrinter />}
                        />
                    </Box>
                </Flex>
            </Center>
            <Box w="85%">
                To choose a job - click it.  To remove your selection, click again.
                <DataTable
                    columns={printing ? printingColumns : columns}
                    data={cells}
                    highlightOnHover
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    responsive
                    subHeaderWrap
                    striped
                    customStyles={customStyles}
                    onRowClicked={
                        async (row: any) => {
                            // I can delete my own signups, and of course admins can delete everyone's signups.
                            const allowDelete = (
                                (state?.user?.memberId === row.memberId) ||
                                (state.user?.memberType === 'Admin')
                            );
                            if (!row.member) {
                                await signupForJob(state.token, row.jobId, (state.user?.memberId || -1));
                            }
                            if ((row.member) && (allowDelete)) {
                                await removeSignup(state.token, row.jobId);
                            }
                            const eventJobs = await getSignupList(state?.token, props.eventId);
                            setCells(eventJobs);
                            setAllCells(eventJobs);
                        }
                    }
                />
            </Box>
        </div>
    );
}
