/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import _ from 'lodash';
import moment from 'moment';
import {
    Button,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { createRef, RefObject, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsChevronDown } from 'react-icons/bs';
import { Job } from '../../../src/typedefs/job';
import { UserContext } from '../contexts/UserContext';
import { getJobList } from '../controller/job';
import { getWorkPointsByMember, getWorkPointsTotal } from '../controller/workPoints';
import { getYearlyThreshold, getYearlyThresholdValue } from '../controller/billing';

const columns: any = [
    {
        name: 'Date',
        selector: (row: Job) => `${moment(row.start).utc().format('MM/DD/YYYY')}`,
        sortable: true,
    },
    {
        name: 'Job',
        selector: (row: Job) => `${row.title}`,
        sortable: true,
    },
    {
        name: 'Points',
        selector: (row: Job) => `${row.pointsAwarded}`,
        sortable: true,
    },
];

const customStyles = {
    headCells: {
        style: {
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

export default function WorkPointsHistory() {
    const [cells, setCells] = useState<Job[]>([]);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [years, setYears] = useState<number[]>([]);
    const [workPointsEarned, setWorkPointsEarned] = useState<number>(0);
    const [workPointsThreshold, setWorkPointsThreshold] = useState<number>(0);

    const { state } = useContext(UserContext);

    useEffect(() => {
        async function getData() {
            const jobs = await getJobList(state.token, 'memberID', state.user!.memberId as unknown as string);
            if ('reason' in jobs) {
                // squash error
            } else {
                const allYears: number[] = [];
                _.forEach(jobs, (job) => {
                    if (job.start === null) return;
                    const jobYear = new Date(job.start).getFullYear();
                    if (!allYears.includes(jobYear)) {
                        allYears.push(jobYear);
                    }
                });
                const currentYear = new Date().getFullYear();
                if (!allYears.includes(currentYear)) {
                    allYears.push(currentYear);
                }
                // reverse sort the years so that most recent is always at the top
                const sortedYears = allYears.sort((a, b) => (b - a));
                setYears(sortedYears);
                setAllJobs(jobs);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        setCells(_.filter(allJobs, (job) => new Date(job.start).getFullYear() === year));
        async function getData() {
            const workPoints = await getWorkPointsByMember(state.token, state.user!.memberId, year);
            const threshold = await getYearlyThreshold(state.token, year);
            if ('reason' in workPoints) {
                setWorkPointsEarned(0);
            } else {
                setWorkPointsEarned(workPoints.total);
            }
            if ('reason' in threshold) {
                // squash
            } else {
                setWorkPointsThreshold(threshold.threshold);
            }
        }
        getData();
    }, [year, allJobs]);

    return (
        <VStack bg="white">
            <HStack>
                <Menu>
                    <MenuButton bg="orange" color="white" as={Button} rightIcon={<BsChevronDown />}>
                        Past Years
                    </MenuButton>
                    <MenuList>
                        {
                            _.map(years, (listYear) => (
                                <MenuItem key={listYear} onClick={() => setYear(listYear)}>{listYear}</MenuItem>
                            ))
                        }
                    </MenuList>
                </Menu>
                <Heading>
                    Work Points History (
                    {year}
                    )
                </Heading>
            </HStack>
            <Heading color="orange" size="2xl">
                {`${workPointsEarned}/${workPointsThreshold}`}
            </Heading>

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
