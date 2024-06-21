import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import {Box, Text} from "@chakra-ui/layout"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Menu,MenuButton,MenuList,MenuItem,Avatar,Button,Tooltip} from "@chakra-ui/react"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input
  
} from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/spinner'
import { useToast } from '@chakra-ui/toast'
import Chat from '../../pages/Chat'
import { ChatState } from '../../Context/ChatProvider.jsx'
import {ProfileModal} from './ProfileModal.jsx'
import { useHistory } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/hooks'
import { ChatLoading } from './ChatLoading.jsx'
import { UserListItem } from '../UserAvatar/UserListItem.jsx'

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {user,setSelectedChat,chats,setChats}= ChatState();
  const history = useHistory();
  const toast = useToast();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch=async()=>{
    if(!search){
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`http://localhost:3000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);

    }catch(error){
      console.log(error);
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

    }
  }

  const accessChat = async (userId) => {
    try{
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('http://localhost:3000/api/chat', { userId }, config);
      if(!chats.find((chat)=>chat._id===data._id)){
        setChats([data,...chats]);
      } 
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    }
    catch(error){
      console.log(error);
      setLoadingChat(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

    }
  }
  return (
    <>
     <Box display={{base: "flex", md: "flex"}}  justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
        <Tooltip label="Search Users to start a chat" hasArrow placement='bottom-end' >
          <Button variant='ghost'onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{base: 'none', md: 'flex'}} px="4">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">Vartaalap</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <i className="fa-solid fa-bell"></i>
            </MenuButton>
            <MenuList></MenuList>
          </Menu>
          <Menu>
            <MenuButton as ={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
              </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
              { <MenuItem>My Profile</MenuItem> }
              </ProfileModal>
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
      placement ='left'
      onClose={onClose}
      isOpen={isOpen}
      >
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
        <DrawerBody>
        <Box display="flex" pb={2}>
          <Input
            placeholder="Search by name or email"
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Go</Button>
        </Box>
        {
          loading ? (
            <ChatLoading/>
          ):(
            searchResults?.map((user)=>(
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
              />
            ))
          )
        }
            
          {loadingChat && <Spinner ml="auto" display="flex" />}
        
      </DrawerBody>
      </DrawerContent>
      
      </Drawer>
    </>
  )
}

export default SideDrawer