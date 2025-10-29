"use client"
import Image from "next/image"
import Badge from '../../icons/badges/first-claim.svg'
import { useTranslation } from 'react-i18next'

const FirstClaim = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Badge */}
      <div className="mb-6">
        <div className="w-24 h-24 relative">
          <Image
            src={Badge}
            alt="First Claim Badge"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-2">
        {t('claim.badges.firstClaim.title')}
      </h2>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {t('claim.badges.firstClaim.description')}
      </p>
    </>
  )
}

export default FirstClaim
