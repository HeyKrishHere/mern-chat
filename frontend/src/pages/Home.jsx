import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Home = () => {
    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if(user){
            history.push('/chats')
        }
    },[history])
    const fetchData = async () => {
        const res = await fetch('http://localhost:3000/')
        console.log(res)
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <Container maxW='xl' centerContent>
            <Box
                d="flex"
                justifyContent="center"
                alignItems="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Flex justifyContent={"center"} alignItems={"center"}>
                <Text fontSize="4xl" fontFamily="Work sans">
                    Vartaalap
                </Text>
                </Flex>
                
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
    
                    <Tabs variant='soft-rounded' colorScheme='red'>
                        <TabList mb="1em">
                            <Tab width={"50%"}>Login</Tab>
                            <Tab width={"50%"}>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                               <Login/>
                            </TabPanel>
                            <TabPanel>
                               <Signup/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
            </Box>
        </Container>
    )
}

export default Home