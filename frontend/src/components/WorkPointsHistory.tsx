/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import _ from 'lodash';
import moment from 'moment';
import {
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberInput,
    SimpleGrid,
    VStack,
    useDisclosure,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    useToast,
} from '@chakra-ui/react';
import React, { createRef, RefObject, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Job } from '../../../src/typedefs/job';
import { UserContext } from '../contexts/UserContext';
import { getJobList, modifyJobPoints, deleteJob, removeSignup } from '../controller/job';
import { getWorkPointsByMembership, getWorkPointsTotal } from '../controller/workPoints';
import { getYearlyThreshold, getYearlyThresholdValue } from '../controller/billing';
// eslint-disable-next-line import/no-named-as-default
import AddPointsModal from './AddPointsModal';
import YearsDropDown from './shared/YearsDropDown';

const columns: any = [
    {
        name: 'Date',
        selector: (row: Job) => `${moment(row.start).utc().format('MM/DD/YYYY')}`,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Job',
        selector: (row: Job) => `${row.title}`,
        wrap: true,
        sortable: true,
    },
    {
        name: 'Points',
        selector: (row: Job) => {
            const isFutureSignup = moment(row.end).isAfter();
            if (isFutureSignup) {
                return `(${row.pointsAwarded} pending)`;
            }
            if (row.paid) {
                return 0;
            }
            return row.pointsAwarded;
        },
        sortable: true,
    },
    {
        name: 'Earned By',
        selector: (row: Job) => `${row.member}`,
        wrap: true,
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
    const [selectedJob, setSelectedJob] = useState<Job>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { state } = useContext(UserContext);

    async function getJobsData() {
        const jobs =
            await getJobList(state.token, 'membershipID', state.user!.membershipId as unknown as string) as Job[];
        jobs.sort((a, b) => {
            let order = 0;
            if (a.start < b.start) {
                order = 1;
            } else if (a.start > b.start) {
                order = -1;
            }
            return order;
        });
        if ('reason' in jobs) {
            // squash error
        } else {
            const allYears: number[] = [];
            // find the first year they were a member.
            let firstYear = parseInt(state.user?.dateJoined.substring(0, 4) || '0', 10);
            // but we tracked points offline before 2016 so we can only go from then on.
            if (firstYear < 2016) {
                firstYear = 2016;
            }
            const currentYear = new Date().getFullYear();
            for (let dropdownYear = firstYear; dropdownYear <= currentYear; dropdownYear++) {
                allYears.push(dropdownYear);
            }
            // reverse sort the years so that most recent is always at the top
            const sortedYears = allYears.sort((a, b) => (b - a));
            setYears(sortedYears);
            setAllJobs(jobs);
        }
    }

    useEffect(() => {
        getJobsData();
    }, []);

    useEffect(() => {
        setCells(_.filter(allJobs, (job) => new Date(job.start).getFullYear() === year));
        async function getData() {
            const workPoints = await getWorkPointsByMembership(state.token, state.user!.membershipId, year);
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

    const userActive = state.user?.active || false;
    const adminOrActingAsAdmin = (
        (state.storedUser?.memberType === 'Admin' || state.user?.memberType === 'Admin') &&
        (userActive)
    );
    const toast = useToast();
    return (
        <VStack bg="white">
            <YearsDropDown
                years={years}
                header="Work Points History"
                setYear={setYear}
                initialYear={(new Date()).getFullYear()}
            />
            <Heading color="orange" size="2xl">
                {`${workPointsEarned}/${workPointsThreshold}`}
            </Heading>
            <AddPointsModal
                memberName={state?.user?.firstName || ''}
                membershipId={state?.user?.membershipId || 0}
                memberId={state?.user?.memberId as number}
                // eslint-disable-next-line max-len
                visible={adminOrActingAsAdmin}
                token={state.token}
                // eslint-disable-next-line react/jsx-no-bind
                refreshPoints={getJobsData}
            />
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                responsive
                subHeaderWrap
                customStyles={customStyles}
                onRowClicked={
                    (row: Job) => {
                        setSelectedJob(row);
                        if (adminOrActingAsAdmin) {
                            onOpen();
                        }
                    }
                }
            />
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{`Edit points for ${state?.user?.firstName} - ${selectedJob?.title}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <SimpleGrid columns={2}>
                            <NumberInput
                                min={0}
                                max={30}
                                defaultValue={selectedJob?.pointsAwarded}
                                step={0.25}
                                onChange={
                                    async (changeValue) => {
                                        // eslint-disable-next-line max-len
                                        await modifyJobPoints(state.token, selectedJob?.jobId || 0, parseFloat(changeValue) || 0);
                                        getJobsData();
                                        toast({
                                            containerStyle: {
                                                background: 'orange',
                                            },
                                            // eslint-disable-next-line max-len
                                            title: 'Points updated!',
                                            // eslint-disable-next-line max-len
                                            description: `${selectedJob?.member} ${selectedJob?.title}, ${changeValue}`,
                                            status: 'success',
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                    }
                                }
                            >
                                <NumberInputField
                                    placeholder="Points earned"
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={onClose}
                            backgroundColor="orange"
                            color="white"
                            mr={3}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={
                                async () => {
                                    await removeSignup(state.token, selectedJob?.jobId || 0);
                                    getJobsData();
                                    toast({
                                        containerStyle: {
                                            background: 'red',
                                        },
                                        // eslint-disable-next-line max-len
                                        title: 'Entry removed',
                                        // eslint-disable-next-line max-len
                                        description: `${selectedJob?.member} ${selectedJob?.title}, ${selectedJob?.jobId}`,
                                        status: 'success',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    onClose();
                                }
                            }
                            backgroundColor="red"
                            color="white"
                            mr={3}
                        >
                            Delete
                        </Button>
                        <Button onClick={onClose} backgroundColor="white">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
