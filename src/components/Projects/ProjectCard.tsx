import { Project } from '@/lib/types'
import Image from 'next/image'

import Link from 'next/link'

const IconText: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <li className="flex gap-2">
    <Image src={icon} alt={text} className="size-[18px] md:size-5" />
    <span className="text-neutral text-sm">{text}</span>
  </li>
)

interface ProjectCardProps {
  anim?: string
  trends: string
  name: string
  sanitizedContent: string
  imageSrc: string
  url: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  anim,
  trends,
  name,
  sanitizedContent,
  imageSrc,
  url,
}) => {
  return (
    <Link href={url} target="_blank">
      <div className="bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
              <h3 className="text-secondary-content text-lg font-medium md:font-semibold">
                {name}
              </h3>

              <span
                className={`${anim} text-tag h-7 w-fit rounded-md bg-[#FFFFFF1A] p-1 text-sm backdrop-blur-[80px]`}>
                {trends}
              </span>
            </div>
            {/* <ul className="mt-3 flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
            {(visitors || numberOfSales) && (
              <IconText text={(visitors || numberOfSales)?.toString() || ''} icon={Likes} />
            )}
            {siteAge && <IconText text={siteAge} icon={Timer} />}
            {earned && <IconText text={earned} icon={Earning} />}
            {(ratings || githubStars) && (
              <IconText text={(ratings || githubStars)?.toString() || ''} icon={Star} />
            )}
          </ul> */}
          </div>
          <figure className="flex justify-end overflow-hidden">
            <Image
              src={imageSrc}
              width={150}
              height={75}
              alt="Project Cover"
              className="h-[80px] w-[150px] rounded-md object-cover shadow-[0px_1.66px_3.74px_-1.25px_#18274B1F]"
            />
          </figure>
        </div>

        <div>
          <div className="bg-primary text-primary-content my-4 h-[100px] overflow-scroll rounded-2xl px-4 py-2">
            <p
              className="text-[18px] font-normal"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
          <div className="flex gap-5">
            <p className="text-accent flex cursor-pointer gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base">
              <span>Get Bonus</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
