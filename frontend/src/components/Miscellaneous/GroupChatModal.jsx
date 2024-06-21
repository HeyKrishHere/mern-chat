import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Input,
} from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/form-control'
import {ChatState} from '../../Context/ChatProvider'
import axios from 'axios'
import { Box } from '@chakra-ui/layout'

import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { UserListItem } from '../UserAvatar/UserListItem'
import { Spinner } from '@chakra-ui/spinner'
import { UserBadgedItem } from '../UserAvatar/UserBadgedItem.jsx'


export const GroupChatModal = ({children}) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [groupChatName, setGroupChatName] = useState();
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [search, setSearch] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const toast = useToast();
   const {user,chats,setChats} = ChatState();
   

   const handelSearch=async(query)=>{
    setSearch(query);
    if(!query){
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get(`http://localhost:3000/api/user?search=${search}`,config);
      setLoading(false);
      setSearchResults(data);
    }
    catch(error){
      setLoading(false);
      console.log(error);
      toast({
        title:"Error Occured!",
        description:"Failed to Load the Users",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
      });
    }



   }
   const handleSubmit=async()=>{
    if(!groupChatName || selectedUsers.length<1){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      return;
    }
    try{
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data}= await axios.post("http://localhost:3000/api/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((user)=>user._id)),
      },config);

      setChats([data,...chats]);
      onClose();
      toast({
        title:"Group Created",
        description:"Group Chat Created Successfully",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom",
      
      })
    }
    catch(error){
      console.log(error);
      toast({
        title:"Error Occured",
        description:"Failed to Create Group Chat",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })

    }

   }
   const handleGroup=(userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
      toast({
        title:"User Already Added",
        description:"User is already added to the group",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers,userToAdd]);

   }
   const handleDelete=(userToDelete)=>{
    setSelectedUsers(
      selectedUsers.filter((user)=>user._id !== userToDelete._id))

   }



  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily='Poppins'
            fontSize='20px'
            fontWeight='bold'
            color='black'
            display='flex'
            justifyContent='center'
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder='Enter Group Chat Name'
                value={groupChatName}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Members'
                mb={1}
                onChange={(e) => handelSearch(e.target.value)}
              />
            </FormControl>

            <Box w='100%' display='flex' flexwrap='wrap'>
            {selectedUsers.map((user) => (
              <UserBadgedItem key={user._id} 
              user={user} 
              handleFunction={()=>handleDelete(user)}
              />
            ))}

            </Box>
            
            
            {loading ? (
              <Spinner />
            ) : (
              searchResults?.slice(0,4).map((user) => (
                <UserListItem 
                key={user._id} user={user} 
                handleFunction={()=>handleGroup(user)}
                />
                
              ))
            )}
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
