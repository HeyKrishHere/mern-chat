import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import {Box} from '@chakra-ui/react'
import { SingleChat } from './SingleChat';

export const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box
      display={{base:selectedChat?"flex":"none",md:"flex"}}
      flexDir="column"
      allignitems="center"
      p={3}
      background="white"
      w={{base:"100%",md:"60%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}