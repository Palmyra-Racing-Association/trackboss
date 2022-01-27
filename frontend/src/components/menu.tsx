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

  export default function DrawerExample() {
    const { isOpen, onOpen, onClose } = useDisclosure()
   
  
    return (
      <HStack>
        <IconButton 
          aria-label='Back' 
          icon={ <IoIosArrowBack size='lg'/> } 
          color='orange'
          bg='white'
          size='lg' 
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
                  >
                    Dashboard
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
                  >
                    Calendar
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
                  >
                    Members
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
                  >
                    My Account
                  </Button>
                </VStack>
              </DrawerBody>
    
            </DrawerContent>
          </Drawer>
      </div>
      </HStack>
      
    )
  }
