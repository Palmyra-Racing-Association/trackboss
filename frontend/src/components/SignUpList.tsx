import { IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsPrinter } from 'react-icons/bs';
import { getFormattedSignUpList } from '../controller/job';
import VerifyButton from './VerifyButton';

const columns: any = [
    {
        name: 'Name',
        selector: (row: { name: string; }) => row.name,
    },
    {
        name: 'Job',
        selector: (row: { job: string; }) => row.job,
    },
    {
        button: true,
        cell: (row: { verified: boolean }) => (<VerifyButton verified={row.verified} />),
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
function getFormattedSignUpListLocal() {
    const response = getFormattedSignUpList();
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
            paddingTop: '2em',
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

const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All Rows',
};

export default function SignUpList() {
    const [cells, setCells] = useState([] as Worker[]);
    useEffect(() => {
        async function getData() {
            const formattedResponse = getFormattedSignUpListLocal();
            setCells(formattedResponse);
        }
        getData();
    }, []);
    return (
        <div data-testid="table">
            <IconButton
                mt={5}
                size="lg"
                aria-label="Print"
                background="orange.300"
                color="white"
                onClick={() => window.print()}
                icon={<BsPrinter />}
            />
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
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
