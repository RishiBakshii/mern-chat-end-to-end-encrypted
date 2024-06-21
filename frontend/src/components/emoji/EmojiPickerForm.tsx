import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { selectisDarkMode } from '../../services/redux/slices/uiSlice';
import { useAppSelector } from '../../services/redux/store/hooks';
import { useMediaQuery } from '../../hooks/useUtils/useMediaQuery';

type PropTypes = {
  onEmojiClick:(e: EmojiClickData) => void
  width?:number
  height?:number
  reactionsDefaultOpen?:boolean
}

export const EmojiPickerForm = ({onEmojiClick,reactionsDefaultOpen=false}:PropTypes) => {

  const isDarkMode =  useAppSelector(selectisDarkMode)
  const is375 =  useMediaQuery(375)

  return (
    <EmojiPicker
      emojiStyle={EmojiStyle.GOOGLE}
      reactionsDefaultOpen={reactionsDefaultOpen}
      onEmojiClick={onEmojiClick}
      onReactionClick={onEmojiClick}
      theme={isDarkMode?Theme.DARK:Theme.LIGHT}
      width={is375?305:350}
      height={450}
    />
  );
};
