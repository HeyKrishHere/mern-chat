import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Image,Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
export const ProfileModal = ({user,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
{
    children?(
    <span onClick={onOpen}>{children}</span>
    ):(
        <IconButton 
        d={{base:'flex'}} 
        icon={<ViewIcon/>} 
        onClick={onOpen} 
        />
    )}
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='400px'>
          <ModalHeader
            fontSize='40px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
           display='flex' flexDirection='column' justifyContent='space-between' alignItems='center'>
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            <Text
            fontSize={{base:'28px',md:'30px'}}
            fontFamily='Work sans'>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

 