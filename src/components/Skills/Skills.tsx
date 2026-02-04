'use client'
import dynamic from 'next/dynamic'

const MarqueeWrapper = dynamic(() => import('../Marquee/MarqueeWrapper'), { ssr: false })
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { mergeTracking, type Tracking } from '../../components/lib/useTracking'

type Brand = {
  brand: { brand_logo?: string }
  content: { value?: string; our_link?: string }
}

export default function Skills({
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

  const displayed = (brands || []).filter(Boolean)

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
    <MarqueeWrapper className="from-primary to-primary via-marquee bg-linear-to-r">
      <div className="flex gap-8 lg:gap-24">
        {displayed.map((item, idx) => {
          if (!item?.brand?.brand_logo || !item?.content?.our_link) return null

          const imageSrc = `/brands/${item.brand.brand_logo}.png`
          const url = buildTrackedUrl(item.content.our_link)

          return (
            <span
              key={idx}
              className="font-inter text-primary-content flex items-center text-xs lg:text-base">
              <Link href={url} target="_blank">
                <Image width={150} height={75} src={imageSrc} alt={imageSrc} className="mx-2" />
              </Link>
            </span>
          )
        })}
      </div>
    </MarqueeWrapper>
  )
}
