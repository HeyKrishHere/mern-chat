import { Box } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from '@chakra-ui/icons'

export const UserBadgedItem = ({user,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    varient="solid"
    fontSize={14}
    cursor="pointer"
    onClick={handleFunction}
    bg="orange"
    color="white"
    >
        {user.name} 
        <CloseIcon pl={1}/>

    </Box>

  )
}
