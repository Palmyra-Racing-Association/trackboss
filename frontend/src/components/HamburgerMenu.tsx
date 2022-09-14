import React from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    Button,
    useDisclosure,
    IconButton,
    VStack,
    StackDivider,
    HStack,
} from '@chakra-ui/react';

import { AiOutlineMenu, AiFillHome, AiFillCalendar, AiFillBank, AiFillFolderOpen } from 'react-icons/ai';
import { HiUsers, HiCog } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

interface pageProps {
    activeButtonId: number,
    admin: boolean,
    boardMember: boolean,
}

export default function HamburgerMenu(props: pageProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useNavigate();
    const adminButtons = (
        <VStack width="100%" divider={<StackDivider borderColor="gray.300" />} spacing="0">
            <StackDivider borderColor="gray.300" />
            <Button
                justifyContent="flex-start"
                height="80px"
                fontFamily="heading"
                fontSize="2xl"
                leftIcon={<AiFillBank />}
                width="100%"
                bg="white"
                color="black"
                borderRadius="0"
                _hover={{ bg: 'gray.100' }}
                _active={
                    {
                        bg: 'orange',
                        color: 'white',
                    }
                }
                id="6"
                isActive={props.activeButtonId === 6}
            >
                <Link to="/jobs">Administer Event Jobs</Link>
            </Button>
            <StackDivider borderColor="gray.300" />
        </VStack>
    );
    const boardMemberButtons = (
        <VStack width="100%" divider={<StackDivider borderColor="gray.300" />} spacing="0">
            <Button
                justifyContent="flex-start"
                height="80px"
                fontFamily="heading"
                fontSize="2xl"
                leftIcon={<AiFillFolderOpen />}
                width="100%"
                bg="white"
                color="black"
                borderRadius="0"
                _hover={{ bg: 'gray.100' }}
                _active={
                    {
                        bg: 'orange',
                        color: 'white',
                    }
                }
                id="7"
                isActive={props.activeButtonId === 7}
            >
                <Link to="/applications">Membership Applications</Link>
            </Button>
        </VStack>
    );
    return (
        <HStack>
            <IconButton
                aria-label="Back"
                icon={<IoIosArrowBack size="lg" />}
                color="orange"
                bg="white"
                size="lg"
                onClick={() => history(-1)}
            />
            <div>
                <IconButton
                    aria-label="Menu"
                    icon={<AiOutlineMenu />}
                    onClick={onOpen}
                    background="orange"
                    color="white"
                    isRound
                    size="lg"
                />
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    size="md"
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerBody padding="0">
                            <VStack width="100%" divider={<StackDivider borderColor="gray.300" />} spacing="0">
                                <Button
                                    justifyContent="flex-start"
                                    height="80px"
                                    fontFamily="heading"
                                    fontSize="2xl"
                                    leftIcon={<AiFillHome />}
                                    width="100%"
                                    bg="white"
                                    color="black"
                                    borderRadius="0"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={
                                        {
                                            bg: 'orange',
                                            color: 'white',
                                        }
                                    }
                                    id="1"
                                    isActive={props.activeButtonId === 1}
                                >
                                    <Link to="/">Dashboard</Link>
                                </Button>
                                <Button
                                    justifyContent="flex-start"
                                    height="80px"
                                    fontFamily="heading"
                                    fontSize="2xl"
                                    leftIcon={<AiFillCalendar />}
                                    width="100%"
                                    bg="white"
                                    color="black"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={
                                        {
                                            bg: 'orange',
                                            color: 'white',
                                        }
                                    }
                                    borderRadius="0"
                                    id="2"
                                    isActive={props.activeButtonId === 2}
                                >
                                    <Link to="/calendar">Calendar and Job Signup</Link>
                                </Button>
                                <Button
                                    justifyContent="flex-start"
                                    height="80px"
                                    fontFamily="heading"
                                    fontSize="2xl"
                                    leftIcon={<HiUsers />}
                                    width="100%"
                                    bg="white"
                                    color="black"
                                    borderRadius="0"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={
                                        {
                                            bg: 'orange',
                                            color: 'white',
                                        }
                                    }
                                    id="3"
                                    isActive={props.activeButtonId === 3}
                                >
                                    <Link to="/members">Members</Link>
                                </Button>
                                <Button
                                    justifyContent="flex-start"
                                    height="80px"
                                    fontFamily="heading"
                                    fontSize="2xl"
                                    leftIcon={<HiCog />}
                                    width="100%"
                                    bg="white"
                                    color="black"
                                    borderRadius="0"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={
                                        {
                                            bg: 'orange',
                                            color: 'white',
                                        }
                                    }
                                    id="4"
                                    isActive={props.activeButtonId === 4}
                                >
                                    <Link to="/settings">My Account</Link>
                                </Button>
                                <Button
                                    justifyContent="flex-start"
                                    height="80px"
                                    fontFamily="heading"
                                    fontSize="2xl"
                                    leftIcon={<HiCog />}
                                    width="100%"
                                    bg="white"
                                    color="black"
                                    borderRadius="0"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={
                                        {
                                            bg: 'orange',
                                            color: 'white',
                                        }
                                    }
                                    id="5"
                                    isActive={props.activeButtonId === 5}
                                >
                                    <Link to="/board">Board Members</Link>
                                </Button>
                            </VStack>
                            { (props.admin) && (adminButtons) }
                            { (props.boardMember) && (boardMemberButtons)}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </div>
        </HStack>
    );
}
