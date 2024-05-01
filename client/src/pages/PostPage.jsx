import React, { useEffect, useState } from 'react'
import {Avatar, Box, Button, Divider, Flex, Image, Spinner, Text} from "@chakra-ui/react"
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import useShowToast from '../../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import {DeleteIcon} from '@chakra-ui/icons'
import Comments from '../components/Comments'
import postsAtom from '../../atoms/postsAtom'

const PostPage = () => {
  const {user, loading} = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const {pid} = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(()=> {

    const getPost = async ()=> {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
        
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }

    getPost();

  },[showToast, pid, setPosts])

  const handleDeletePost = async (e) => {
    if(isDeleting) return;
    setIsDeleting(true);
    e.preventDefault();
    if(!window.confirm("This is an awesome post. Are you sure you want to delete it?")){
        setIsDeleting(false);
        return;
    }
    try {

        const res = await fetch(`/api/posts/${currentPost._id}`, {
            method: "DELETE",
        });

        const data = await res.json();
        if(data.error) {
            showToast("Error", error.message, "error");
            return;
        }

        showToast("Success", "Post deleted successfully", "success");
        navigate(`/${user.username}`)
        
    } catch (error) {
        showToast("Error", error.message, "error")
    } finally{
        setIsDeleting(false);
    }
}

  if(!user && loading){
    return (
      <>
      <Flex justifyContent={"center"} mt={40}>
      <Spinner size={"xl"}/>
      </Flex>
      </>
    )
  }

  if(!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name='mark zuckerburg'/>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            {user.isVerified && <Image src='/verified.png' w={4} h={4} ml={1}/> }
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                        </Text>
                        { currentUser?._id === user._id && (
                        <>
                            <Button onClick={handleDeletePost} p={0} isLoading={isDeleting}><DeleteIcon  size={20} /></Button>
                        </>
                        )}
                    </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      { currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost.img} w={"full"}/>
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>

      {/* <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"sm"} color={"gray.light"}>238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text fontSize={"sm"} color={"gray.light"}>
          {post.likes.length} likes
          
          </Text>
      </Flex> */}
      <Divider my={4}/>
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>

      { currentPost.replies.map(reply => (
        <Comments 
        key={reply._id} 
        reply={reply} 
        lastReply = {reply._id === currentPost.replies[currentPost.replies.length -1]._id}/>
      )) }
      
      
    </>
  )
}

export default PostPage