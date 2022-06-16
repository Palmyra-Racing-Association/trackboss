import React from 'react';
import { Select } from '@chakra-ui/react';

interface daysOfWeekSelectProps {
    defaultDay: number;
    // eslint-disable-next-line no-unused-vars
    onDayChange: (value: number) => void;
}

export default function DaysOfWeekSelect(props: daysOfWeekSelectProps) {
    const jobDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Select
            defaultValue={props.defaultDay}
            onChange={
                (event) => {
                    props.onDayChange(parseInt(event.target.value, 10));
                }
            }
        >
            {jobDays.map((dayName, index) => <option value={index}>{dayName}</option>)}
        </Select>
    );
}
