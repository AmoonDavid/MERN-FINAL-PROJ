import { Avatar, Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import useShowToast from '../../hooks/useShowToast'
import {formatDistanceToNow} from "date-fns"
import {DeleteIcon} from '@chakra-ui/icons'
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import postsAtom from '../../atoms/postsAtom'


const Post = ({post, postedBy}) => {
    const showToast = useShowToast()
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom)
    const [isDeleting, setIsDeleting] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(()=> {
        const getUser = async ()=>{
            try {

                const res = await fetch("/api/users/profile/"+postedBy)
                const data = await res.json();
                if(data.error){
                    showToast("error", data.error, "error");
                    return;
                }
                setUser(data);
            
                
            } catch (error) {
                showToast("Error", error.message, error);
                setUser(null)
            }
        }

        getUser();

    }, [postedBy, showToast]);

    if(!user) return null;

    const handleDeletePost = async (e) => {
        e.preventDefault();
        if(isDeleting) return;
        setIsDeleting(true);
        if(!window.confirm("This is an awesome post. Are you sure you want to delete it?")){
            setIsDeleting(false);
            return;
        }
        try {

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if(data.error) {
                showToast("Error", error.message, "error");
                return;
            }

            showToast("Success", "Post deleted successfully", "success");
            setPosts(posts.filter((p)=> p._id !== post._id));
            
        } catch (error) {
            showToast("Error", error.message, "error")
        } finally{
            setIsDeleting(false);
        }
    }

  return (
    <>
    <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar name={user.name} size={"md"} src={user.profilePic}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`)
                }}
                />
                <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} width={"full"}>

                    {
                        post.replies.length === 0 && 
                        
                        (<Text textAlign={"center"}>🥱</Text>)
                    }

                    { post.replies[0] && (

                        <Avatar 
                        name={post.replies[0].name} size={"xs"} position={"absolute"} top={"0px"}
                        left='15px' p={"2px"} src={post.replies[0].userProfilePic} />
                    )
                        
                    }

                    { post.replies[1] && (

                        <Avatar 
                        name={post.replies[1].name} size={"xs"} position={"absolute"} bottom={"0px"}
                        right='-5px' p={"2px"} src={post.replies[1].userProfilePic} />
                    )
                        
                    }

                    { post.replies[2] && (

                    <Avatar 
                    name={post.replies[2].name} size={"xs"} position={"absolute"} bottom={"0px"}
                    left='4px' p={"2px"} src={post.replies[2].userProfilePic} />
                    )

                    }
                
                
                </Box>
            </Flex>

            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"} onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`)
                }}>{user.username}</Text>

                        {user.isVerified && <Image src='/verified.png' w={4} h={4} ml={1}/> }
                        
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                        </Text>
                        { currentUser?._id === user._id && (
                        <>
                            <Button onClick={handleDeletePost} p={0} isLoading={isDeleting}><DeleteIcon  size={20} /></Button>
                        </>
                        )}
                    </Flex>
                </Flex>
                <Text fontSize={"sm"}>{post.text}</Text>
                
                {post.img && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={post.img} w={"full"}/>
                    </Box>
                )}

                
                <Flex gap={3} my={1}>
                    <Actions post={post}/>
                </Flex>

                
            </Flex>
        </Flex>
    </Link>
    </>
  )
}

export default Post