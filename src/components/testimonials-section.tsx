import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алексей Смирнов",
    role: "Энтузиаст, собрал 3 ПК",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Наконец-то сервис, который честно говорит о несовместимости! Сэкономил на неправильной материнской плате — конфигуратор сразу предупредил.",
  },
  {
    name: "Мария Петрова",
    role: "Контент-мейкер, игровой стриминг",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Собирала первый игровой ПК — страшно было запутаться в характеристиках. PCBuilder всё разложил по полочкам, даже объяснил зачем нужен конкретный чипсет.",
  },
  {
    name: "Дмитрий Власов",
    role: "Системный администратор",
    avatar: "/professional-woman-scientist.png",
    content:
      "Использую для быстрой проверки конфигураций перед закупками. Экспорт в Excel экономит кучу времени при оформлении заявок.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Что говорят пользователи</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Реальные отзывы тех, кто собирал ПК с PCBuilder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
