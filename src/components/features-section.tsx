import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const features = [
  {
    title: "Проверка совместимости",
    description: "Автоматический анализ совместимости сокетов, чипсетов, типов ОЗУ и габаритов — конфликты подсвечиваются мгновенно.",
    icon: "ShieldCheck",
    badge: "Авто",
  },
  {
    title: "Каталог комплектующих",
    description: "Полная база процессоров, видеокарт, материнских плат, ОЗУ, накопителей, БП, корпусов и систем охлаждения.",
    icon: "Database",
    badge: "База",
  },
  {
    title: "Пошаговый конфигуратор",
    description: "Интуитивный интерфейс сборки: выбирайте компоненты по шагам или в свободном режиме с подсказками на каждом этапе.",
    icon: "Settings2",
    badge: "Удобно",
  },
  {
    title: "Расчёт мощности",
    description: "Суммарное энергопотребление сборки сравнивается с мощностью БП — никаких сюрпризов при запуске.",
    icon: "Zap",
    badge: "TDP",
  },
  {
    title: "Сохранение и экспорт",
    description: "Сохраняйте сборки в личном кабинете, делитесь ссылкой или экспортируйте спецификацию в PDF и Excel.",
    icon: "Share2",
    badge: "Экспорт",
  },
  {
    title: "Отчёты и рекомендации",
    description: "Детальный отчёт по совместимости, выявленные конфликты и конкретные рекомендации по замене компонентов.",
    icon: "FileText",
    badge: "Отчёт",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё для идеальной сборки</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Умный конфигуратор, который проверяет совместимость в реальном времени и не даёт ошибиться с выбором
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name={feature.icon} size={32} className="text-red-500" fallback="Star" />
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
