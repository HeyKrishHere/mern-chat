import { Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMesssage, isSameSender } from '../../config/ChatLogics'
import { Avatar } from '@chakra-ui/avatar'


export const ScrollableChat = ({message}) => {
  return (
    <ScrollableFeed>
      {message&& message.map((msg, index) => (
        <div style={{display:"flex"}} key={m._id}>
          {(isSameSender(message,m,i,user._id)||
            isLastMesssage(message,i,user._id))&&(
                <Tooltip
                label={m.sender.name}
                placement="bottom-start"
                hasArrow>
                    <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}/>
                </Tooltip>
        )}
        <span
          style={{
            backgroupColor: `${
            m.sender._id===user.id ? "#58bf56" : "#f3f3f3"}`,
            borderRadius:"10px",
            padding:"10px",
            maxWidth:"60%",
            marginLeft: isSameSenderMargin(message,m,i,user._id),
            marginTop:isSameUser(message,m,i,user._id) ? 3:10,
            }}
            >{m.content}</span>
        </div>
      ))}
    </ScrollableFeed>
  )
}
