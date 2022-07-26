import React from 'react';
import { Link, Text } from '@chakra-ui/react';

export default function NameAddressDisplay(props: any) {
    const { addressContainer } = props;
    return (
        <>
            <Text fontSize="md">
                {addressContainer.firstName}
                &nbsp;
                {addressContainer.lastName}
            </Text>
            <Text fontSize="md">
                {addressContainer.address}
            </Text>
            <Text fontSize="md">
                {addressContainer.city}
                ,&nbsp;
                {addressContainer.state}
                &nbsp;
                {addressContainer.zip}
            </Text>
            <Link href={`tel:${addressContainer.phone}`} isExternal>
                {addressContainer.phone}
            </Link>
            <br />
            <Link href={`mailto:${addressContainer.email}`} isExternal>
                {addressContainer.email}
            </Link>
            <br />
            <Text fontSize="md">
                DOB:
                &nbsp;
                {addressContainer.birthDate}
            </Text>
        </>
    );
}
