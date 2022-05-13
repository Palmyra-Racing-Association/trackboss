import { Box, Input, SimpleGrid } from '@chakra-ui/react';
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
    return (
        <SimpleGrid columns={[1, null, 7]}>
            <Box maxWidth={150}>
                <Input value={data.title} />
            </Box>
            <Input value={data.pointValue} />
            <Input value={data.cashValue} />
            <Input value={data.jobDay} />
            <Input value={`${data.mealTicket}`} />
            <Input value={data.count} />
            <Input value={data.sortOrder} />
        </SimpleGrid>
    );
}

export default SignupSheetJobsRow;
