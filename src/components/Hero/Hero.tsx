'use client'
import useRoleSwitcher from '@/hooks/useRoleSwitcher'
import useRotatingAnimation from '@/hooks/useRotatingAnimation'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { mergeTracking, type Tracking } from '../../components/lib/useTracking'
import heroImg from '../../assets/images/hero.png'
import Ellipse from './Ellipse'

type Brand = {
  brand: { brand_logo?: string }
  content: { value?: string; our_link?: string }
}

export default function Hero({
  brands = [],
  keyword,
  partnerId,
  ad_campaign_id,
}: {
  brands: Brand[]
  keyword: string
  partnerId: string
  ad_campaign_id: string
}) {
  const [track, setTrack] = useState<Tracking>({ keyword, partnerId, ad_campaign_id })

  useEffect(() => {
    setTrack(mergeTracking({ keyword, partnerId, ad_campaign_id }))
  }, [keyword, partnerId, ad_campaign_id])

  const pool = useMemo(
    () => (brands || []).filter((b) => b?.brand?.brand_logo && b?.content?.our_link).slice(0, 3),
    [brands],
  )

  const roles = ['FAST PAYOUTS', 'NEW BONUSES', 'BIG WINS'] as const
  const role = useRoleSwitcher({ roles })
  const roleIdx = useMemo(() => {
    const i = roles.indexOf(role as any)
    return i >= 0 ? i : 0
  }, [role])

  const current = pool.length ? pool[roleIdx % pool.length] : null

  const buildTrackedUrl = (base?: string) => {
    if (!base) return '#'
    const params = new URLSearchParams()
    if (track.keyword) params.set('keyword', track.keyword)
    if (track.partnerId) params.set('source', track.partnerId)
    if (track.ad_campaign_id) params.set('ad_campaign_id', track.ad_campaign_id)
    const qs = params.toString()
    return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base
  }

  const ellipseRef = useRotatingAnimation()

  // вместо прямого DOMPurify — стейт + динамический импорт
  const [sanitized, setSanitized] = useState('')

  useEffect(() => {
    const value = String(current?.content?.value ?? '')

    if (!value) {
      setSanitized('')
      return
    }

    let cancelled = false

    ;(async () => {
      const { default: DOMPurify } = await import('isomorphic-dompurify')
      if (!cancelled) {
        setSanitized(DOMPurify.sanitize(value))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [current])

  const url = buildTrackedUrl(current?.content?.our_link)
  const brandImg = current?.brand?.brand_logo ? `/brands/${current.brand.brand_logo}.png` : null

  return (
    <section className="bg-primary bg-small-glow bg-small-glow-position md:bg-large-glow-position lg:bg-large-glow min-h-[calc(dvh-4rem)] bg-no-repeat">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-4 px-4 pt-12 pb-10 md:grid-cols-2 lg:p-4">
        <div className="flex min-h-48 flex-col justify-between lg:min-h-56 lg:max-w-[33.75rem]">
          <h1>
            <span className="text-neutral mb-2 block text-3xl font-bold">Сhoice of the day by</span>
            <span className="text-accent block text-[1.75rem] font-bold">{role}</span>
          </h1>

          {current && (
            <>
              <h2 className="text-neutral mt-3">{current.brand.brand_logo}</h2>
              <p
                className="text-neutral/80 mt-2"
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
              {brandImg && (
                <Link href={url} target="_blank">
                  <div className="mt-3 flex items-center gap-3">
                    <Image src={brandImg} alt="Brand" width={150} height={75} />
                  </div>
                </Link>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Link
                  href={url}
                  target="_blank"
                  aria-label="Go to offer"
                  className="bg-accent min-w-32 cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium text-[#00071E]">
                  Get Offer
                </Link>
              </div>
            </>
          )}
        </div>
        {current && (
          <Link href={url} target="_blank">
            <div className="lg:minh-[35rem] flex min-h-[18.75rem] items-center justify-center">
              <div className="text-accent relative size-56 sm:size-60 md:size-[20rem] lg:size-[25.75rem]">
                <Image
                  src={heroImg}
                  fill
                  priority
                  sizes="(min-width: 1024px) 25.75rem, (min-width: 768px) 20rem, (min-width: 640px) 15rem, 14rem"
                  alt="John Doe - Full Stack Developer"
                  className="object-contain p-7"
                />
                <Ellipse
                  ref={ellipseRef}
                  className="absolute top-0 left-0 size-56 transition-transform duration-500 ease-out sm:size-60 md:size-[20rem] lg:size-[25.75rem]"
                />
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
