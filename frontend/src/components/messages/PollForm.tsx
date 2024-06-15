import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useSendMessage } from "../../hooks/useMessages/useSendMessage"
import { pollSchema, pollSchemaType } from "../../schemas/message"
import { FormInput } from "../ui/FormInput"
import { SubmitButton } from "../ui/SubmitButton"
import { useTogglePoolForm } from "../../hooks/useUI/useTogglePoolForm"
import { ToggleSwitch } from "../ui/ToggleSwitch"
import { useState } from "react"

export const PollForm = () => {



  const sendMessage = useSendMessage()
  const {togglePollForm} = useTogglePoolForm()

  const [isMultipleAnswers,setIsMultipleAnswers] = useState<boolean>(false)

  const { register, handleSubmit,control,formState: { errors } } = useForm<pollSchemaType>({resolver:zodResolver(pollSchema)})

   const {fields,append} = useFieldArray({
    name: "options",
    control,
  });

  const handleAddOption = ()=>{
    if(fields.length!==5){
      append({optionValue:""})
    }
    else{
      toast.error("You cannot add more than 5 options")
    }
  }

  const onSubmit: SubmitHandler<pollSchemaType> = ({options,question}) => {
    
      if(!options.length){
        toast.error("Please provide options")
        return
      }

      if(options.length<2){
        toast.error("Atleast 2 options are needed for creating a poll")
        return 
      }

      sendMessage(undefined,undefined,question,options.map(option=>option.optionValue),isMultipleAnswers)
      togglePollForm()
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-7">
      
      <h5 className="text-fluid-h5">Create Poll</h5>

      <div className="flex flex-col gap-y-6">

        <FormInput
          register={{...register("question")}} 
          placeholder="Ask question"
          error={errors.question?.message}
        />

        <div className="flex flex-col gap-y-4">

            <div className="flex items-center gap-x-2">

                <p>Options</p>

                <button onClick={handleAddOption} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

            </div>
            
            
            {
              fields.map((feild,index)=>(
                
                <FormInput 
                  key={feild.id}
                  register={{...register(`options.${index}.optionValue`)}} 
                  placeholder="+ Add"
                  error={errors.options?.message}
                />

              ))
            }

            {
              fields.length>1 && 

              <div className="flex items-center justify-between">

                  <p>Allow multiple answers</p>

                  <ToggleSwitch
                    initialValue={isMultipleAnswers}
                    toggle={()=>setIsMultipleAnswers(!isMultipleAnswers)}
                  />
              </div>
            }
        </div>

      </div>

      <SubmitButton btnText="Send"/>
    </form>
  )
}
