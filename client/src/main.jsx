import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { BrowserRouter} from "react-router-dom"
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from '../context/SocketContext.jsx'
import {RecoilDevTools} from 'recoil-toolkit'


//Implementing styles with props for a dark mode

const styles = {
  gloal: (props) => ({
    color:mode("gray.800", "whiteAlpha.900")(props),
    bg:mode("gray.100", "#101010")(props)
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: "true",
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  }
};

const theme = extendTheme({styles, config, colors});



ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RecoilRoot>
      <RecoilDevTools forceSerialize={false} />
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <SocketContextProvider>
            <App />
            </SocketContextProvider>
          </ChakraProvider>
        </BrowserRouter>
    </RecoilRoot>
 
)