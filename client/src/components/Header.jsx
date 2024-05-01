import { Box, Button, Flex, Image, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import {useRecoilValue} from "recoil";
import userAtom from "../../atoms/userAtom"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import LogoutButton from './LogoutButton';
import { SiHomebridge } from "react-icons/si";
import { VscColorMode } from "react-icons/vsc";
import { BsChatQuote } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import CreatePost from './CreatePost';





const Header = () => {

    const {colorMode, toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();
    
    const handleUserPageClick = ()=> {
      navigate(`/${user.username}`);
    }
    const handleHomePageClick = ()=> {
      navigate("/");
    }

    const handleChatClick = ()=> {
      navigate("/chat")
    }

  return (
    <>

    {
      !user && (

        <Flex justifyContent={"center"} mt={6} mb={12}>
          <Image
              cursor={"pointer"}
              w={6}
              alt='Threads Logo'
              src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
              onClick={toggleColorMode}
              />
        </Flex>
      )
    }

    {
      user && (
        <>
          <Flex justifyContent={"space-between"}  alignItems={"center"} mt={6} mb={12}>
                {/* <Link to="/">
                  <SiHomebridge size={24}/>
                </Link> */}
              
              <Button onClick={handleHomePageClick} variant={"ghost"}><SiHomebridge size={24}/></Button>
              

                <Button onClick={handleUserPageClick} variant={"ghost"}><RxAvatar size={24}/></Button>
                
                <Button variant={"ghost"} onClick={handleChatClick}><BsChatQuote size={24}/></Button>
                <Button onClick={toggleColorMode} variant={"ghost"}><VscColorMode size={24}/></Button>

                <LogoutButton/>
            
          </Flex>
        </>
    )
    }
  
   </> 
  )
}

export default Header