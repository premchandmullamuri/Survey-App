import React from 'react'

export default function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current) / total) * 100)
  return (
    <div className="w-full mb-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2" style={{ width: pct + '%', background: 'black' }} />
      </div>
      <div className="text-xs mt-1 text-gray-600">{pct}% complete</div>
    </div>
  )
}