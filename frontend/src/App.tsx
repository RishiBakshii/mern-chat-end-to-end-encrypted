import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Protected } from './components/auth/Protected';
import { RootLayout } from './components/layout/RootLayout';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { ChatPage, LoginPage, SignupPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';
import { useSetTheme } from './hooks/useUtils/useSetTheme';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()

  useSetTheme()
  
  useUpdateLogin(isSuccess,data)

  const router = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/' element={<Protected><RootLayout/></Protected>}>
        <Route index element={<ChatPage/>}/>
    </Route>
    <Route path='/signup' element={<Protected authorized={false}><SignupPage/></Protected>}/>
    <Route path='/login' element={<Protected authorized={false}><LoginPage/></Protected>}/>
    </>

  ));

  return (
    isFetching? null:
    <RouterProvider router={router}/>
  )
};
