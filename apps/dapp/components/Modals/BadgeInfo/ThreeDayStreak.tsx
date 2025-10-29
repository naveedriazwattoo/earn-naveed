"use client"
import Image from "next/image"
import Badge from '../../icons/badges/3-day-claim-streak.svg'
import { useTranslation } from 'react-i18next'

const ThreeDayStreak = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Badge */}
      <div className="mb-6">
        <div className="w-24 h-24 relative">
          <Image
            src={Badge}
            alt="3-Day Streak Badge"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-2">
        {t('claim.badges.threeDayStreak.title')}
      </h2>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {t('claim.badges.threeDayStreak.description')}
      </p>
    </>
  )
}

export default ThreeDayStreak
