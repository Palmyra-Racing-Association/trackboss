import React from 'react';
import DataTable from 'react-data-table-component';


interface signUpProps {

}

const columns =  [
    {
        name: 'Name',
        selector: (row: { name: string; }) => row.name,
    },
    {
        name: 'Job',
        selector: (row: { job: string; }) => row.job,
    },
    {
        name: '',
        selector: (row: { verified: boolean; }) => row.verified,
    },
];



export default function SignUpList(props: signUpProps) {
    return(
        <DataTable />
    );

}