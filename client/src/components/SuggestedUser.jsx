import { Avatar, Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import useFollowUnfollow from '../../hooks/useFollowUnfollow'

const SuggestedUser = ({user}) => {
    const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
	console.log(user);
  return (
    <>
         <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}` }>
				<Avatar src={user.profilePic} name= {user.name} />
				<Flex alignItems={"center"} gap={1}>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					{user.isVerified && <Image src='/verified.png' w={4} h={4}/>}
				</Flex>
				
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnfollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex> 
    </>
  )
}

export default SuggestedUser