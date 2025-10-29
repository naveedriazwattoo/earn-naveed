"use client"
import Image from "next/image"
import Badge from '../../icons/badges/80-percentile.svg'
import { useTranslation } from 'react-i18next'

interface TopEarnerProps {
  percent: number
}

const TopEarner = ({ percent }: TopEarnerProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Badge */}
      <div className="mb-6">
        <div className="w-24 h-24 relative">
          <Image
            src={Badge}
            alt={`${percent}th Percentile Badge`}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-2">
        {t('claim.badges.topEarner.title', { percent })}
      </h2>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {t('claim.badges.topEarner.description', { percent: percent })}
      </p>
    </>
  )
}

export default TopEarner
