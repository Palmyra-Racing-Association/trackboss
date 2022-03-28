import React from 'react';
import { Box, Center, ListItem, Link, UnorderedList, Heading, VStack, Divider } from '@chakra-ui/react';

export default function ImportantLinksCard() {
    return (
        <Box bg="white" boxShadow="md" border="1px" borderColor="gray.200" p={3}>
            <Center>
                <VStack boxSize="md">
                    <Heading>Important Links</Heading>
                    <Divider />
                    <UnorderedList pt={10}>
                        <Link
                            href="https://palmyramx.com/pages/track-rules"
                            target="_blank"
                            fontSize="4xl"
                            color="orange"
                        >
                            <ListItem pt={1}>Member Rules</ListItem>
                        </Link>
                        <Link
                            href="https://twitter.com/palmyramx"
                            target="_blank"
                            fontSize="4xl"
                            color="orange"
                        >
                            <ListItem pt={1}>Twitter</ListItem>
                        </Link>
                        <Link
                            href="https://www.facebook.com/palmyramx/"
                            target="_blank"
                            fontSize="4xl"
                            color="orange"
                        >
                            <ListItem pt={1}>Facebook</ListItem>
                        </Link>
                        <Link
                            href="https://www.instagram.com/palmyramx_hogback_hill/?hl=en"
                            target="_blank"
                            fontSize="4xl"
                            color="orange"
                        >
                            <ListItem pt={1}>Instagram</ListItem>
                        </Link>
                    </UnorderedList>
                </VStack>

            </Center>
        </Box>
    );
}
