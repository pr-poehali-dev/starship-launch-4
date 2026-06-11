import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'
import { fetchComponents, Component } from '@/lib/api'

const CATEGORIES = [
  { value: '', label: 'Все', icon: 'LayoutGrid' },
  { value: 'cpu', label: 'Процессор', icon: 'Cpu' },
  { value: 'gpu', label: 'Видеокарта', icon: 'Monitor' },
  { value: 'motherboard', label: 'Материнская плата', icon: 'CircuitBoard' },
  { value: 'ram', label: 'Оперативная память', icon: 'MemoryStick' },
  { value: 'storage', label: 'Накопитель', icon: 'HardDrive' },
  { value: 'psu', label: 'Блок питания', icon: 'Zap' },
  { value: 'case', label: 'Корпус', icon: 'Box' },
  { value: 'cooling', label: 'Охлаждение', icon: 'Wind' },
]

const CATEGORY_LABELS: Record<string, string> = {
  cpu: 'Процессор', gpu: 'Видеокарта', motherboard: 'Материнская плата',
  ram: 'ОЗУ', storage: 'Накопитель', psu: 'БП', case: 'Корпус', cooling: 'Охлаждение',
}

function specsPreview(c: Component): string[] {
  const s = c.specs
  const lines: string[] = []
  if (c.category === 'cpu') {
    if (s.socket) lines.push(`Сокет: ${s.socket}`)
    if (s.cores) lines.push(`${s.cores} ядер / ${s.threads} потоков`)
    if (s.tdp) lines.push(`TDP: ${s.tdp}Вт`)
  } else if (c.category === 'gpu') {
    if (s.vram) lines.push(`VRAM: ${s.vram} ГБ ${s.vram_type || ''}`)
    if (s.tdp) lines.push(`TDP: ${s.tdp}Вт`)
    if (s.length_mm) lines.push(`Длина: ${s.length_mm}мм`)
  } else if (c.category === 'motherboard') {
    if (s.socket) lines.push(`Сокет: ${s.socket}`)
    if (s.chipset) lines.push(`Чипсет: ${s.chipset}`)
    if (s.form_factor) lines.push(`Форм-фактор: ${s.form_factor}`)
  } else if (c.category === 'ram') {
    if (s.memory_type) lines.push(`Тип: ${s.memory_type}`)
    if (s.capacity_gb) lines.push(`Объём: ${s.capacity_gb} ГБ`)
    if (s.speed_mhz) lines.push(`Частота: ${s.speed_mhz} МГц`)
  } else if (c.category === 'storage') {
    if (s.type) lines.push(String(s.type))
    if (s.capacity_gb) lines.push(`${s.capacity_gb} ГБ`)
    if (s.interface) lines.push(String(s.interface))
  } else if (c.category === 'psu') {
    if (s.wattage) lines.push(`${s.wattage}Вт`)
    if (s.efficiency) lines.push(String(s.efficiency))
    lines.push(s.modular ? 'Модульный' : 'Немодульный')
  } else if (c.category === 'case') {
    if (Array.isArray(s.form_factor)) lines.push(`Форм-факторы: ${(s.form_factor as string[]).join(', ')}`)
    if (s.max_gpu_length) lines.push(`Макс. GPU: ${s.max_gpu_length}мм`)
  } else if (c.category === 'cooling') {
    if (s.type) lines.push(String(s.type) === 'air' ? 'Воздушное' : 'Жидкостное (AIO)')
    if (s.tdp_support) lines.push(`До ${s.tdp_support}Вт TDP`)
  }
  return lines
}

export default function Catalog() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Component[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchComponents({ category: category || undefined, search: search || undefined, limit: 60 })
    setItems(data.items)
    setTotal(data.total)
    setLoading(false)
  }, [category, search])

  useEffect(() => { load() }, [load])

  const addToBuild = (c: Component) => {
    const stored = localStorage.getItem('pcbuilder_draft')
    const draft: Record<string, number> = stored ? JSON.parse(stored) : {}
    draft[c.category] = c.id
    localStorage.setItem('pcbuilder_draft', JSON.stringify(draft))
    navigate('/configurator')
  }

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl font-bold text-white mb-2">Каталог комплектующих</h1>
          <p className="text-gray-400">{total} позиций в базе</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по названию или бренду..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900 border-red-500/20 text-white placeholder:text-gray-500 focus:border-red-500/60"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 border border-red-500/10'
              }`}
            >
              <Icon name={cat.icon} size={14} fallback="Box" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-40" fallback="Search" />
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-red-500/10 rounded-xl p-4 hover:border-red-500/40 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs bg-zinc-800 text-red-400 border-0">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.brand}</span>
                </div>
                <p className="font-semibold text-white text-sm mb-3 leading-tight">{item.name}</p>
                <div className="flex-1 space-y-1 mb-4">
                  {specsPreview(item).map((line, i) => (
                    <p key={i} className="text-xs text-gray-400">{line}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-red-400 font-bold text-sm">{item.price.toLocaleString('ru-RU')} ₽</span>
                  <Button
                    size="sm"
                    onClick={() => addToBuild(item)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs h-7 px-3 border-0"
                  >
                    В сборку
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
