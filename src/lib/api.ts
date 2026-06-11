const COMPONENTS_URL = 'https://functions.poehali.dev/ac9b28ad-ea30-4473-adb6-cd4563ab32e6'
const BUILDS_URL = 'https://functions.poehali.dev/c2827063-7dc6-4e95-bb6f-016361e23011'

export interface Component {
  id: number
  category: string
  brand: string
  name: string
  price: number
  image_url: string | null
  specs: Record<string, unknown>
}

export interface CompatibilityIssue {
  type: string
  severity: 'error' | 'warning'
  message: string
  components: string[]
}

export interface CompatibilityResult {
  status: 'ok' | 'conflict' | 'warning'
  issues: CompatibilityIssue[]
  total_tdp: number
}

export async function fetchComponents(params: {
  category?: string
  brand?: string
  search?: string
  limit?: number
  offset?: number
} = {}): Promise<{ items: Component[]; total: number; brands: string[] }> {
  const qs = new URLSearchParams()
  if (params.category) qs.set('category', params.category)
  if (params.brand) qs.set('brand', params.brand)
  if (params.search) qs.set('search', params.search)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  const res = await fetch(`${COMPONENTS_URL}?${qs}`)
  return res.json()
}

export async function checkCompatibility(
  componentIds: Record<string, number>
): Promise<CompatibilityResult> {
  const res = await fetch(BUILDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'check', component_ids: componentIds }),
  })
  return res.json()
}

export async function saveBuild(payload: {
  title: string
  component_ids: Record<string, number>
}): Promise<{ id: number; share_token: string; compatibility: CompatibilityResult; total_price: number }> {
  const res = await fetch(BUILDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
