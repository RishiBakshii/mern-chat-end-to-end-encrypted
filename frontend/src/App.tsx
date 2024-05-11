import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Loader } from './components/shared/Loader';
import { useCheckAuthQuery } from './features/auth/api';
import { Protected } from './features/auth/components/Protected';
import { useUpdateLogin } from './hooks/useUpdateLogin';
import { RootLayout } from './layouts/RootLayout';
import { Chat } from './features/chat/components/Chat';
import { LoginPage, SignupPage } from './pages';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()
  
  useUpdateLogin(isSuccess,data)

  const router = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/' element={<Protected><RootLayout/></Protected>}>
        <Route index element={<Chat/>}/>
    </Route>
    <Route path='/signup' element={<Protected authorized={false}><SignupPage/></Protected>}/>
    <Route path='/login' element={<Protected authorized={false}><LoginPage/></Protected>}/>
    </>

  ));

  return (
    isFetching? <Loader/>:
    <RouterProvider router={router}/>
  )
};
