import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type PropTypes = {
  onEmojiSelect:(e:any)=>void
  onClickOutside?:()=>void
  emojiButtonSize:number
  emojiSize:number
}

export const EmojiPickerForm = ({emojiButtonSize,emojiSize,onEmojiSelect,onClickOutside}:PropTypes) => {

  return (
    <Picker 
      data={data}
      onEmojiSelect={onEmojiSelect}
      onClickOutside={onClickOutside}
      emojiButtonSize={emojiButtonSize}
      emojiSize={emojiSize}
      />
  );
};
