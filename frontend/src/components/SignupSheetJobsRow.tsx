import {
    Box, Button, Input, NumberInput, NumberInputField, SimpleGrid, Switch, Text, useDisclosure, useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import { EventJob } from '../../../src/typedefs/eventJob';
import { UserContext } from '../contexts/UserContext';
import { getEventJob, updateEventJob, deleteEventJob } from '../controller/eventJob';
import { updateJobType } from '../controller/jobType';
import DeleteAlert from './DeleteAlert';

/**
 * A component representing a row in a PRA signup sheet, with all the data to represent a job.
 *
 * @param props
 * @returns
 */
function SignupSheetJobsRow(props: any) {
    // This is using a callback (props.updateRow) from the parent component to update data, so we have to do funky
    // stuff which is why props is an "any" instead of a type.  Javascript woudl allow this, typescript requires us
    // to jump through hoops.  Although if I'm writing a book about why I did this this way I guess I know what
    // the heck I am doing.. :)

    const { state } = useContext(UserContext);
    const disableInputs = (state.user?.memberType !== 'Admin');

    // this is a JobType we just refer to it like an any to keep TS happy.
    let { data } = props;

    const toast = useToast();

    const [description, setDescription] = useState<string>(data.title);
    const [pointValue, setPointValue] = useState<number>(data.pointValue);
    const [cashValue, setCashValue] = useState<number>(data.cashValue);
    const [mealTicketValue, setMealTicketValue] = useState<boolean>(data.mealTicket);
    const [count, setCount] = useState<number>(data.count || -1);
    const [sortOrder, setSortOrder] = useState<number>(data.sortOrder);
    const [dirty, setDirty] = useState<boolean>(false);
    const { onClose, isOpen, onOpen } = useDisclosure();

    const jobCopy = JSON.parse(JSON.stringify(data));

    return (
        <Box ml={10} maxWidth="50%">
            <SimpleGrid columns={[2, 3, 3]} spacing={2}>
                <Box maxWidth={250}>
                    <Text fontSize="sm">Description</Text>
                    <Input
                        placeholder={data.title}
                        onChange={
                            (event) => {
                                setDescription(event.target.value);
                                setDirty(true);
                            }
                        }
                    />
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Point Value</Text>
                    <NumberInput min={0} max={30} step={0.25}>
                        <NumberInputField
                            placeholder={`${data.pointValue}`}
                            onChange={
                                (event) => {
                                    setPointValue(parseFloat(event.target.value));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Cash Payout</Text>
                    <NumberInput min={0} max={750} step={10}>
                        <NumberInputField
                            placeholder={`${data.cashValue}`}
                            onChange={
                                (event) => {
                                    setCashValue(parseFloat(event.target.value));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Meal Ticket?</Text>
                    <Switch
                        colorScheme="orange"
                        defaultChecked={data.mealTicket}
                        size="lg"
                        onChange={
                            () => {
                                setMealTicketValue(!data.mealTicket);
                                setDirty(true);
                            }
                        }
                    />
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Positions</Text>
                    <NumberInput min={1} max={300} step={1} isDisabled>
                        <NumberInputField
                            placeholder={`${data.count}`}
                            onChange={
                                (event) => {
                                    setCount(parseInt(event.target.value, 10));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Display Order</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField
                            placeholder={`${data.sortOrder}`}
                            onChange={
                                (event) => {
                                    setSortOrder(parseInt(event.target.value, 10));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
            </SimpleGrid>
            <Button
                disabled={disableInputs || !dirty}
                backgroundColor="orange.300"
                color="white"
                mt={2}
                onClick={
                    async () => {
                        jobCopy.title = description;
                        jobCopy.pointValue = pointValue;
                        jobCopy.cashValue = cashValue;
                        jobCopy.mealTicket = mealTicketValue;
                        jobCopy.count = count;
                        jobCopy.sortOrder = sortOrder;
                        jobCopy.active = true;
                        if (dirty) {
                            // save the job type
                            const eventJob = await getEventJob(state.token, jobCopy.eventJobId) as EventJob;
                            eventJob.count = jobCopy.count;
                            await updateEventJob(state.token, jobCopy.eventJobId, eventJob);
                            await updateJobType(state.token, jobCopy.jobTypeId, jobCopy);
                        }
                        setDirty(false);
                        toast({
                            containerStyle: {
                                background: 'orange',
                            },
                            // eslint-disable-next-line max-len
                            title: `${jobCopy.title} updated. (Job Type ID ${jobCopy.jobTypeId} user ${state.user?.email})`,
                            description: JSON.stringify(jobCopy),
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                        });
                        // call back to EventSignupSheet to clean it up.
                        props.refreshData();
                        data = jobCopy;
                    }
                }
            >
                Save
            </Button>
            <Button
                hidden={disableInputs}
                leftIcon={<BsTrashFill />}
                mt={2}
                ml={2}
                backgroundColor="red"
                color="white"
                onClick={
                    () => {
                        onOpen();
                    }
                }
            >
                Delete
            </Button>
            <DeleteAlert
                isOpen={isOpen}
                onClose={onClose}
                removeMethod={
                    async () => {
                        await deleteEventJob(state.token, props.data.eventJobId);
                        props.refreshData();
                    }
                }
            />
        </Box>
    );
}

export default SignupSheetJobsRow;
