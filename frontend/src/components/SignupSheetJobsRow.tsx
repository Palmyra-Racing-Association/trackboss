import {
    Box, Button, NumberInput, NumberInputField, Select, SimpleGrid, Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { JobType } from '../../../src/typedefs/jobType';

interface RowProps {
    data: JobType,
}

/*
{
  "jobTypeId": 546,
  "title": "Rock Picking",
  "pointValue": 2,
  "cashValue": 0,
  "jobDayNumber": 2,
  "jobDay": "Wednesday",
  "active": true,
  "reserved": true,
  "online": false,
  "mealTicket": false,
  "sortOrder": 1,
  "count": 1,
  "lastModifiedDate": "2022-05-03T00:00:00.000Z",
  "lastModifiedBy": 10
}
*/

function SignupSheetJobsRow(props: RowProps) {
    const { data } = props;
    const mealTicket = data.mealTicket ? 'Yes' : 'No';
    const [pointValue, setPointValue] = useState<number>(data.pointValue);
    const [cashValue, setCashValue] = useState<number>(data.cashValue);
    const [mealTicketValue, setMealTicketValue] = useState<boolean>(data.mealTicket);
    const [count, setCount] = useState<number>(data.count || -1);
    const [sortOrder, setSortOrder] = useState<number>(data.sortOrder);

    const jobCopy = JSON.parse(JSON.stringify(data));

    return (
        <Box ml={20} maxWidth="50%">
            <SimpleGrid columns={[2, 3, 3]} spacing={2}>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Point Value</Text>
                    <NumberInput min={0} max={30} step={0.25}>
                        <NumberInputField
                            placeholder={`${data.pointValue}`}
                            onChange={(event) => setPointValue(parseFloat(event.target.value))}
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Cash Payout</Text>
                    <NumberInput min={0} max={750} step={10}>
                        <NumberInputField
                            placeholder={`${data.cashValue}`}
                            onChange={(event) => setCashValue(parseFloat(event.target.value))}
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Meal Ticket?</Text>
                    <Select
                        placeholder={mealTicket}
                        onChange={(event) => setMealTicketValue(event.target.value === 'true')}
                    >
                        {
                            !data.mealTicket ? <option value="true">Yes</option>
                                : <option value="false">No</option>
                        }
                    </Select>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Positions</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField
                            placeholder={`${data.count}`}
                            onChange={(event) => setCount(parseInt(event.target.value, 10))}
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Display Order</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField
                            placeholder={`${data.sortOrder}`}
                            onChange={(event) => setSortOrder(parseInt(event.target.value, 10))}
                        />
                    </NumberInput>
                </Box>
            </SimpleGrid>
            <Button
                backgroundColor="orange.300"
                color="white"
                mt={2}
                onClick={
                    () => {
                        // eslint-disable-next-line no-alert
                        jobCopy.pointValue = pointValue;
                        jobCopy.cashValue = cashValue;
                        jobCopy.mealTicket = mealTicketValue;
                        jobCopy.count = count;
                        jobCopy.sortOrder = sortOrder;
                        alert(JSON.stringify(jobCopy));
                    }
                }
            >
                Save
            </Button>
        </Box>
    );
}

export default SignupSheetJobsRow;
