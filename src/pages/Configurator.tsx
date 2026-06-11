import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { fetchComponents, checkCompatibility, saveBuild, Component, CompatibilityResult } from '@/lib/api'

const STEPS = [
  { key: 'cpu', label: 'Процессор', icon: 'Cpu' },
  { key: 'motherboard', label: 'Материнская плата', icon: 'CircuitBoard' },
  { key: 'ram', label: 'Оперативная память', icon: 'MemoryStick' },
  { key: 'gpu', label: 'Видеокарта', icon: 'Monitor' },
  { key: 'storage', label: 'Накопитель', icon: 'HardDrive' },
  { key: 'psu', label: 'Блок питания', icon: 'Zap' },
  { key: 'case', label: 'Корпус', icon: 'Box' },
  { key: 'cooling', label: 'Охлаждение', icon: 'Wind' },
]

function ComponentCard({
  item, selected, onSelect,
}: { item: Component; selected: boolean; onSelect: () => void }) {
  const specs = item.specs
  const lines: string[] = []
  if (item.category === 'cpu') {
    if (specs.socket) lines.push(`${specs.socket}`)
    if (specs.cores) lines.push(`${specs.cores}C/${specs.threads}T`)
    if (specs.tdp) lines.push(`${specs.tdp}Вт TDP`)
  } else if (item.category === 'gpu') {
    if (specs.vram) lines.push(`${specs.vram}GB ${specs.vram_type || ''}`)
    if (specs.tdp) lines.push(`${specs.tdp}Вт`)
  } else if (item.category === 'motherboard') {
    if (specs.socket) lines.push(String(specs.socket))
    if (specs.chipset) lines.push(String(specs.chipset))
    if (specs.form_factor) lines.push(String(specs.form_factor))
  } else if (item.category === 'ram') {
    if (specs.memory_type) lines.push(String(specs.memory_type))
    if (specs.capacity_gb) lines.push(`${specs.capacity_gb}ГБ`)
    if (specs.speed_mhz) lines.push(`${specs.speed_mhz}МГц`)
  } else if (item.category === 'storage') {
    if (specs.capacity_gb) lines.push(`${specs.capacity_gb}ГБ`)
    if (specs.interface) lines.push(String(specs.interface))
  } else if (item.category === 'psu') {
    if (specs.wattage) lines.push(`${specs.wattage}Вт`)
    if (specs.efficiency) lines.push(String(specs.efficiency))
  } else if (item.category === 'case') {
    if (specs.max_gpu_length) lines.push(`GPU до ${specs.max_gpu_length}мм`)
    if (Array.isArray(specs.form_factor)) lines.push((specs.form_factor as string[]).join('/'))
  } else if (item.category === 'cooling') {
    if (specs.tdp_support) lines.push(`до ${specs.tdp_support}Вт`)
    if (specs.height_mm) lines.push(`${specs.height_mm}мм`)
  }

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        selected
          ? 'border-red-500 bg-red-500/10'
          : 'border-red-500/10 bg-zinc-900 hover:border-red-500/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">{item.brand}</p>
          <p className="text-sm font-medium text-white truncate">{item.name}</p>
          <p className="text-xs text-gray-400 mt-1">{lines.join(' · ')}</p>
        </div>
        <div className="ml-3 text-right flex-shrink-0">
          <p className="text-red-400 font-bold text-sm">{item.price.toLocaleString('ru-RU')} ₽</p>
          {selected && <Icon name="CheckCircle2" size={16} className="text-red-500 mt-1 ml-auto" />}
        </div>
      </div>
    </button>
  )
}

