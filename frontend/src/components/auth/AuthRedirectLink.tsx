import { Link } from "react-router-dom"

type PropTypes = {
    to:string,
    pageName:string
    text:string
}

export const AuthRedirectLink = ({to,pageName,text}:PropTypes) => {
  return (
    <p>{text}
        <span className="text-violet-500 font-medium cursor-pointer ml-1">
            <Link to={`/${to}`}>
                {pageName}
            </Link>
        </span>
    </p>
  )
}
