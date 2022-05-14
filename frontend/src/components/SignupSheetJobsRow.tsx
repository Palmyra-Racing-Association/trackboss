import {
    Box, Button, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper, Select, SimpleGrid, Text,
} from '@chakra-ui/react';
import React from 'react';
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

    return (
        <Box ml={20} maxWidth={700}>
            <SimpleGrid columns={[3, null, 6]} spacingX={10}>
                <Box>
                    <Text fontSize="sm">Point Value</Text>
                    <NumberInput min={0} max={30} step={0.25}>
                        <NumberInputField placeholder={`${data.pointValue}`} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
                <Box>
                    <Text fontSize="sm">Cash Payout</Text>
                    <NumberInput min={0} max={750} step={10}>
                        <NumberInputField placeholder={`${data.cashValue}`} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
                <Box>
                    <Text fontSize="sm">Meal Ticket?</Text>
                    <Select placeholder={mealTicket}>
                        {
                            !data.mealTicket ? <option value="true">Yes</option>
                                : <option value="false">No</option>
                        }
                    </Select>
                </Box>
                <Box>
                    <Text fontSize="sm">Positions</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField placeholder={`${data.count}`} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
                <Box>
                    <Text fontSize="sm">Display Order</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField placeholder={`${data.sortOrder}`} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
                <Box>
                    <Button m={5} backgroundColor="orange.300" color="white">Save</Button>
                </Box>
            </SimpleGrid>
        </Box>
    );
}

export default SignupSheetJobsRow;
