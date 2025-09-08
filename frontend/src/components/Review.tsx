import React from 'react'

export default function Review({ response }: { response: any }) {
  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Thanks! Here are your answers</h2>
      {response.items.map((it: any) => (
        <div key={it.id} className="border rounded-xl p-3">
          <div className="text-xs text-gray-500">Question #{it.questionId}</div>
          <div className="font-medium">{it.answer}</div>
        </div>
      ))}
      <div className="text-sm text-gray-500">Submitted at {new Date(response.createdAt).toLocaleString()}</div>
    </div>
  )
}