import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'

const UserPost = ({likes, replies, postImage, postTitle}) => {
    

    const [liked, setLiked] = useState(false);
  return (
    <>
    <Link to={"/markzuckerburg/post/1"}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar name='mark zukerburg' size={"md"} src='/zuck-avatar.png'/>
                <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} width={"full"}>
                <Avatar 
                name='Dan Abrahmov' size={"xs"} position={"absolute"} top={"0px"} left={"15px"} p={"2px"} src='https://bit.ly/dan-abramov' />
                <Avatar 
                name='Dan Abrahmov' size={"xs"} position={"absolute"} bottom={"0px"} right={"-5px"} p={"2px"} src='https://bit.ly/code-beast' />
                <Avatar 
                name='Dan Abrahmov' size={"xs"} position={"absolute"} bottom={"0px"} left={"4px"} p={"2px"} src='https://bit.ly/ryan-florence' />
                </Box>
            </Flex>

            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerburg</Text>
                        <Image src='/verified.png' w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>
                <Text fontSize={"sm"}>{postTitle}</Text>
                
                {postImage && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={postImage} w={"full"}/>
                    </Box>
                )}

                
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>

                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
                </Flex>
            </Flex>
        </Flex>
    </Link>
    </>
  )
}

export default UserPost