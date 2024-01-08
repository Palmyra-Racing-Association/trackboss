/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Box, Center, ListItem, Link, UnorderedList, Heading, VStack, Divider } from '@chakra-ui/react';
import { Link as DashboardLink } from '../../../../../src/typedefs/link';

interface cardProps {
    gateCode: string,
    dashboardLinks: DashboardLink[],
}

export default function ImportantLinksCard(props: cardProps) {
    let gateCodeDisplayMessage = `Current Gate Code: ${props.gateCode}`;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(props.gateCode))) {
        gateCodeDisplayMessage = 'Insurance and payment required for gate code';
    }
    return (
        <Box bg="white" boxShadow="md" border="1px" borderColor="gray.200" p={2} h="365" m={1}>
            <Center>
                <VStack boxSize="md">
                    <Heading size="lg">Club Info and Links</Heading>
                    <Divider />
                    <UnorderedList>
                        <Link
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem marginLeft={4}>
                                {gateCodeDisplayMessage}
                            </ListItem>
                        </Link>
                        {
                            // eslint-disable-next-line arrow-body-style
                            props.dashboardLinks.map((link: DashboardLink) => {
                                const displayLink = (
                                    <Link
                                        href={link.linkUrl}
                                        target="_blank"
                                        fontSize="2xl"
                                        color="orange"
                                    >
                                        <ListItem pt={1} marginLeft={4}>{link.linkTitle}</ListItem>
                                    </Link>
                                );
                                return displayLink;
                            })
                        }
                    </UnorderedList>
                </VStack>
            </Center>
        </Box>
    );
}
