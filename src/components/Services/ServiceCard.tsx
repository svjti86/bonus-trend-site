// src/components/Services/ServiceCard.tsx
import Image from 'next/image'
import Link from 'next/link'
interface ServiceCardTypes {
  name: string
  sanitizedContent: string
  imageSrc: string
  url: string
  anim?: string
  trend?: string
}

const ServiceCard: React.FC<ServiceCardTypes> = ({ name, sanitizedContent, imageSrc, url }) => {
  return (
    <Link href={url} target="_blank">
      <div className="bg-secondary border-border flex flex-col items-center rounded-[14px] border p-5">
        <Image src={imageSrc} alt={name} width={56} height={56} className="my-1" />
        <h5 className="text-accent mt-2 mb-5 text-center text-base font-semibold">{name}</h5>
        <div className="bg-primary rounded-2xl p-4">
          <p className="text-primary-content text-center text-sm font-normal">{sanitizedContent}</p>
        </div>
      </div>
    </Link>
  )
}

export default ServiceCard
