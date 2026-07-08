import { Construction } from 'lucide-react'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <div className="flex flex-col items-center justify-center rounded-card bg-white py-24 text-neutral-500 shadow-card">
        <Construction size={40} className="mb-3 text-neutral-200" />
        <p className="text-sm">该模块在完整版中提供，Demo 聚焦核心风控闭环。</p>
      </div>
    </div>
  )
}
