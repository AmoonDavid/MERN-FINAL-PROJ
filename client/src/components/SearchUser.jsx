import { Avatar, Box, Button, Flex, FormControl, Grid, GridItem, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { SearchIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from 'react-icons/bs';
import useShowToast from '../../hooks/useShowToast.js';
import { useRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messagesAtom.js';


const SearchUser = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchedUserText, setSearchedUserText] = useState("");
    const [serachedUser, setSearchedUser] = useState("");
    const showToast = useShowToast();
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);

    const handleConversationSearch = async ( currUser) => {
		
		try {

			const conversationAlreadyExists = conversations.find(
				(conversation) => (conversation.participants[0]._id).toString() === currUser._id
			);

            console.log(currUser)

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: currUser._id,
					username: currUser.username,
                    name: currUser.name,
					userProfilePic: currUser.profilePic,
				});
                onClose();
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: currUser._id,
						username: currUser.username,
						profilePic: currUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
            onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		} 
	};

    const getUsers = async ()=> {
        if(searchedUserText === "") return;
        try {
            const res = await fetch(`/api/users/search/${searchedUserText}`);
            const data = await res.json();
            if(data.error){
                showToast("Error", data.error, "error")
            }
            setSearchedUser(data);
            
        } catch (error) {
            showToast("Error", error.message, "error")
        }
    }

    useEffect(()=> {
        getUsers();

    }, [searchedUserText])


  return (
    <>
    <Button onClick={onOpen}>
        <SearchIcon />
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Search User</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
                            <Input type='text' value={searchedUserText} onChange={(e) => setSearchedUserText(e.target.value)}/>
                            
						</FormControl>
                        {serachedUser.length > 0 && (
                          <Grid templateColumns='repeat(2, 1fr)' gap={5} mt={5} justifyItems={"start"} >
                            { serachedUser.map((user) => (
                                <GridItem key={user._id}>
                                    <Box display={"flex"} _hover={{
                                        cursor: "pointer",
                                        bg: "gray.500",
                                        color: "white",
                                    }} p={2}
                                    onClick={()=> handleConversationSearch(user)}
                                    >
                                       <Avatar name={user.name} src={user.profilePic}/>
                                       <Box display={"flex"} flexDirection={"column"} ml={1}>
                                            <Box display={"flex"} gap={1}>
                                                <Text>{user.name}</Text>
                                                {user.isVerified && <Image src='./verified.png' w={4} h={4}/> }
                                            </Box>
                                            <Text fontSize={"sm"}>{user.username}</Text>
                                       </Box>
                                    </Box>
                                </GridItem>
                            ))
                            }

                          </Grid>
                        )}
                        
                            
                            
					</ModalBody>

					<ModalFooter>
					</ModalFooter>
				</ModalContent>
			</Modal>
    </>
  )
}

export default SearchUser