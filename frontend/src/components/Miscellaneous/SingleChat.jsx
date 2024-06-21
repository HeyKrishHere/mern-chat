import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, IconButton, Spinner, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ProfileModal } from './ProfileModal';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import { UpdateGroupChatModal } from './UpdateGroupChatModal';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useEffect } from 'react';
import {ScrollableChat} from './ScrollableChat';

import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5173";
var socket, selectedChatComapre;

export const SingleChat = ({fetchAgain,setFetchAgain}) => {
  const [message, setMessage]= useState([]);
  const [loading, setloading]= useState([]);
  const [newMessage, setNewMessage]= useState([]);
  const toast = useToast();

  const {user,selectedChat,setSelectedChat}= ChatState();

  const fetchMessages = async()=>{
    if(!selectedChat)return;
    try {
      const config ={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };

      setloading(true);
      const {data} = await axios.get(`http://localhost:3000/api/message/${selectedChat._id}`,config);
      setMessage(data);
      setloading(false);
      socket.emit('join chat',selectedChat._id);
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to fetch the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      
      })
      
    }
  }

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit('setup',user);
    socket.on('connected',()=>{
      console.log("Connected to socket.io");
    })
  },[])

  useEffect(()=>{
    fetchMessages();
  },[selectedChat])

  useEffect(()=>{
    socket.on('message received', (newMessageReceived) => {
      if(!selectedChatComapre || selectedChatComapre._id !== newMessageReceived.chat._id){
        
      }
      else{
        setMessage([...message,newMessageReceived]);
      }
    })
  })

  const sendMessage = async(e)=>{
    try {
      const config ={
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        },
      };
      setNewMessage("");
      const {data} = await axios.post( "http://localhost:3000/api/message",
        {
        content:newMessage,
        chatId: selectedChat._id,
      },config);
      
      socket.emit('new message',data);
      setMessage([...message,data]);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to send the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      
      })
      
    }

  }

  


  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
  }

  return (
    <>
    {selectedChat ?
    <>
    <Text 
    fontSize={{base: "28px", md:"30px"}}
    pb={3}
    px={2}
    w="100%"
    fontFamily="Work sans"
    display="flex"
    justifyContent={{base:"space-between"}}
    alignItems="center"
    >
      <IconButton
      display={{base:"flex",md:"none"}}
      icon={<ArrowBackIcon/>}
      onClick={()=>setSelectedChat("")}
      />
      {!selectedChat.isGroupChat ?
        <>
        {getSender(user,selectedChat.users)}
        <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
        </>
      :
        <>
        {selectedChat.chatName.toUpperCase()}
        
        <UpdateGroupChatModal fetchAgain={fetchAgain} 
        setFetchAgain={setFetchAgain}
        fetchMessages={fetchMessages}
        />

        </>
      }

    </Text>

      <Box
      display='flex'
      flexDir='column'
      justifyContent='center'
      p={3}
      bg='gray.300'
      w='100%'
      h='100%'
      borderRadius="lg"
      overflowY="hidden" >
        
        {loading ?(<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"
        />):( <Box
        display="flex"
        flexDir="column"
        overflowY="scroll"
        scrollbarWidth="none"
        >
            <ScrollableChat messages={message}/>

        </Box>)}


          <FormControl>
            <InputGroup>
            
              <Input
              placeholder="Type a message"
              variant="filled"
              size="lg"
              bg="gray.100"
              value={newMessage}
              onChange={(e)=>{typingHandler}}
              isRequired
              mt={2}
              onKeyDown={(e)=>{if(e.key==="Enter"&& newMessage){sendMessage()}}}
              />
              <InputRightElement>
                <IconButton
                  icon={<ArrowForwardIcon/>}
                  onClick={()=>{newMessage&&sendMessage}}
                  
                />
              </InputRightElement>
              </InputGroup>
          </FormControl>

      </Box>

    </>
    :
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
      h="100%"
    >

      <Text>
        Select a user to start chatting
      </Text>
      </Box>
    }

    </>
  
)
}
