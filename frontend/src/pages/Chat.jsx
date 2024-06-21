import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import MyChat from '../components/Miscellaneous/MyChat';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import {ChatBox} from '../components/Miscellaneous/ChatBox';
import { useState } from 'react';

export const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="100vh" p="10px">
        {user && <MyChat
        fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chat