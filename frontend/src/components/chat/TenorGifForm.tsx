import GifPicker, { TenorImage, Theme } from 'gif-picker-react'
import { env } from '../../config/envConfig';
import { useSendMessage } from '../../hooks/useMessages/useSendMessage';
import { useAppSelector } from '../../services/redux/store/hooks';
import { selectisDarkMode } from '../../services/redux/slices/uiSlice';

export const TenorGifForm = () => {
    
    const sendMessage = useSendMessage()
    const isDarkMode =  useAppSelector(selectisDarkMode)

    const handleGifClick = (image:TenorImage)=>{
      sendMessage(undefined,image.url)
    }

  return (
    <GifPicker onGifClick={handleGifClick} theme={isDarkMode?Theme.DARK:Theme.LIGHT} tenorApiKey={env.VITE_TENOR_API_KEY} country="IN" width={'35rem'} height={'35rem'} categoryHeight={'10rem'}/>
  )
}
