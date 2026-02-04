'use client'
import { useEffect, useState, useMemo } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'
import DOMPurify from 'isomorphic-dompurify'

import { mergeTracking, type Tracking } from '../../components/lib/useTracking'

type Brand = {
  brand: { brand_logo?: string }
  content: { value?: string; our_link?: string }
}

export default function ProjectSection({
  brands,
  keyword,
  partnerId,
  ad_campaign_id,
}: {
  brands: Brand[]
  keyword: string
  partnerId: string
  ad_campaign_id: string
}) {
  const [track, setTrack] = useState<Tracking>({
    keyword,
    partnerId,
    ad_campaign_id,
  })
  useEffect(() => {
    setTrack(mergeTracking({ keyword, partnerId, ad_campaign_id }))
  }, [keyword, partnerId, ad_campaign_id])

  const displayed = (brands || []).filter(Boolean).slice(0, 4)

  const buildTrackedUrl = (base?: string) => {
    if (!base) return '#'
    const params = new URLSearchParams()
    if (track.keyword) params.set('keyword', track.keyword)
    if (track.partnerId) params.set('source', track.partnerId)
    if (track.ad_campaign_id) params.set('ad_campaign_id', track.ad_campaign_id)
    const qs = params.toString()
    return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base
  }
const trendsForCards = useMemo(() => {
  const pool = ['New 🔥', 'Popular', 'Hot', 'Mega Jackpot'];
  // лёгкий shuffle
  const pick = [...pool];
  return displayed.map((_, i) => [pick[i % pick.length]]);
}, [displayed.length]);

const anim = useMemo(() => {
  const pool = ['animate-blink', '', '', '']
    const pick = [...pool];
  return displayed.map((_, i) => [pick[i % pick.length]]);
}, [displayed.length]);

  return (
    <section id="projects">
      <SectionHeading title="// Best Offers" />

      <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
        {displayed.map((item, idx) => {
          if (!item?.brand?.brand_logo || !item?.content?.our_link) return null

          const sanitizedContent = DOMPurify.sanitize(String(item.content.value ?? ''))
          const imageSrc = `/brands/${item.brand.brand_logo}.png`
          const url = buildTrackedUrl(item.content.our_link)
          const name = item.brand.brand_logo

          return (
            <ProjectCard
              key={idx}
              anim={anim[idx]}
              trends={trendsForCards[idx]} 
              name={name}
              sanitizedContent={sanitizedContent}
              imageSrc={imageSrc}
              url={url}
            />
          )
        })}
      </div>
    </section>
  )
}
