import { Sparkles } from 'lucide-react'

export default function AIInsightCard({ text }: { text: string }) {
  return (
    <div className="rounded-card bg-gradient-to-br from-brand/10 to-info/10 p-4">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
          <Sparkles size={13} />
        </span>
        <span className="text-sm font-bold text-brand-dark">AI 每日解读</span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-900">{text}</p>
    </div>
  )
}
