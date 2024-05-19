type PropTypes = {
    options:Array<{name:string,handlerFunc:()=>void}>
}

export const ContextMenu = ({options}:PropTypes) => {

    return (
        <div className={`bg-secondary text-text p-4 rounded-md shadow-2xl absolute -left-36 -top-14`}>
            {
                options.map(({name,handlerFunc})=>(
                    <p className="hover:bg-secondary-dark rounded-sm cursor-pointer p-2" onClick={handlerFunc}>{name}</p>
                ))
            }
        </div>

    )
}
