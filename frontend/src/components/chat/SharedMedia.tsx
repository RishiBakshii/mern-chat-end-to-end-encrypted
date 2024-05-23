import { useState } from "react";

type PropTypes = {
    sharedMedia?:Array<string>
}

export const SharedMedia = ({}:PropTypes) => {

    const [seeAll,setSeeAll] = useState<boolean>(false)

    const toggleSeeALL = ()=>{
        setSeeAll(!seeAll)
    }

  return (

    <div className="flex flex-col gap-y-4">

        <div className="flex items-center justify-between">
            <p>Shared media 178</p>
            <button onClick={toggleSeeALL}>{seeAll?"See less":"See all"}</button>
        </div>

        <div className="grid grid-cols-2 gap-4 place-items-center h-[30rem] overflow-y-scroll">
            {
                new Array(40).fill(0).map((_,index)=>(
                    <img className="w-40 h-40 object-cover" src={`https://source.unsplash.com/random/?wild&${index}`} alt={`${index}`} />
                ))
            }
        </div>

    </div>

  );
};
