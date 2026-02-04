'use client'
import { useEffect, useState } from 'react'

import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'
import DOMPurify from 'isomorphic-dompurify'

import { mergeTracking, type Tracking } from '../../components/lib/useTracking'

type Brand = {
  brand: { brand_logo?: string }
  content: { value?: string; our_link?: string }
}

export default function ServiceSection({
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

  const displayed = (brands || []).filter(Boolean).slice(0, 6)

  const buildTrackedUrl = (base?: string) => {
    if (!base) return '#'
    const params = new URLSearchParams()
    if (track.keyword) params.set('keyword', track.keyword)
    if (track.partnerId) params.set('source', track.partnerId)
    if (track.ad_campaign_id) params.set('ad_campaign_id', track.ad_campaign_id)
    const qs = params.toString()
    return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base
  }

  return (
    <section id="services" className="my-14">
      <SectionHeading
        title="// Trusted Offers"

      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {displayed.map((item, idx) => {
          if (!item?.brand?.brand_logo || !item?.content?.our_link) return null

          const sanitizedContent = DOMPurify.sanitize(String(item.content.value ?? ''))
          const imageSrc = `/brands/${item.brand.brand_logo}.png`
          const url = buildTrackedUrl(item.content.our_link)
          const name = item.brand.brand_logo

          return (
            <ServiceCard
              key={idx}
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
