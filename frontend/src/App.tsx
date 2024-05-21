import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Protected } from './components/auth/Protected';
import { RootLayout } from './components/layout/RootLayout';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { ChatPage, LoginPage, SignupPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';
import { useSetTheme } from './hooks/useUtils/useSetTheme';
import { AuthLayout } from './components/layout/AuthLayout';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()

  useSetTheme()
  
  useUpdateLogin(isSuccess,data)

  const router = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/auth' element={<Protected authorized={false}><AuthLayout/></Protected>}>
        <Route path='signup' element={<SignupPage/>}/>
        <Route path='login' element={<LoginPage/>}/>
    </Route>

    <Route path='/' element={<Protected><RootLayout/></Protected>}>
        <Route index element={<ChatPage/>}/>
    </Route>
    </>

  ));

  return (
    isFetching? null:
    <RouterProvider router={router}/>
  )
};
