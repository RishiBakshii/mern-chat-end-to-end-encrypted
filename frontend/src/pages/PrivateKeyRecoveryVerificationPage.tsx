import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useVerifyPrivateKeyToken } from "../hooks/useAuth/useVerifyPrivateKeyToken"
import { Modal } from "../components/shared/Modal"
import { config } from "../config/envConfig"

export const PrivateKeyRecoveryVerificationPage = () => {

    const {recoveryToken} = useParams<{recoveryToken:string}>()

    const {verifyRecoveryToken,isSuccess} =  useVerifyPrivateKeyToken()

    useEffect(()=>{
        if(recoveryToken){
            verifyRecoveryToken({recoveryToken})
        }
    },[recoveryToken])

  return (

    isSuccess && 
    <Modal isOpen={true} onClose={()=>""} >

      <div className='flex flex-col gap-y-4'>
          <h2 className="text-xl font-bold">Private Key Recovered Successfully</h2>
          <p>Congratulations! Your private key has been successfully recovered. Your private key is a critical part of your cryptographic identity. Here’s a brief overview of its role:</p>
          <ul className="list-disc list-inside">
              <li><strong>Encryption:</strong> When you send a message, your private key is used to encrypt the data, ensuring that only the intended recipient can read it.</li>
              <li><strong>Decryption:</strong> When you receive a message, your private key is used to decrypt the data, allowing you to read messages securely sent to you.</li>
              <li><strong>Authentication:</strong> Your private key also helps in verifying your identity when performing cryptographic operations, ensuring that your communications remain secure and authenticated.</li>
          </ul>
          <p>It is important to keep your private key safe and secure. Never share it with anyone, and always use a strong, unique password to protect it. If you have any questions or need further assistance, please contact our support team.</p>

          <a href={config.clientUrl}>
              <button className="bg-primary py-2 font-medium text-lg w-full hover:bg-primary-dark">Proceed to homepage</button>
          </a>
      </div>
    </Modal>
  )
}
