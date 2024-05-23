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
    <div className='w-[35rem] h-[35rem] max-xl:w-[30rem] max-sm:w-[100%] max-sm:h-[30rem]'>
      <GifPicker onGifClick={handleGifClick} theme={isDarkMode?Theme.DARK:Theme.LIGHT} tenorApiKey={env.VITE_TENOR_API_KEY} width={'100%'} height={'100%'} country="IN" categoryHeight={'8rem'}/>
    </div>
  )
}
