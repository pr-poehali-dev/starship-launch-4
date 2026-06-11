import Icon from "@/components/ui/icon"

const presets = [
  {
    name: "Офисный ПК",
    price: "от 35 000 ₽",
    icon: "Monitor",
    tags: ["Intel Core i3", "8 ГБ ОЗУ", "SSD 256 ГБ"],
  },
  {
    name: "Игровой Mid",
    price: "от 90 000 ₽",
    icon: "Gamepad2",
    tags: ["Ryzen 5 7600X", "RTX 4060", "32 ГБ ОЗУ"],
  },
  {
    name: "Игровой High-End",
    price: "от 200 000 ₽",
    icon: "Cpu",
    tags: ["Core i9-14900K", "RTX 4090", "64 ГБ ОЗУ"],
  },
  {
    name: "Рабочая станция",
    price: "от 150 000 ₽",
    icon: "Server",
    tags: ["Ryzen 9 7950X", "128 ГБ ОЗУ", "NVMe 2 ТБ"],
  },
]

export function SafetySection() {
  return (
    <section id="safety" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Популярные конфигурации</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Готовые пресеты для быстрого старта — выберите подходящий и настройте под себя
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {presets.map((preset, index) => (
            <div
              key={index}
              className="glow-border rounded-xl p-6 bg-card hover:border-red-500/60 transition-all duration-300 cursor-pointer group slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Icon name={preset.icon} size={20} className="text-red-500" fallback="Monitor" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{preset.name}</p>
                  <p className="text-red-400 text-xs font-medium">{preset.price}</p>
                </div>
              </div>
              <div className="space-y-2">
                {preset.tags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-red-500/60 rounded-full"></div>
                    {tag}
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-xs text-red-400 hover:text-red-300 font-medium transition-colors text-left">
                Использовать пресет →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
