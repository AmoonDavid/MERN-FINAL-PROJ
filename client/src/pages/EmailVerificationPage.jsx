import { Box, Button, Text, WrapItem } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { useNavigate, useParams } from 'react-router-dom'
import useShowToast from '../../hooks/useShowToast'


const EmailVerificationPage = () => {
    const setUser = useSetRecoilState(userAtom);
    const navigate = useNavigate()
    const showToast = useShowToast()
    const {emailToken} = useParams();
    const [verified, setVerified] = useState("");

    useEffect (()=> {
        
        const verifyEmail = async ()=> {
            localStorage.removeItem("user-threads");
			setUser(null);    
            try {
                const res = await fetch(`/api/users/verify/${emailToken}`);
                const data = await res.json();
                if(data.error){
                    showToast("Error", data.error, "error")
                    setVerified(false);
                } else {
                    setVerified("true");
                }
                
            } catch (error) {
                showToast("Error", error.message, "error")
                setVerified(false);
            }
        }

        verifyEmail();
        
    }, [verified])

    const handleLogin = () => {
        navigate ("/");
    }

  return (
    <>
    {verified && (
        <>
        <Box bg={"green.100"} p={10} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={10}>
        <Text fontSize={25} textAlign={"center"} color={'black'}> Congratualtions! Your Email is Verified. Please click on the button below to Log-in </Text>
        <WrapItem>
            <Button colorScheme='whatsapp' onClick={handleLogin}>LogIn</Button>
        </WrapItem>
    </Box>
        </>
    )}

    {!verified && (
        <>
            <Box bg={"red.100"} p={10} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={10}>
        <Text fontSize={25} textAlign={"center"} color={'black'}> Unable to verify your token this could mean:</Text>
        <Text fontSize={25} textAlign={"center"} color={'black'}> 1. You have already verified your email. Please login to check</Text>
        <Text fontSize={25} textAlign={"center"} color={'black'}> 2. Your token is invalid. Please login to resend the token</Text>
        <WrapItem>
            <Button colorScheme='whatsapp' onClick={handleLogin}>LogIn</Button>
        </WrapItem>
    </Box>
        </>
    )}
    </>
  )
}

export default EmailVerificationPage