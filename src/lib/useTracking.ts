export type Tracking = {
  keyword?: string
  partnerId?: string
  ad_campaign_id?: string
}

export function mergeTracking(tracking: Tracking): Tracking {
  // На клиенте можем получить параметры из URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return {
      keyword: tracking.keyword || params.get('keyword') || '',
      partnerId: tracking.partnerId || params.get('source') || params.get('partnerId') || '',
      ad_campaign_id: tracking.ad_campaign_id || params.get('ad_campaign_id') || '',
    }
  }
  return tracking
}

export function useTracking(initial: Tracking = {}): Tracking {
  return mergeTracking(initial)
}
