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

        <div className="flex items-center flex-wrap gap-3 justify-center h-96 overflow-y-scroll scroll-smooth">
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/userupload/10173826/file/original-42da690103715dc7008f252a546a62a2.jpg?resize=1660x1261" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/1560823/screenshots/20027650/media/3628198b090695fff4cf4b5e1fba50b5.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/6015481/screenshots/17010524/media/0fe7e273cafb9aaebd7cb8e303632e78.png?resize=450x338&vertical=center" alt="" />
            <img className="aspect-video object-cover h-16" src="https://cdn.dribbble.com/users/2073941/screenshots/18972654/media/7be66ee9656b924727f7885cf073f38b.png?resize=450x338&vertical=center" alt="" />
        </div>

    </div>

  );
};
