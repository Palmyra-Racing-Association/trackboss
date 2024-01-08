/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
// import _ from 'lodash';
import { Box, Center, ListItem, Link, UnorderedList, Heading, VStack, Divider } from '@chakra-ui/react';

export default function ImportantLinksCard(props: any) {
    let gateCodeDisplayMessage = `Current Gate Code: ${props.gateCode}`;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(props.gateCode))) {
        gateCodeDisplayMessage = 'Insurance and payment required for gate code';
    }
    // const links = _.map(props.dashboardLinks, (link) => (
    //     <Link
    //         href={link.linkUrl}
    //         target="_blank"
    //         fontSize="2xl"
    //         color="orange"
    //     >
    //         <ListItem pt={1} marginLeft={4}>{link.linkDescription}</ListItem>
    //     </Link>
    // ));
    props.dashboardLinks.forEach((link :any) => {
        console.log(JSON.stringify(link));
    });
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
                            href="https://drive.google.com/file/d/1ZOoKkTt2c0wjlB_-XXug3hRdwxkUJZ6-/view?usp=sharing"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Club Bylaws</ListItem>
                        </Link>
                        <Link
                            href="https://palmyramx.com/pages/new-member-orientation"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>New Member Orientation</ListItem>
                        </Link>
                        <Link
                            href="https://www.facebook.com/groups/362613047833426"
                            target="_blank"
                            fontSize="2xl"
                            color="orange"
                        >
                            <ListItem pt={1} marginLeft={4}>Facebook Group</ListItem>
                        </Link>
                    </UnorderedList>
                </VStack>

            </Center>
        </Box>
    );
}
