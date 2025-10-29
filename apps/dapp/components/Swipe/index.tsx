import SwipeButton from '../Buttons/SwipeButton'
interface SwipeFooterProps {
  onSwipe: (amount: string) => void
  isLoading?: boolean
  disabled?: boolean
  amount?: string
}

const SwipeFooter = ({ 
  onSwipe, 
  isLoading = false, 
  disabled = false,
  amount = '1' 
}: SwipeFooterProps) => {

  return (
    <div className="fixed bottom-0 left-0 w-full h-[116px] xs:h-[126px] flex flex-col">
      <span className="w-full h-[1px] bg-gradient-to-r from-[#7D0BF4] via-[#1A26E7] to-[#0D4BEF]"></span>
      <span className="bg-theme-2 h-full flex justify-center items-start">
        <div className="mt-[15px] mx-[24px] mb-[52px] w-full h-full">
          <SwipeButton 
            onConfirm={() => onSwipe(amount)}
            isLoading={isLoading}
            disabled={disabled}
          />
        </div>
      </span>
    </div>
  )
}

export default SwipeFooter

