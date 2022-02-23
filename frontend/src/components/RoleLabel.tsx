import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

interface roleProps {
    title: string,
}

const buttonColor = (title: string) => {
    switch(title) {
        case 'member':
            return 'blue';
            break;
        case 'admin':
            return 'red';
            break;
        case 'board':
            return 'green';
            break;
        default:
            return 'gray.200';
    }
};

function RoleLabel(props: roleProps) {
    return (
        <Button
            color={buttonColor(props.title)}
        >
            {props.title}
        </Button>
    );
}

export default RoleLabel;
