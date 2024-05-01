import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import Post from "../components/Post"
import useGetUserProfile from '../../hooks/useGetUserProfile';
import { useRecoilState} from 'recoil';
import postsAtom from '../../atoms/postsAtom';

const UserPage = () => {

  const {user, loading} = useGetUserProfile();
  const[posts, setPosts] = useRecoilState(postsAtom);
  const {username} = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(()=> {

    const getPosts = async ()=> {
      setFetchingPosts(true);
      try {

        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if(data.error) {
          return;
        }
        setPosts(data);
        
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }

    };

    getPosts();

  }, [username, showToast, setPosts]);

  if(!user && loading){
    return (
      <>
      <Flex justifyContent={"center"} mt={40}>
      <Spinner size={"xl"}/>
      </Flex>
      </>
    )
  }

  if(!user && !loading) {
    return(
      <>
        <Flex justifyContent={"center"} mt={40}>
          <Text>404 | User Not Found</Text>
        </Flex>
      </>
    )
  }

  return (
    <>
        <UserHeader user = {user}/>

        {!fetchingPosts && posts.length === 0 && <Text textAlign={"center"} mt={12}>User has no posts</Text> }
        {fetchingPosts && (
          <>
            <Flex justifyContent={"center"} mt={12}>
            <Spinner size={"xl"}/>
            </Flex>
          </>
        )}

        {
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy}/>
          ))
        }

        
    </>
  )
}

export default UserPage