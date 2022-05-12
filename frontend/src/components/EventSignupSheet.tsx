import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { UserContext } from '../contexts/UserContext';
// import { getJobTypeListEventType } from '../controller/jobType';

function EventSignupSheet() {
    const { state } = useContext(UserContext);

    // get the API data from the jobType API

    // Put it in a table

    // make it editable in some fancy UI thang.

    return (
        <Box>
            event Signup for
            { state.user?.email }
        </Box>
    );
}
export default EventSignupSheet;
