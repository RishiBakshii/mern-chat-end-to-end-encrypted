import {motion} from 'framer-motion'
import { AttachmentIcon } from './icons/AttachmentIcon';
import { GifIcon } from './icons/GifIcon';
import { MicIcon } from './icons/MicIcon';
import { SendIcon } from './icons/SendIcon';

type PropTypes = {
  messageVal: string;
  handleFileChange:(e: React.ChangeEvent<HTMLInputElement>) => void
  setMessageVal: React.Dispatch<React.SetStateAction<string>>;
  toggleGif:()=>void
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>
};

export const MessageInput = ({ messageVal, setMessageVal,toggleGif,toggleAttachmentsMenu }: PropTypes) => {
  return (
    <div className="flex bg-secondary rounded-xl text-text">

      <div onClick={()=>toggleAttachmentsMenu(prev=>!prev)} className="px-3 py-4 justify-center items-center flex relative ">
        <AttachmentIcon/>
      </div>

      <button onClick={toggleGif} type="button" className="px-3 py-4">
        <GifIcon/>
      </button>

      <input
        value={messageVal}
        onChange={(e) => {setMessageVal(e.target.value)}}
        className="px-3 py-5 outline-none bg-secondary rounded-sm w-full max-sm:text-sm"
        type="text"
        aria-autocomplete='none'
        autoComplete='off'
        placeholder="Your message"
      />

      <button type="button" className="px-3 py-4">
        <MicIcon/>
      </button>

      {messageVal?.trim().length > 0 && (
        <motion.button initial={{x:5,opacity:0,position:"fixed"}} animate={{x:0,opacity:1,position:"static"}} type="submit" className="px-3 py-4">
          <SendIcon/>
        </motion.button>
      )}
    </div>
  );
};
