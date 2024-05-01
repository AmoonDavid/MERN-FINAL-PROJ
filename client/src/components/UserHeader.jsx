import { Avatar, Box, Flex, Text, VStack, Menu, MenuItem, MenuButton, Portal, MenuList, useToast, Button, Image } from '@chakra-ui/react'
import React, { useState } from 'react'
import {BsInstagram} from "react-icons/bs"
import {CgMoreO} from "react-icons/cg"
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { Link, useParams } from 'react-router-dom'
import useShowToast from '../../hooks/useShowToast'
import useFollowUnfollow from '../../hooks/useFollowUnfollow'
import CreatePost from './CreatePost'

const UserHeader = ({user}) => {

    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
    const copyURL = ()=> {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(()=>{
            showToast("Done" , "Profile Link Copied", "success")
        })
    };

    const {username} = useParams();


  return (
    <>
        <VStack gap={4} alignItems={"start"}>
            <Flex justify={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"} >{user.username}</Text>
                        <Text fontSize={"sm"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
                        {user.isVerified && <Image src='/verified.png' w={4} h={4} ml={1}/> }
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                    name= {user.name}
                    src={user.profilePic}
                    size={
                    {
                        base:"md",
                        md:"xl",
                    }
                    }
                    />
                </Box>
            </Flex>
            <Text>{user.bio}</Text>
                    {currentUser?._id === user._id && (
                        <Link to='/update'>
                        <Button size={"sm"}>Update Profile</Button>
                        </Link>
                    )}
                    {currentUser?._id !== user._id && (
                        <Link>
                        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
                        </Link>
                    )}

            <Flex justify={"space-between"} w={"full"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{ user.followers.length === 1 ? `${user.followers.length} follower` : `${user.followers.length} followers`}</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    {username === currentUser?.username && (
                        
                        <CreatePost/>
                        
                    )}
                    
                    
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"}/>
                    </Box>
                    
                    <Box className='icon-container'>

                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                        
                    </Box>
                </Flex>
            </Flex>

            <Flex w={"full"}>
                <Flex flex={1} justifyContent={"center"} borderBottom={"1.5px solid white"} pb={3} cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex flex={1} justifyContent={"center"} borderBottom={"1px solid gray"} pb={3} cursor={"pointer"} color={"gray.light"}>
                <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    </>
  )
}

export default UserHeader