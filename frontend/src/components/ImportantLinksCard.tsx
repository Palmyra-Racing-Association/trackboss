import React from 'react';
import { Box, Center, ListItem, Link, UnorderedList, Heading, VStack } from '@chakra-ui/react';

export default function ImportantLinksCard() {
    return (
        <Box bg="white" boxShadow="md" border="1px" borderColor="gray.200" p={3} height={335}>
            <Center>
                <VStack>
                    <Heading mb={5}>Important Links</Heading>
                    <UnorderedList>

                        <Link
                            href="https://palmyramx.com/pages/track-rules"
                            target="_blank"
                            fontSize="3xl"
                            color="orange"
                        >
                            <ListItem>Member Rules</ListItem>
                        </Link>
                        <Link
                            href="https://twitter.com/palmyramx"
                            target="_blank"
                            fontSize="3xl"
                            color="orange"
                        >
                            <ListItem>Twitter</ListItem>
                        </Link>
                        <Link
                            href="https://www.facebook.com/palmyramx/"
                            target="_blank"
                            fontSize="3xl"
                            color="orange"
                        >
                            <ListItem>Facebook</ListItem>
                        </Link>
                        <Link
                            href="https://www.instagram.com/palmyramx_hogback_hill/?hl=en"
                            target="_blank"
                            fontSize="3xl"
                            color="orange"
                        >
                            <ListItem>Instagram</ListItem>
                        </Link>

                    </UnorderedList>
                </VStack>

            </Center>
        </Box>
    );
}
