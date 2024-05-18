import GifPicker, { TenorImage } from 'gif-picker-react'
import { env } from '../../config/envConfig';
import { useSendMessage } from '../../hooks/useMessages/useSendMessage';

export const TenorGifForm = () => {
    
    const sendMessage = useSendMessage()

    const handleGifClick = (image:TenorImage)=>{
      sendMessage(undefined,image.url)
    }

  return (
    <GifPicker onGifClick={handleGifClick} tenorApiKey={env.VITE_TENOR_API_KEY} country="IN" width={'35rem'} height={'35rem'} categoryHeight={'10rem'}/>
  )
}
