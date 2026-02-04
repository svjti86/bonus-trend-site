'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { mergeTracking, type Tracking } from '../lib/useTracking'

type Brand = {
  brand: { brand_logo?: string }
  content: { value?: string; our_link?: string }
}

type OfferModalProps = {
  brands?: Brand[]
  keyword?: string
  partnerId?: string
  ad_campaign_id?: string
  delay?: number // задержка перед показом в мс
  showOnce?: boolean // показывать только раз за сессию
}

export default function OfferModal({
  brands = [],
  keyword = '',
  partnerId = '',
  ad_campaign_id = '',
  delay = 1500,
  showOnce = true,
}: OfferModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [sanitized, setSanitized] = useState('')
  const [track, setTrack] = useState<Tracking>({ keyword, partnerId, ad_campaign_id })

  // Фильтруем бренды с логотипом и ссылкой
  const pool = (brands || []).filter((b) => b?.brand?.brand_logo && b?.content?.our_link)
  
  // Берем первый оффер из пула
  const current = pool.length > 0 ? pool[0] : null

  useEffect(() => {
    setTrack(mergeTracking({ keyword, partnerId, ad_campaign_id }))
  }, [keyword, partnerId, ad_campaign_id])

  // Санитизация HTML контента
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

  // Показ модалки с задержкой
  useEffect(() => {
    if (!current) return

    // Проверяем, показывали ли уже в этой сессии
    if (showOnce) {
      const shown = sessionStorage.getItem('offerModalShown')
      if (shown) return
    }

    const timer = setTimeout(() => {
      setIsOpen(true)
      // Небольшая задержка для анимации появления
      setTimeout(() => setIsVisible(true), 50)
      
      if (showOnce) {
        sessionStorage.setItem('offerModalShown', 'true')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [current, delay, showOnce])

  // Закрытие модалки
  const closeModal = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => setIsOpen(false), 300) // Ждем завершения анимации
  }, [])

  // Закрытие по клику на оверлей
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        closeModal()
      }
    },
    [closeModal]
  )

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeModal])

  // Формируем URL с tracking параметрами
  const buildTrackedUrl = (base?: string) => {
    if (!base) return '#'
    const params = new URLSearchParams()
    if (track.keyword) params.set('keyword', track.keyword)
    if (track.partnerId) params.set('source', track.partnerId)
    if (track.ad_campaign_id) params.set('ad_campaign_id', track.ad_campaign_id)
    const qs = params.toString()
    return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base
  }

  if (!isOpen || !current) return null

  const url = buildTrackedUrl(current?.content?.our_link)
  const brandImg = current?.brand?.brand_logo ? `/brands/${current.brand.brand_logo}.png` : null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-secondary relative w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-2xl transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Декоративный градиент сверху */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent h-1" />

        {/* Кнопка закрытия */}
        <button
          onClick={closeModal}
          className="text-primary-content hover:text-neutral hover:bg-border absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Контент модалки */}
        <div className="p-6 pt-4">
          {/* Заголовок */}
          <div className="mb-4 text-center">
            <span className="text-accent mb-1 block text-xs font-medium uppercase tracking-wider">
              🎁 Special Offer
            </span>
            <h2 id="modal-title" className="text-neutral text-xl font-bold">
              {current.brand.brand_logo}
            </h2>
          </div>

          {/* Картинка бренда */}
          {brandImg && (
            <Link href={url} target="_blank" onClick={closeModal}>
              <div className="bg-primary/50 hover:bg-primary/70 mx-auto mb-4 flex h-24 w-full max-w-[200px] items-center justify-center rounded-xl p-4 transition-colors">
                <Image
                  src={brandImg}
                  alt={current.brand.brand_logo || 'Brand'}
                  width={160}
                  height={80}
                  className="h-auto max-h-16 w-auto object-contain"
                />
              </div>
            </Link>
          )}

          {/* Описание оффера */}
          <div
            className="text-primary-content mb-5 text-center text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />

          {/* Кнопка CTA */}
          <Link
            href={url}
            target="_blank"
            onClick={closeModal}
            className="bg-accent hover:bg-accent/80 block w-full rounded-lg py-3 text-center text-sm font-semibold text-[#00071E] transition-colors"
          >
            Get Offer Now
          </Link>

          {/* Подпись */}
          <p className="text-primary-content/60 mt-3 text-center text-xs">
            Click to claim • Limited time offer
          </p>
        </div>

        {/* Декоративные элементы */}
        <div className="bg-accent/5 pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" />
        <div className="bg-accent/5 pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
