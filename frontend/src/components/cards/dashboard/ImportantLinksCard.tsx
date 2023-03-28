/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Box, Center, ListItem, Link, UnorderedList, Heading, VStack, Divider } from '@chakra-ui/react';

export default function ImportantLinksCard(props: any) {
    let gateCodeDisplayMessage = `Current Gate Code: ${props.gateCode}`;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(props.gateCode))) {
        gateCodeDisplayMessage = 'Insurance and payment required for gate code';
    }
    return (
        <Box bg="white" boxShadow="md" border="1px" borderColor="gray.200" p={3} h="365" m={2}>
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
                        <Link
                            href="tel:+18335412030"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Member Info Voice # (833) 541-2030</ListItem>
                        </Link>
                        <Link
                            href="sms:+19292426752"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Member SMS # (929) 242-6752</ListItem>
                        </Link>
                        <Link
                            href="https://palmyramx.com/pages/track-rules"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Member Rules</ListItem>
                        </Link>
                        <Link
                            href="https://twitter.com/palmyramx"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Twitter</ListItem>
                        </Link>
                        <Link
                            href="https://www.facebook.com/palmyramx/"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Facebook</ListItem>
                        </Link>
                        <Link
                            href="https://www.instagram.com/palmyramx_hogback_hill/?hl=en"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Instagram</ListItem>
                        </Link>
                    </UnorderedList>
                </VStack>

            </Center>
        </Box>
    );
}
