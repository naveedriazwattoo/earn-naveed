import EmptyBadge from '../icons/badges/empty-badge.svg'
import Image from 'next/image'
import { badgeTypeList } from '@/utils/badges'
import { useTranslation } from 'react-i18next';

interface BadgesProps {
  isSticky?: boolean;
  hidden?: boolean;
  badgeList?: string[];
}

const Badges = ({ isSticky, hidden, badgeList = [] }: BadgesProps) => {
  const { t } = useTranslation();
  const paddedBadgeList = [...badgeList, ...Array(5 - badgeList.length).fill(null)]
  return (
    <div className={`rounded-t-3xl w-full max-h-[184px] bg-black flex flex-col ${hidden ? 'hidden' : ''} ${isSticky ? 'absolute top-0 inset-x-0 ' : ''}`}>
      <h2 className='text-white text-[17px] font-bold text-start mx-[24px] pt-[24px]'>
        {t('claim.badges.title')}
      </h2>
      <div className='w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div className='flex gap-x-[15px] min-w-min mx-[24px] pt-[26px] pb-[22px]'>
          {paddedBadgeList.map((badgeName, i) => {
            if (!badgeName) {
              return (
                <div key={i} className='flex-shrink-0'>
                  <Image
                    src={EmptyBadge}
                    alt="empty badge"
                    width={80}
                    height={80}
                  />
                </div>
              )
            }
            
            const badge = badgeTypeList.find(b => b.name === badgeName)
            return badge ? (
              <div key={i} className='flex-shrink-0'>
                <Image
                  src={badge.icon}
                  alt={`${badge.name} badge`}
                  width={80}
                  height={80}
                />
              </div>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}

export default Badges