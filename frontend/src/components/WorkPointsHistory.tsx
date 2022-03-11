/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import { Button, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Text, VStack } from '@chakra-ui/react';
import React, { createRef, RefObject, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsChevronDown } from 'react-icons/bs';
import { getFormattedJobList } from '../controller/job';

interface Job {
    start: string,
    title: string,
    pointsAwarded: string
}

const columns: any = [
    {
        name: 'Date',
        selector: (row: Job) => `${row.start}`,
    },
    {
        name: 'Job',
        selector: (row: Job) => `${row.title}`,
    },
    {
        name: 'Points',
        selector: (row: Job) => `${row.pointsAwarded}`,
    },
];

function getFormattedJobListLocal() {
    const response = getFormattedJobList();
    return response;
}

const customStyles = {
    rows: {
        style: {
            minHeight: '65px',
        },
    },
    headCells: {
        style: {
            marginTop: '90px',
            paddingTop: '0',
            fontSize: '3em',
            backgroundColor: '#f9f9f9',
            color: '#626262',
        },
    },
    cells: {
        style: {
            fontSize: '2.0em',
        },
    },
};

export default function WorkPointsHistory() {
    const [cells, setCells] = useState<Job[]>([]);
    useEffect(() => {
        async function getData() {
            const c: Job[] = getFormattedJobListLocal();
            setCells(c);
        }
        getData();
    }, []);
    return (
        <VStack bg="white">
            <HStack>
                <Menu>
                    <MenuButton bg="orange" color="white" as={Button} rightIcon={<BsChevronDown />}>
                        Past Years
                    </MenuButton>
                    <MenuList>
                        <MenuItem>2020-2021</MenuItem>
                    </MenuList>
                </Menu>
                <Heading>Work Points History</Heading>
            </HStack>
            <Heading color="orange" size="4xl">150 / 200 points</Heading>

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
        </VStack>
    );
}