export default function Configurator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [selectedDetails, setSelectedDetails] = useState<Record<string, Component>>({})
  const [items, setItems] = useState<Component[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [compat, setCompat] = useState<CompatibilityResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedToken, setSavedToken] = useState('')
  const [buildTitle, setBuildTitle] = useState('Моя сборка')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const currentStep = STEPS[step]

  // Load draft from catalog
  useEffect(() => {
    const stored = localStorage.getItem('pcbuilder_draft')
    if (stored) {
      const draft: Record<string, number> = JSON.parse(stored)
      setSelected(draft)
      localStorage.removeItem('pcbuilder_draft')
    }
  }, [])

  // Load components for current step
  useEffect(() => {
    setLoading(true)
    setSearch('')
    fetchComponents({ category: currentStep.key, limit: 100 }).then(data => {
      setItems(data.items)
      setLoading(false)
    })
  }, [currentStep.key])

  // Filter by search
  const filtered = search
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.brand.toLowerCase().includes(search.toLowerCase()))
    : items

  // Auto check compatibility when selected changes
  const runCheck = useCallback(async () => {
    if (Object.keys(selected).length < 2) { setCompat(null); return }
    const result = await checkCompatibility(selected)
    setCompat(result)
    // Update details cache
    const details: Record<string, Component> = { ...selectedDetails }
    for (const [cat, id] of Object.entries(selected)) {
      if (!details[cat] || details[cat].id !== id) {
        const found = items.find(i => i.id === id)
        if (found) details[cat] = found
      }
    }
    setSelectedDetails(details)
  }, [selected, items]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { runCheck() }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPrice = Object.values(selectedDetails).reduce((sum, c) => sum + c.price, 0)

  const handleSelect = (item: Component) => {
    setSelected(prev => ({ ...prev, [item.category]: item.id }))
    setSelectedDetails(prev => ({ ...prev, [item.category]: item }))
  }

  const handleRemove = (cat: string) => {
    setSelected(prev => { const n = { ...prev }; delete n[cat]; return n })
    setSelectedDetails(prev => { const n = { ...prev }; delete n[cat]; return n })
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveBuild({ title: buildTitle, component_ids: selected })
    setSavedToken(result.share_token)
    setSaving(false)
    setShowSaveDialog(false)
  }

  const compatColor = compat?.status === 'ok' ? 'text-green-400' : compat?.status === 'conflict' ? 'text-red-400' : 'text-yellow-400'
  const compatIcon = compat?.status === 'ok' ? 'CheckCircle2' : compat?.status === 'conflict' ? 'XCircle' : 'AlertTriangle'
  const compatLabel = compat?.status === 'ok' ? 'Совместимо' : compat?.status === 'conflict' ? 'Конфликт' : 'Предупреждение'

  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-orbitron text-2xl font-bold text-white">Конфигуратор сборки</h1>
          {compat && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${compatColor}`}>
              <Icon name={compatIcon} size={16} fallback="Info" />
              {compatLabel}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Steps + Component Picker */}
          <div className="lg:col-span-2 space-y-4">
            {/* Steps nav */}
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i === step
                      ? 'bg-red-500 text-white'
                      : selected[s.key]
                      ? 'bg-zinc-800 text-green-400 border border-green-500/30'
                      : 'bg-zinc-900 text-gray-400 hover:text-white border border-red-500/10'
                  }`}
                >
                  <Icon name={s.icon} size={12} fallback="Box" />
                  {s.label}
                  {selected[s.key] && i !== step && (
                    <Icon name="Check" size={10} className="text-green-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Component picker */}
            <div className="bg-zinc-950 border border-red-500/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon name={currentStep.icon} size={18} className="text-red-500" fallback="Box" />
                  <h2 className="text-white font-semibold">{currentStep.label}</h2>
                  {selected[currentStep.key] && selectedDetails[currentStep.key] && (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      {selectedDetails[currentStep.key].name}
                    </Badge>
                  )}
                </div>
                {selected[currentStep.key] && (
                  <button onClick={() => handleRemove(currentStep.key)} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                    Убрать
                  </button>
                )}
              </div>

              <div className="relative mb-3">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder={`Поиск ${currentStep.label.toLowerCase()}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 bg-zinc-900 border-red-500/20 text-white placeholder:text-gray-500 text-sm h-9"
                />
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filtered.map(item => (
                    <ComponentCard
                      key={item.id}
                      item={item}
                      selected={selected[item.category] === item.id}
                      onSelect={() => handleSelect(item)}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Ничего не найдено</p>
                  )}
                </div>
              )}

              {/* Step navigation */}
              <div className="flex justify-between mt-4 pt-4 border-t border-zinc-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="border-red-500/20 text-gray-400 hover:text-white bg-transparent"
                >
                  <Icon name="ChevronLeft" size={14} /> Назад
                </Button>
                <Button
                  size="sm"
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                  disabled={step === STEPS.length - 1}
                  className="bg-red-500 hover:bg-red-600 text-white border-0"
                >
                  Далее <Icon name="ChevronRight" size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Build summary */}
          <div className="space-y-4">
            {/* Selected components */}
            <div className="bg-zinc-950 border border-red-500/10 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="List" size={16} className="text-red-500" />
                Текущая сборка
              </h3>
              <div className="space-y-2">
                {STEPS.map(s => {
                  const c = selectedDetails[s.key]
                  return (
                    <div key={s.key} className="flex items-center gap-2 text-sm">
                      <Icon name={s.icon} size={14} className={c ? 'text-green-400' : 'text-gray-600'} fallback="Box" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 text-xs">{s.label}</p>
                        {c ? (
                          <p className="text-white text-xs truncate">{c.brand} {c.name}</p>
                        ) : (
                          <p className="text-gray-600 text-xs">Не выбрано</p>
                        )}
                      </div>
                      {c && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {c.price.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
                <span className="text-gray-400 text-sm">Итого</span>
                <span className="text-white font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Compatibility */}
            {compat && compat.issues.length > 0 && (
              <div className="bg-zinc-950 border border-red-500/10 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Icon name="ShieldAlert" size={16} className="text-red-500" fallback="AlertTriangle" />
                  Совместимость
                </h3>
                <div className="space-y-2">
                  {compat.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-xs ${
                        issue.severity === 'error'
                          ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                          : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <Icon
                          name={issue.severity === 'error' ? 'XCircle' : 'AlertTriangle'}
                          size={12}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <span>{issue.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {compat.total_tdp > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Суммарное потребление: ~{compat.total_tdp}Вт</p>
                )}
              </div>
            )}

            {compat?.status === 'ok' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-green-400">
                  <Icon name="CheckCircle2" size={18} />
                  <span className="font-semibold">Все компоненты совместимы</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {savedToken ? (
                <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-3">
                  <p className="text-green-400 text-xs font-medium mb-1">Сборка сохранена!</p>
                  <p className="text-gray-400 text-xs break-all">Токен: {savedToken}</p>
                </div>
              ) : (
                <>
                  {!showSaveDialog ? (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white border-0"
                      disabled={Object.keys(selected).length === 0}
                      onClick={() => setShowSaveDialog(true)}
                    >
                      <Icon name="Save" size={16} /> Сохранить сборку
                    </Button>
                  ) : (
                    <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-3 space-y-2">
                      <Input
                        value={buildTitle}
                        onChange={e => setBuildTitle(e.target.value)}
                        placeholder="Название сборки"
                        className="bg-zinc-800 border-red-500/20 text-white text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
                        >
                          {saving ? 'Сохраняю...' : 'Сохранить'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowSaveDialog(false)}
                          className="border-red-500/20 text-gray-400 bg-transparent"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
              <Button
                variant="outline"
                className="w-full border-red-500/20 text-gray-400 hover:text-white bg-transparent"
                onClick={() => navigate('/catalog')}
              >
                <Icon name="LayoutGrid" size={16} /> Перейти в каталог
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
