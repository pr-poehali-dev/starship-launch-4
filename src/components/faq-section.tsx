import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Как проверяется совместимость компонентов?",
      answer:
        "Система анализирует ключевые параметры: сокет CPU и поддержку платой, тип и частоту ОЗУ, суммарный TDP и мощность БП, габариты видеокарты и корпуса, версию PCIe и количество слотов M.2. Конфликты подсвечиваются сразу с пояснением причины.",
    },
    {
      question: "Нужна ли регистрация для создания сборки?",
      answer:
        "Нет, создать и проверить сборку можно без регистрации. Аккаунт нужен для сохранения сборок в личном кабинете, доступа к истории и отслеживания цен на компоненты.",
    },
    {
      question: "Можно ли импортировать уже существующую сборку?",
      answer:
        "Да, в разделе «Проверка совместимости» есть ручной ввод и импорт списка комплектующих. Сервис мгновенно проведёт диагностику и выдаст подробный отчёт.",
    },
    {
      question: "Как экспортировать спецификацию сборки?",
      answer:
        "Из конфигуратора доступен экспорт в PDF, Excel и текстовый файл. Также можно получить публичную ссылку на сборку — она открывается без авторизации.",
    },
    {
      question: "Откуда берутся цены на компоненты?",
      answer:
        "Цены обновляются регулярно из актуальных источников. В настройках аккаунта можно выбрать валюту и регион, а также настроить уведомления о снижении цен на компоненты из ваших сборок.",
    },
    {
      question: "Есть ли оценка производительности сборки?",
      answer:
        "Да, в отчёте по сборке отображается ориентировочная оценка производительности, выявление узких мест и график загрузки CPU/GPU для типичных сценариев использования.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на популярные вопросы о работе конфигуратора и проверке совместимости
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
