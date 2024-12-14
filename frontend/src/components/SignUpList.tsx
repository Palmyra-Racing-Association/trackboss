import {
    Alert,
    Box, Center, Flex, IconButton, Input, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsPrinter, BsSearch } from 'react-icons/bs';
import { getSignupList, getSignupListExcel } from '../controller/job';
import { UserContext } from '../contexts/UserContext';
import SignupButtonRow from './SignupButtonRow';
import { getEvent } from '../controller/event';
import { Event } from '../../../src/typedefs/event';

interface Worker {
    name: string,
    job: string,
    verified: boolean
}

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

/*
const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All Rows',
};
*/

interface SignupListProps {
    eventId: number,
    eventType: string,
}

export default function SignUpList(props: SignupListProps) {
    const columns: any = [
        {
            name: 'Name',
            selector: (row: { member: string; }) => row.member,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Job',
            selector: (row: { title: string; }) => row.title,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Points',
            selector: (row: { pointsAwarded: number; }) => row.pointsAwarded,
            sortable: true,
        },
        {
            name: 'Cash Payout',
            selector: (row: { cashPayout: number; }) => row.cashPayout,
            hide: 'sm',
        },
        {
            name: 'Job Day',
            selector: (row: {jobDay: string; }) => row.jobDay,
            sortable: true,
            wrap: true,
            hide: 'sm',
            omit: ((props.eventType.toLowerCase() !== 'race') && (props.eventType.toLowerCase() !== 'harescramble')),
        },
    ];
    const [cells, setCells] = useState([] as Worker[]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allCells, setAllCells] = useState<Worker[]>([]);
    const [signupEvent, setSignupEvent] = useState<Event>();

    const { state } = useContext(UserContext);

    async function getSignupListData() {
        const eventJobs = await getSignupList(state?.token, props.eventId);
        setCells(eventJobs);
        setAllCells(eventJobs);
    }

    async function getEventData() {
        const eventData = await getEvent(state?.token, props.eventId) as Event;
        setSignupEvent(eventData);
    }

    useEffect(() => {
        async function getData() {
            await getSignupListData();
            await getEventData();
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
                    const daySearch = cell.jobDay?.toLowerCase().includes(searchTerm.toLowerCase());
                    const nameSearch = cell.member?.toLowerCase().includes(searchTerm.toLowerCase());
                    return (titleSearch || daySearch || nameSearch);
                });
            setCells(newCells);
        }
    }, [searchTerm, allCells]);

    // temporary haxx, remove the cash payout column for non admins becuase REASONS (#449)
    if (state.user?.memberType !== 'Admin') {
        delete columns[3];
    }
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
                                async () => {
                                    // retrieve the signups for all race or HS jobs.
                                    const retrieveJobs = (
                                        props.eventType.toLowerCase().includes('race') ||
                                        (props.eventType === 'Harescramble') ||
                                        props.eventType === 'Camp And Ride'
                                    );
                                    const signupListExcel =
                                        await getSignupListExcel(state.token, props.eventId, retrieveJobs);
                                    const objectUrl = URL.createObjectURL(signupListExcel);
                                    window.location.href = objectUrl;
                                }
                            }
                            icon={<BsPrinter />}
                        />
                    </Box>
                </Flex>
            </Center>
            <Box>
                <Alert status="warning">
                    To choose a job expands its row, and click the signup button.  If you are an admin you can also
                    choose a name from the drop down, or type it in the dropdown to narrow the list.  Admins can also
                    assign a non member to a job.
                </Alert>
                <DataTable
                    columns={columns}
                    data={cells}
                    highlightOnHover
                    expandableRows
                    expandableRowsComponent={SignupButtonRow}
                    expandableRowsComponentProps={
                        {
                            refreshData: async () => {
                                await getSignupListData();
                            },
                            eventType: props.eventType,
                            restrictSignups: signupEvent?.restrictSignups,
                        }
                    }
                    responsive
                    subHeaderWrap
                    striped
                    customStyles={customStyles}
                />
            </Box>
        </div>
    );
}
