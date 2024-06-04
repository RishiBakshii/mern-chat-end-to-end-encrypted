

type contextOptions = {
    name:string,
    handlerFunc:()=>void
}

type PropTypes = {
    options:Array<contextOptions>
}

export const ContextMenu = ({options}:PropTypes) => {

    return (
        <div className={`bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl absolute -left-32 min-w-32 z-10`}>
            {
                options.map(({name,handlerFunc})=>(
                    <p key={name} className="hover:bg-secondary-darker rounded-sm cursor-pointer p-2" onClick={handlerFunc}>{name}</p>
                ))
            }
        </div>
    )
}
