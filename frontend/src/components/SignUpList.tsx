import React, { createRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
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

function SignUpList() {
    const signUpListRef = createRef<HTMLDivElement>();

    const [cells, setCells] = useState([] as Worker[]);
    useEffect(() => {
        async function getData() {
            const formattedResponse = getFormattedSignUpListLocal();
            setCells(formattedResponse);
        }
        getData();
    }, []);
    return (
        <div data-testid="table" ref={signUpListRef}>
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                responsive
                subHeaderWrap
                customStyles={customStyles}
            />
        </div>
    );
}

// The empty props here are needed so that the forwardRef can match its params to the correct types
const FunctionalComponentToPrint = React.forwardRef<HTMLDivElement>(
    (props, ref) => (
        <div ref={ref}>
            <SignUpList />
        </div>
    ),
);

export default FunctionalComponentToPrint;
