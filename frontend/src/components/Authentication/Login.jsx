import React from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

const Login = () => {
    const[show,setShow]=useState(false)
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[loading,setLoading]=useState(false)
    const toast=useToast();
    const history=useHistory();

    const handelCLick=()=>{
        setShow(!show)
    }   
    const submitHandeler=async()=>{
        setLoading(true);
    if(!email || !password){
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
      return;
    }
    
    try{
        const config={
            header:{
                "Content-Type":"application/json",
            },
        };

        const {data} = await axios.post("http://localhost:3000/api/user/login",
            { email,password },
            config
        );

        toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          localStorage.setItem("userInfo",JSON.stringify(data));
          setLoading(false);
          history.push("/chats");
    }
    catch(error){
        console.log(error)
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            
        })
        setLoading(false);
    }

    }
    return (
        <VStack
        spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                    type={show?"text":'password'} 
                    placeholder='Enter Your Password' 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handelCLick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement> 
                </InputGroup>
            </FormControl>
            <Button
            colorScheme='red'
            width='100%'
            style={{marginTop:'15px'}}
            onClick={submitHandeler}
            isLoading={loading}
            >
            Login</Button>
            <Button
            colorScheme='red'
            width='100%'
            style={{marginTop:'15px'}}
            onClick={()=>{
                setEmail("guest@gmail.com")//problem
                setPassword("123456")
            }}>
            Login as Guest</Button>
        </VStack>
      )
}

export default Login