import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Loader } from './components/loader/Loader';
import { useCheckAuthQuery } from './features/auth/api';
import { Login } from './features/auth/components/Login';
import { Protected } from './features/auth/components/Protected';
import { Signup } from './features/auth/components/Signup';
import { Chat } from './features/chat/components/Chat';
import { RootLayout } from './features/layout/components/RootLayout';
import { useUpdateLogin } from './hooks/useUpdateLogin';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()

  useUpdateLogin(isSuccess,data)

  const router = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/' element={<Protected><RootLayout/></Protected>}>
        <Route path='/' element={<Chat/>}/>
    </Route>
    <Route path='/signup' element={<Protected authorized={false}><Signup/></Protected>}/>
    <Route path='/login' element={<Protected authorized={false}><Login/></Protected>}/>
    </>

  ));

  return (
    isFetching? <Loader/>:
    <RouterProvider router={router}/>
  )
};
