import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import Progress from './Progress'

type Question = {
  id: number
  order: number
  title: string
  description?: string
  type: 'TEXT'|'NUMBER'
  required: boolean
  options: string[]
}

export default function Survey({ onSubmitted }: { onSubmitted: (resp: any) => void }) {
  const [survey, setSurvey] = useState<any>(null)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number,string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const list = await api.listSurveys()
      const firstId = list.surveys[0].id
      const s = await api.getSurvey(firstId)
      setSurvey(s.survey)
      setLoading(false)
    })()
  }, [])

  const q: Question | null = useMemo(() => survey?.questions?.[idx] ?? null, [survey, idx])

  if (loading) return <div className="card">Loading survey…</div>
  if (!survey) return <div className="card">No surveys found.</div>

  function canNext() {
    if (!q) return false
    const val = answers[q.id]?.trim() ?? ''
    if (q.required && !val) return false
    if (q.type === 'NUMBER' && val && Number.isNaN(Number(val))) return false
    
    return true
  }

  function setAnswer(val: string) {
    setAnswers(a => ({ ...a, [q!.id]: val }))
  }

  function next() {
    setError(null)
    if (!canNext()) { setError('Please provide a valid answer to continue.'); return; }
    setIdx(i => Math.min(i + 1, survey.questions.length - 1))
  }

  function prev() {
    setError(null)
    setIdx(i => Math.max(i - 1, 0))
  }

  async function submit() {
    setError(null)
    try {
      const payload = {
        surveyId: survey.id,
        answers: survey.questions.map((qq:Question) => ({ questionId: qq.id, answer: (answers[qq.id] ?? '').toString() }))
      }
      const res = await api.submit(payload)
      onSubmitted(res.response)
    } catch (e:any) {
      setError(e.message || 'Failed to submit')
    }
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{survey.title}</h1>
        <p className="text-gray-600">{survey.description}</p>
      </div>
      <Progress current={idx+1} total={survey.questions.length} />
      {q && (
        <div className="space-y-2">
          <div className="text-lg font-medium">{q.order}. {q.title}</div>
          {q.description && <div className="text-sm text-gray-600">{q.description}</div>}
          {q.type === 'TEXT' && (
            <input className="input" value={answers[q.id] ?? ''} onChange={e=>setAnswer(e.target.value)} placeholder="Type your answer" />
          )}
          {q.type === 'NUMBER' && (
            <input className="input" inputMode="numeric" value={answers[q.id] ?? ''} onChange={e=>setAnswer(e.target.value)} placeholder="Enter a number" />
          )}
          {/* {q.type === 'SELECT' && (
            // <select className="input" value={answers[q.id] ?? ''} onChange={e=>setAnswer(e.target.value)}>
            //   <option value="">Select…</option>
            //   {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            // </select>
            <select className="input" value={answers[q.id] ?? ''} onChange={e=>setAnswer(e.target.value)}>
  {(() => {
    let opts: string[] = [];
    const raw = q.options as unknown; // avoid TS narrowing to never

    if (Array.isArray(raw)) {
      opts = raw as string[];
    } else if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          opts = parsed as string[];
        } else {
          // fallback: maybe comma-separated
          opts = raw.split(",").map((s) => s.trim());
        }
      } catch {
        // fallback if not valid JSON
        opts = raw.split(",").map((s) => s.trim());
      }
    }

    return opts.map((opt, idx) => (
      <option key={idx} value={opt}>
        {opt}
      </option>
    ));
  })()}
</select>
          )} */}
        </div>
      )}
      {error && <div className="error mt-2">{error}</div>}
      <div className="flex items-center gap-2 mt-6">
        <button className="btn" onClick={prev} disabled={idx===0}>Previous</button>
        {idx < survey.questions.length - 1 ? (
          <button className="btn" onClick={next} disabled={!canNext()}>Next</button>
        ) : (
          <button className="btn" onClick={submit} disabled={!canNext()}>Submit</button>
        )}
      </div>
    </div>
  )
}