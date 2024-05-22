import { Helmet } from "react-helmet-async"
import { NavLink } from "react-router-dom"

export const NotFoundPage = () => {
  return (
    <>
    <Helmet>
        <title>Page Not Found - Baatchit</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist. Return to Baatchit for real-time messaging and seamless communication." />
        <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
    </Helmet>
    <div className="bg-background w-screen h-screen p-4 flex justify-center">

        <div className="h-fit justify-center flex mt-36 flex-col gap-y-10 rounded-sm items-center">

            <div className="flex flex-col items-center gap-y-4">
                <h4 className="text-text text-7xl font-extrabold">404</h4>
                <h4 className="text-text font-medium text-5xl">Ohh! looks like you landed on a wrong page 😺</h4>
            </div>
            <NavLink to={'/'}>
                <button className="text-text text-xl bg-secondary-dark px-6 py-2 rounded-md">Return to baatchit</button>
            </NavLink>
        </div>

    </div>
    </>
  )
}
