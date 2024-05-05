import { Box, Button, Flex, Input, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../../hooks/useShowToast';
import { IoSearchOutline } from "react-icons/io5";
import Post from '../components/Post';

const FindPosts = () => {

    const [posts, setPosts] = useState([]);
    const [postQueryText, setPostQueryText] = useState("");
    const showToast = useShowToast();
    const[loading, setLoading] = useState(true);

    useEffect(()=> {
        setLoading(true);
        const getPosts = async () => {
            try {
                const res = await fetch("/api/posts/findposts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postQueryText}),
                });
                const data = await res.json();
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts(data);
                
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    },[]);

    const handleQueryClick = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts/findposts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postQueryText}),
            });
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setPosts(data);
            
        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setLoading(false);
        }
    }


  return (
    <>
        <Flex justify={"center"}>
            <Input placeholder={"Search for posts"} value={postQueryText} onChange={(e) => setPostQueryText(e.target.value)}/>
            <Button variant={"ghost"} onClick={handleQueryClick}><IoSearchOutline size={30}/></Button>
        </Flex>

        {loading && (
          <Flex  mt={20} justify={"center"} >
            <Spinner size={"xl"}/>
          </Flex>
        )}

        <Flex gap={10} >
        <Box mt={20}>
    
        {
          posts.map((post)=> (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))
        }
        </Box>
    </Flex>
    </>
  )
}

export default FindPosts