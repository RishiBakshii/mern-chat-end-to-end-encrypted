import { motion } from 'framer-motion';
import { useDynamicRowValue } from '../../hooks/useUtils/useDynamicRowValue';
import { AttachmentIcon } from './icons/AttachmentIcon';
import { GifIcon } from './icons/GifIcon';
import { SendIcon } from './icons/SendIcon';
import { SmileIcon } from './icons/SmileIcon';

type PropTypes = {
  messageVal: string;
  handleFileChange:(e: React.ChangeEvent<HTMLInputElement>) => void
  setMessageVal: React.Dispatch<React.SetStateAction<string>>;
  toggleGif:()=>void
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>
  toggleEmojiForm:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

export const MessageInput = ({ messageVal, setMessageVal,toggleGif,toggleAttachmentsMenu,toggleEmojiForm}: PropTypes) => {

  const {getRowValue} = useDynamicRowValue()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.closest('form'); // Finds the closest form element
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className="flex rounded-xl text-text items-center bg-secondary">

      <button type='button' onClick={toggleEmojiForm}>
        <SmileIcon/>
      </button>

      <textarea
        value={messageVal}
        onChange={(e) => {setMessageVal(e.target.value)}}
        className="px-3 py-5 bg-secondary outline-none rounded-sm w-full max-sm:text-sm resize-none scroll-smooth"
        aria-autocomplete='none'
        style={{scrollbarWidth:"none"}}
        autoComplete='off'
        placeholder="Your message"
        name='chatMessageBaatchit'
        inputMode='text'
        id='message-input'
        spellCheck="false"
        autoCorrect='off'
        autoCapitalize='none'
        maxLength={1000}
        rows={getRowValue(messageVal.length)}
        onKeyDown={handleKeyDown}
      />

        {
          !messageVal.trim() && 

            <motion.div variants={{hide:{opacity:0,y:20},show:{opacity:1,y:0}}} initial="hide" animate="show" className='flex'>

              <div onClick={()=>toggleAttachmentsMenu(prev=>!prev)} className="px-3 py-4 justify-center items-center flex relative">
                <AttachmentIcon/>
              </div>

              <button onClick={toggleGif} type="button" className="px-3 py-4">
                <GifIcon/>
              </button>

            </motion.div>
        }

      {messageVal?.trim().length > 0 && 
        <motion.button onMouseDown={e=>e.preventDefault()} initial={{x:5,opacity:0,position:"fixed"}} animate={{x:0,opacity:1,position:"static"}} type="submit" className="bg-primary-dark p-2 hover:bg-transparent transition-colors rounded-full">
          <SendIcon/>
        </motion.button>
      }
    </div>
  );
};
