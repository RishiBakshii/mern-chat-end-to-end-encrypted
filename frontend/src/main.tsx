import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './context/socket.tsx'
import { store } from './services/redux/store/store.ts'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <SocketProvider>
            <Toaster/>
            <App />
        </SocketProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
