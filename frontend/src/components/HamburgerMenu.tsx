/* eslint-disable */
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    useDisclosure,
    Image,
    IconButton,
    VStack,
    StackDivider,
    Box,
    HStack,
    Icon,
    Breadcrumb,
} from '@chakra-ui/react';

import { AiOutlineMenu, AiFillHome, AiFillCalendar} from 'react-icons/ai';
import { HiUsers, HiCog } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate} from 'react-router-dom';


interface pageProps {
  activeButtonId: number
}
  export default function HamburgerMenu(props:pageProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    let history = useNavigate();

    return (
      <HStack>
        <IconButton 
          aria-label='Back' 
          icon={ <IoIosArrowBack size='lg'/> } 
          color='orange'
          bg='white'
          size='lg'
          onClick={() => history(-1)} 
        />
        <div>
          <IconButton
          aria-label='Menu'
          icon={<AiOutlineMenu />}
          onClick={onOpen}
          background='orange'
          color='white'
          isRound={true}
          size='lg'
          />
          <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            size='md'
            
          >
            <DrawerOverlay />
            <DrawerContent>  
              <DrawerBody padding='0'>
                <VStack width='100%' divider={<StackDivider borderColor='gray.300'/>} spacing="0">
                  <Button 
                    height='80px'
                    fontFamily='heading'
                    fontSize="6xl" 
                    leftIcon={<AiFillHome />}
                    isFullWidth={true}
                    bg='white'
                    color='black'
                    borderRadius='0'
                    _hover={ { bg: 'gray.100' }}
                    _active={{
                      bg: 'orange',
                      color: 'white',
                    }}
                    id="1"
                    isActive={props.activeButtonId == 1}
                  >
                    <Link to="/">Dashboard</Link>
                  </Button>
                  <Button 
                    height='80px'
                    fontFamily='heading'
                    fontSize="6xl" 
                    leftIcon={<AiFillCalendar />}
                    isFullWidth={true}
                    bg='white'
                    color='black'
                    _hover={ { bg: 'gray.100' }}
                    _active={{
                      bg: 'orange',
                      color: 'white',
                    }}
                    borderRadius='0'
                    id="2"
                    isActive={props.activeButtonId == 2}
                  >
                    <Link to="/calendar">Calendar</Link>
                  </Button>
                  <Button 
                    height='80px'
                    fontFamily='heading'
                    fontSize="6xl" 
                    leftIcon={<HiUsers />}
                    isFullWidth={true}
                    bg='white'
                    color='black'
                    borderRadius='0'
                    _hover={ { bg: 'gray.100' }}
                    _active={{
                      bg: 'orange',
                      color: 'white',
                    }}
                    id="3"
                    isActive={props.activeButtonId == 3}
                  >
                    <Link to="/members">Members</Link>
                  </Button>
                  <Button 
                    height='80px'
                    fontFamily='heading'
                    fontSize="6xl" 
                    leftIcon={<HiCog />}
                    isFullWidth={true}
                    bg='white'
                    color='black'
                    borderRadius='0'
                    _hover={ { bg: 'gray.100' }}
                    _active={{
                      bg: 'orange',
                      color: 'white',
                    }}
                    id="4"
                    isActive={props.activeButtonId == 4}
                  >
                    <Link to="/settings">My Account</Link>
                  </Button>
                </VStack>
              </DrawerBody>
    
            </DrawerContent>
          </Drawer>
      </div>
      </HStack>
      
    )
  }
