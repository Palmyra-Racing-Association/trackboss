import { Box, Center, Flex, IconButton, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsPrinter, BsSearch } from 'react-icons/bs';
import { getSignupList } from '../controller/job';
import { UserContext } from '../contexts/UserContext';
import VerifyButton from './VerifyButton';
import SignupButton from './SignupButton';

const columns: any = [
    {
        name: 'Name',
        // eslint-disable-next-line max-len
        cell: (row: { filled: boolean, jobId: number, member: string, memberId:number }) => (
            <SignupButton jobId={row.jobId} member={row.member} memberId={row.memberId} />
        ),
        style: {
            paddingRight: '2em',
        },
        sortable: true,
    },
    /*
    {
        name: 'Name',
        selector: (row: { member: string; }) => row.member,
        sortable: true,
    },
    */
    {
        name: 'Job',
        selector: (row: { title: string; }) => row.title,
        sortable: true,
    },
    {
        name: 'Points',
        selector: (row: { pointsAwarded: number; }) => row.pointsAwarded,
    },
    {
        button: true,
        // eslint-disable-next-line max-len
        cell: (row: { verified: boolean, jobId: number, member: string }) => (
            <VerifyButton verified={row.verified} jobId={row.jobId} member={row.member} />
        ),
        style: {
            paddingRight: '2em',
        },
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
            fontSize: '1.2em',
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
                allCells.filter((cell: Worker) => cell.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
                            <Input size="lg" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
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
            <DataTable
                columns={printing ? printingColumns : columns}
                data={cells}
                highlightOnHover
                pagination
                paginationComponentOptions={paginationComponentOptions}
                responsive
                subHeaderWrap
                customStyles={customStyles}
            />
        </div>
    );
}
