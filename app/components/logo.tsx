import Image from 'next/image'

export const Logo = () => {
 return (
   <div className="flex items-center">
     <Image 
       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5440550132178348011.jpg-RMOfwRFYZFT27b8UJaLpLB8CZdcF32.jpeg"
       alt="ДЕЛЬТА"
       width={120}
       height={40}
       className="h-auto w-[120px]"
     />
   </div>
 )
}
