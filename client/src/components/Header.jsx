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
import { IoSearch } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";





const Header = () => {

    const {colorMode, toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();
    

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
              
              <Button onClick={() => navigate("/")} variant={"ghost"}><SiHomebridge size={30}/></Button>
              

                <Button onClick={() => navigate(`/${user.username}`)} variant={"ghost"}><RxAvatar size={30}/></Button>
                <Button onClick={() => navigate(`/findposts`)} variant={"ghost"}><CiSearch size={30}/></Button>
                
                <Button variant={"ghost"} onClick={()=> navigate("/chat")}><BsChatQuote size={30}/></Button>
                <Button onClick={toggleColorMode} variant={"ghost"}><VscColorMode size={30}/></Button>

                <LogoutButton/>
            
          </Flex>
        </>
    )
    }
  
   </> 
  )
}

export default Header