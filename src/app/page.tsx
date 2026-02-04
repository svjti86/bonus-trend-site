// app/page.tsx

import ContactSection from '@/components/Contact/ContactSection'
import OfferModal from '@/components/OfferModal'

import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import Skills from '@/components/Skills/Skills'
// import Frame from '@/components/Frame'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { getUserCountry } from '../lib/geo'
import { CookieWriter } from '@/components/CookieWriter'

export const metadata: Metadata = {
  title: 'Bonus trend',
}

type BrandPair = {
  brand: { brand_logo: string; casino_brand: string; id?: string | number }
  content: { value: string; our_link: string; geo: string }
}

const ALLOWED = ['partner1039', 'partner1043', 'partner1044', 'partner1045', 'partnerCLD']

export default async function Home({
  searchParams,
}: {
  searchParams: { partner?: string; keyword?: string; ad_campaign_id?: string }
}) {
  const cookieStore = await cookies()

  // Приоритет: URL → cookies → fallback
  const urlPartner =
    searchParams.partner && ALLOWED.includes(searchParams.partner) ? searchParams.partner : null

  const partner_id = urlPartner || cookieStore.get('partnerId')?.value || 'partner1039'
  const keyword = searchParams.keyword || cookieStore.get('rawKeyword')?.value || ''
  const ad_campaign_id =
    searchParams.ad_campaign_id || cookieStore.get('ad_campaign_id')?.value || ''

  console.log('👤 Partner:', partner_id, urlPartner ? '(from URL)' : '(from cookies)')

  const geo = await getUserCountry()
  console.log('🌍 GEO:', geo)

  const buildUrl = (category: string) =>
    `https://born.topbon.us/end/fetch/brand_fetcher.php?partner_id=${encodeURIComponent(
      partner_id,
    )}&geo=${geo}&category=${category}`

  const [dataHottest, dataPopular, dataVip] = await Promise.all([
    fetch(buildUrl('Hottest'), { next: { revalidate: 300 } }).then((r) => {
      if (!r.ok) throw new Error(`fetch Hottest failed: ${r.status}`)
      return r.json()
    }),
    fetch(buildUrl('Popular'), { next: { revalidate: 300 } }).then((r) => {
      if (!r.ok) throw new Error(`fetch Popular failed: ${r.status}`)
      return r.json()
    }),
    fetch(buildUrl('Vip'), { next: { revalidate: 300 } }).then((r) => {
      if (!r.ok) throw new Error(`fetch Vip failed: ${r.status}`)
      return r.json()
    }),
  ])

  const processedBrandsHottest = processDataNoGeo(dataHottest, partner_id, geo)
  const processedBrandsPopular = processDataNoGeo(dataPopular, partner_id, geo)
  const processedBrandsVip = processDataNoGeo(dataVip, partner_id, geo)

  return (
    <main>
      <OfferModal
        brands={processedBrandsVip}
        keyword={keyword}
        partnerId={partner_id}
        ad_campaign_id={ad_campaign_id}
        delay={1500}
        showOnce={true}
      />
      <CookieWriter />
      {/* <Frame
        brands={processedBrandsVip}
        keyword={keyword}
        partnerId={partner_id}
        adCampaignId={ad_campaign_id}
      /> */}
      <Hero
        brands={processedBrandsVip}
        keyword={keyword}
        partnerId={partner_id}
        ad_campaign_id={ad_campaign_id}
      />
      <Skills
        brands={processedBrandsPopular}
        keyword={keyword}
        partnerId={partner_id}
        ad_campaign_id={ad_campaign_id}
      />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSection
          brands={processedBrandsHottest}
          keyword={keyword}
          partnerId={partner_id}
          ad_campaign_id={ad_campaign_id}
        />
        <ServiceSection
          brands={processedBrandsHottest}
          keyword={keyword}
          partnerId={partner_id}
          ad_campaign_id={ad_campaign_id}
        />
        <ContactSection />
      </div>
    </main>
  )
}

// Helpers без изменений
type LangContent = { geo?: string; value?: string; our_link?: string }
type LangBlock = {
  partner_id?: string
  our_link?: string
  content?: LangContent[]
}

function pickLangBlock(languages: unknown, partnerId: string): LangBlock | null {
  const arr: LangBlock[] = Array.isArray(languages)
    ? (languages as LangBlock[])
    : typeof languages === 'string'
      ? JSON.parse(languages || '[]')
      : []
  if (!arr.length) return null
  return (
    arr.find((l) => (l.partner_id || '').toLowerCase() === partnerId.toLowerCase()) ||
    arr.find((l) => (l.partner_id || '').toLowerCase() === 'partner1039') ||
    arr[0] ||
    null
  )
}

function pickContent(block: LangBlock | null, geo: string): LangContent | null {
  if (!block?.content?.length) return null
  const G = geo.toUpperCase()
  return (
    block.content.find((c) => (c.geo || '').toUpperCase() === G) ||
    block.content.find((c) => (c.geo || '').toUpperCase() === 'ALL') ||
    block.content[0] ||
    null
  )
}

function processDataNoGeo(data: any[], partner_id: string, geo: string = 'CA'): BrandPair[] {
  if (!Array.isArray(data)) return []
  const shuffled = [...data]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
    .map((brand: any) => {
      const block = pickLangBlock(brand?.languages, partner_id)
      if (!block) return null
      const c = pickContent(block, geo)
      if (!c) return null
      const our_link = String(c.our_link || block.our_link || '')
      if (!our_link) return null
      return {
        brand: {
          brand_logo: String(brand?.brand_logo ?? ''),
          casino_brand: String(brand?.casino_brand ?? ''),
        },
        content: { value: String(c.value ?? ''), our_link },
      }
    })
    .filter(Boolean) as BrandPair[]
}
