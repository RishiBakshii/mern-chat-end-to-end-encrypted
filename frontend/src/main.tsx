import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { App } from './App.tsx'
import { SocketProvider } from './context/socket.tsx'
import './index.css'
import { store } from './services/redux/store/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HelmetProvider>
      <Provider store={store}>
        <SocketProvider>
            <Toaster/>
              <App />
        </SocketProvider>
      </Provider>
    </HelmetProvider>
)
