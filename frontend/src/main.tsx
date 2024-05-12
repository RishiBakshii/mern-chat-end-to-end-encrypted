import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './context/socket.tsx'
import { store } from './services/redux/store/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
        <Provider store={store}>
            <Toaster/>
            <App />
        </Provider>
    </SocketProvider>
  </React.StrictMode>,
)
