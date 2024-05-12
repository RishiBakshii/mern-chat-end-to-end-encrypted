import GifPicker, { TenorImage } from 'gif-picker-react'
import { env } from '../../config/envConfig';
import { useMessageSubmit } from '../../hooks/useMessageSubmit';

export const TenorGifForm = () => {

    const submitMessage = useMessageSubmit()
    
    const handleGifClick = (image:TenorImage)=>{
      submitMessage(undefined,image.url)
    }

  return (
    <GifPicker onGifClick={handleGifClick} tenorApiKey={env.VITE_TENOR_API_KEY} country="IN" width={'35rem'} height={'35rem'} categoryHeight={'10rem'}/>
  )
}
