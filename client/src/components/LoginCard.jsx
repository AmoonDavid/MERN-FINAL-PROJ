import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atoms/authAtom'
import { useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import { json } from 'react-router-dom';
import userAtom from '../../atoms/userAtom';
  
  export default function LoginCard() {

    const showToast = useShowToast();   
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreenState = useSetRecoilState(authScreenAtom);
    const setUserState = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
      username: "",
      password: "",
    })

    

    const handleLogin = async() => {
      setLoading(true);
      try {

        const res = await fetch(import.meta.env.VITE_LOGIN_API , {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(inputs),
        });
  
        const data = await res.json();
      

        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUserState(data);

      } catch (err) {
        showToast("Error", err, "error")
      } finally{
        setLoading(false);
      }
    }
    return (
      <Flex
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('white', 'gray.dark')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={"center"}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User Name</FormLabel>
                <Input type="text" placeholder='johndoe'
                value={inputs.username}
                onChange={(e)=>(setInputs({...inputs, username: e.target.value}))}
                    
                // onChange={(e)=>(setInputs({...inputs, username: e.target.value}))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} placeholder='Atleast 6 charecters'
                  
                  onChange={(e)=>(setInputs({...inputs, password: e.target.value}))}
                  value={inputs.password}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>


              <Stack spacing={8}>
                {/* <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Text color={'blue.400'}>Forgot password?</Text>
                </Stack> */}
                <Button
                loadingText={"Sigining in"}
                  bg = {useColorModeValue ("gray.600", "gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue ("gray.700", "gray.800"),
                  }}
                  onClick={handleLogin}
                  isLoading={loading}
                  >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Stack>
                <Text align={'center'}>
                  Don't have an account? <Link color={'blue.400'}
                  onClick={()=>setAuthScreenState("signup")}
                  >Sign Up</Link> for free
                </Text>
              </Stack>
        </Stack>

        
      </Flex>
    )
  }