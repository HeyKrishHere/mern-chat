import { useDisclosure, Button, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    IconButton,
    useToast,
    
} from '@chakra-ui/react';

import { ChatState } from '../../Context/ChatProvider';
import { UserBadgedItem } from '../UserAvatar/UserBadgedItem';
import { ViewIcon} from '@chakra-ui/icons';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import axios from 'axios';
import { UserListItem } from '../UserAvatar/UserListItem';
import { set } from 'mongoose';
export const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
   const [search, setSearch] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [renameLoading, setRenameLoading] = useState(false);
    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const handleRemove = async (user1) => {
        if(selectedChat.groupAdmin._id===user._id && user1._id!==user._id){
            toast({
                title:"You are not the Admin of the Group",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put(`http://localhost:3000/api/chat/groupremove`,{
                chatId:selectedChat._id,
                userId:user1._id,
            },config);

            user1._id===user._id?setSelectedChat():setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

            
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast({
                title: "Error Occured!",
                description: "Failed to Remove User from the Group Chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            
        }

    }
    const handleRename = async () => {
        if(!groupChatName){
            
            return;
        }
        try{

            setRenameLoading(true);
            const config ={
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const {data} = await axios.put(`http://localhost:3000/api/chat/rename`,{
                chatId:selectedChat._id,
                chatName:groupChatName,
            },config);
            setRenameLoading(false);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setGroupChatName("");
        }catch(error){
            console.log(error)
            setRenameLoading(false);
            toast({
                title: "Error Occured!",
                description: "Failed to Update the Group Chat Name",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        
    }
    const handleSearch = async (query) => {

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
    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User Already Exists",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title:"Only admin can add users to the group chat",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put(`http://localhost:3000/api/chat/groupadd`,{
                chatId:selectedChat._id,
                userId:user1._id,
            },config);

            setLoading(false);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to Add User to the Group Chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });

            
        }


    }

    return (
        <>
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>}  onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        flexDirection='column'
                        fontFamily='Work Sans'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display='flex' pb={3} flexwrap="wrap">
                        {selectedChat.users.map((user) => (
                        <UserBadgedItem 
                            key={user._id} 
                            user={user} 
                            handleFunction={()=>handleRemove(user)}
                        />
                    ))}
                        </Box>

                        <FormControl>
                            <Input
                                placeholder=' Group Chat Name'
                                value={groupChatName}
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            
                            />

                            <Button
                                variant='solid'
                                colorScheme='green'
                                ml={310}
                               
                                mb={3}
                                isLoading={renameLoading}
                                onClick={()=>handleRename(user)}
                            >
                                Update
                            </Button>
                         </FormControl>
                         <FormControl>
                            <Input
                                placeholder='Add Members'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ?(
                            <Spinner size="lg"/>
                        ):(
                            searchResults?.map((user)=>(
                                <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=>handleAddUser(user)}
                                />

                            ))
                        )}



                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

