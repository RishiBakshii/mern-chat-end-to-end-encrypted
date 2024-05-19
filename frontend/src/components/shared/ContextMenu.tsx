type contextOptions = {
    name:string,
    handlerFunc:()=>void
}

type PropTypes = {
    options:Array<contextOptions>
}

export const ContextMenu = ({options}:PropTypes) => {

    return (
        <div className={`bg-secondary text-text p-4 rounded-md shadow-2xl absolute -left-36 -bottom-0`}>
            {
                options.map(({name,handlerFunc})=>(
                    <p key={name} className="hover:bg-secondary-dark rounded-sm cursor-pointer p-2" onClick={handlerFunc}>{name}</p>
                ))
            }
        </div>
    )
}
