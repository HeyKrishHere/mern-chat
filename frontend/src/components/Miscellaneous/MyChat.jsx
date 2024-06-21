import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import { useToast } from '@chakra-ui/toast';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import {ChatLoading} from './ChatLoading';
import { Stack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { getSender } from '../../config/ChatLogics.js';
import { GroupChatModal } from './GroupChatModal';

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const {user,selectedChat,setSelectedChat,chats,setChats}= ChatState();
  const toast = useToast();

  const fetchChats=async()=>{
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
  };
  const {data} = await axios.get("http://localhost:3000/api/chat", config);
  setChats(data);
}
catch(error){
  toast({
    title: "Error Occured!",
    description: "Failed to Load the Chats",
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });
}
}
useEffect(() => {
  fetchChats();
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  
},[fetchAgain]);


  return (
    <Box
      display={{base:selectedChat?"none":"flex",md:"flex"}}
      flexDir="column"
      allignitems="center"
      p={3}
      background="white"
      w={{base:"100%",md:"30%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={2}
        px={2}
        fontSize={{base:"30px",md:"30px"}}
        fontFamily="work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        allgnItems="center"
        >
          My Chats
          <GroupChatModal>

              <Button
              display="flex"
              fontSize={{base:"15px",md:"10px",lg:"15px"}}
              rightIcon={<AddIcon/>}
              >
                Create Group
              </Button>

          </GroupChatModal>
          
      </Box>
      <Box
      display="flex"
      flexDir="column"
      w="100%"
      h="100%"
      p={2}
      bg="white"
      borderRadius="lg"
      overflowY="hidden"
      >
        {chats ? (
         <Stack overflowY='scroll'>
            {chats?.map((chat)=>(
              
              <Box
                onClick={()=>setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "red" : "gray.200"}
                color={selectedChat === chat ? "white" : "black"}
                px={2}
                py={2}
                borderRadius="lg"
                key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ?(
                      getSender(user, chat.users)
                      //"user"
                      
                    ):(chat.chatName)}
                  </Text>
              </Box>
           
            ))}
         </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>
    </Box>
  )
}

export default MyChat