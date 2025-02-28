import { createContext, useContext, useEffect, useState, } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const[selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState();

    const history = useHistory();
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        else{
            history.push("/");
        }
    }, [history]);
    return <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
    return useContext(ChatContext);
};

