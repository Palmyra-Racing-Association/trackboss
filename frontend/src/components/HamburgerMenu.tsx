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

import { AiOutlineMenu, AiFillHome, AiFillCalendar, AiFillBank } from 'react-icons/ai';
import { HiUsers, HiCog } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

interface pageProps {
  activeButtonId: number
}

export default function HamburgerMenu(props:pageProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useNavigate();
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
                                    isFullWidth
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
                                    isFullWidth
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
                                    isFullWidth
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
                                    isFullWidth
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
                                    leftIcon={<AiFillBank />}
                                    isFullWidth
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
                                    <Link to="/jobs">Administer Event Jobs</Link>
                                </Button>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </div>
        </HStack>
    );
}
