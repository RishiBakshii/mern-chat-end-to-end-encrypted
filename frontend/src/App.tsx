import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Protected } from './components/auth/Protected';
import { RootLayout } from './components/layout/RootLayout';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { ChatPage, ForgotPasswordPage, LoginPage, NotFoundPage, ResetPasswordPage, SignupPage, VerificationPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';
import { useSetTheme } from './hooks/useUtils/useSetTheme';
import { AuthLayout } from './components/layout/AuthLayout';
import { useAppSelector } from './services/redux/store/hooks';
import { selectLoggedInUser } from './services/redux/slices/authSlice';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()

  useSetTheme()
  
  useUpdateLogin(isSuccess,data)
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const router = createBrowserRouter(createRoutesFromElements(

    <>

    
    <Route path='/' element={
        <Protected 
          loggedInUser={loggedInUser}>
          <RootLayout/>
        </Protected>
      }
    >
        <Route index element={<ChatPage/>}/>
    </Route>

    <Route path='/auth' element={<AuthLayout />}>

      <Route path='signup' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <SignupPage />
        </Protected>
      } />

      <Route path='login' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <LoginPage />
        </Protected>
      } />

      <Route path='forgot-password' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <ForgotPasswordPage />
        </Protected>
      } />

      <Route path='reset-password' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <ResetPasswordPage />
        </Protected>
      } />

      <Route path='verification' element={
        <Protected loggedInUser={loggedInUser} authorized={true}>
          <VerificationPage/>
        </Protected>
      } />

    </Route>


    {/* Catch-all route for 404 page */}
    <Route path='*' element={<NotFoundPage />} />

    </>

  ));

  return (
    isFetching? <div></div>:
    <RouterProvider router={router}/>
  )
};
