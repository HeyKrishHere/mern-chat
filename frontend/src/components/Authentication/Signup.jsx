import React from 'react'
import {useState} from 'react'
import { Button, FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement,  } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

const Signup = () => {
    const[show,setShow]=useState(false)
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[confirmPassword,setConfirmPassword]=useState("")
    const[pic,setPic]=useState("")
    const [loading,setLoading]=useState(false)
    const toast = useToast();
    const history = useHistory();
    const handelCLick=()=>{
        setShow(!show)
    }   
    const postDetails=(pics)=>{
      setLoading(true)
      if(pics===undefined){
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if(pics.type==="image/jpeg" || pics.type==="image/png"){
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset","vartaalap");
        data.append("cloud_name","dpv7kmswl");
        fetch("https://api.cloudinary.com/v1_1/dpv7kmswl/image/upload",{
          method:"post",
          body:data
        }).then(res=>res.json())
        .then(data=>{
          setPic(data.url.toString());
          setLoading(false);
        })
    }
    else{
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
      return;
    }
};

const submitHandeler=async()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
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
    if(password!==confirmPassword){
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      return;
    }
    try{
        const config={
            header:{
                "Content-Type":"application/json",
            },
        };

        const {data} = await axios.post("http://localhost:3000/api/user",
            { name,email,password,pic },
            config
        );

        toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          localStorage.setItem("userInfo",JSON.stringify(data));
          setLoading(false);
          history.push("/login");


    }
    catch(error){
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
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' 
            onChange={(e)=>setName(e.target.value)}/>
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' 
            onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                type={show?"text":'password'} 
                placeholder='Enter Your Password' 
                onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handelCLick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement> 
            </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                type={show?"text":'password'} 
                placeholder='Enter Your Password Again' 
                onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handelCLick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement> 
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload Profile Picture</FormLabel>
            <Input 
                type="file" 
                p={1.5}
                accept='image/*'
                onChange={(e)=>postDetails(e.target.files[0])}
                />
        </FormControl>
        <Button
        colorScheme='red'
        width='100%'
        style={{marginTop:'15px'}}
        isLoading={loading}
        onClick={submitHandeler}
        >
        SignUp
        </Button>
    </VStack>
  )
}

export default Signup