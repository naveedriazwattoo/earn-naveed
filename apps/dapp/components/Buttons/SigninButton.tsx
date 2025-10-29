"use client"
import { useTranslation } from 'react-i18next'

interface SigninButtonProps {
  onSignIn: () => void;
  disabled?: boolean;
}

const SigninButton = ({ onSignIn, disabled = false }: SigninButtonProps) => {
  const { t } = useTranslation()
  
  return (
    <button 
      className={`bg-white text-black font-medium w-full mx-6 py-[10px] xs:py-[15px] text-[19px] rounded-full ${disabled ? 'opacity-50' : ''}`}
      onClick={onSignIn}
      disabled={disabled}
    >
      {t('common.signIn')}
    </button>
  )
}

export default SigninButton