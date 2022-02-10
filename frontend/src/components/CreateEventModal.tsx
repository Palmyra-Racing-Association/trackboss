/*eslint-disable*/
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    SimpleGrid,
    Input,
    Heading,
    VStack,
    Select,
  } from '@chakra-ui/react';
  import DateTimePicker from 'react-datetime-picker';

export default function CreateEventModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
  return (
    <div>
      <Button onClick={onOpen}>Create New Event</Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Heading>Create New Event</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid minChildWidth='200px' spacing='40px'>
              <VStack align="left">
                <Text>Event Name:</Text>
                <Input 
                  placeholder='Name'
                  _placeholder={{ color: 'gray.100' }}
                  borderColor='gray.100'
                 />
              </VStack>
              <VStack align="left">
                <Text>Label:</Text>
                <Select _placeholder={{ color: 'gray.100' }} placeholder="Select Label...">
                  <option value="Race">Race</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Job">Job</option>
                </Select>
              </VStack>
              <VStack align="left">
                <Text>Start Date/Time:</Text>
                <DateTimePicker disableClock onChange={(date: Date) => setStartDateTime(date)} value={startDateTime} />
              </VStack>
              <VStack align="left">
                <Text>End Date/Time:</Text>
                <DateTimePicker disableClock onChange={(date:Date) => setEndDateTime(date)} value={endDateTime}/>
              </VStack>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button bgColor="orange" color="white">Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}