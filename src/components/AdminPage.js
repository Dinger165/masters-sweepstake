import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { PLAYERS, formatOdds, getMultiplier, calcScore, ordinal } from '../data'

const ADMIN_PASSWORD = 'masters2026'

export default function AdminPage({ entrants, scores, onUpdated }) {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
  const [positions, setPositions] = useState({})
  const [parScores, setParScores] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  const activeGolfers = [...new Set(entrants.map(e => e.golfer))]
    .map(name => PLAYERS.find(p => p.name === name))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => {
    const init = {}
    const initPar = {}
    activeGolfers.forEach(p => {
      const s = scores[p.name]
      init[p.name] = s ? String(s.position || '') : ''
      initPar[p.name] = s ? String(s.score_vs_par ?? '') : ''
    })
    setPositions(init)
    setParScores(initPar)
  }, [scores, entrants])

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPwError('Incorrect password')
      setTimeout(() => setPwError(''), 2500)
    }
  }

  async function handleSave() {
    setSaving(true)
    const upserts = activeGolfers
      .filter(p => positions[p.name])
      .map(p => ({
        golfer: p.name,
        position: parseInt(positions[p.name]) || null,
        score_vs_par: parScores[p.name] !== '' ? parseInt(parScores[p.name]) : null,
        updated_at: new Date().toISOString(),
      }))

    const { error } = await supabase
      .from('scores')
      .upsert(upserts, { onConflict: 'golfer' })

    setSaving(false)
    if (error) {
      setSaveMsg({ type: 'error', text: 'Save failed: ' + error.message })
    } else {
      setSaveMsg({ type: 'success', text: `Saved ${upserts.length} scores. Leaderboard updated!` })
      onUpdated()
    }
    setTimeout(() => setSaveMsg(null), 4000)
  }

  async function handleClearScores() {
    if (!window.confirm('Clear all scores? Entries will be kept but all positions reset to zero.')) return
    await supabase.from('scores').delete().neq('golfer', '')
    setPositions({})
    setParScores({})
    onUpdated()
  }

  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="card">
          <div className="section-title">Admin access</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Enter the admin password to update tournament scores.
          </p>
          <input
            type="password"
            placeholder="Password..."
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ marginBottom: '0.75rem' }}
          />
          {pwError && <div className="notice notice-error" style={{ marginBottom: '0.75rem' }}>{pwError}</div>}
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Default password: <code>masters2026</code> — change this in AdminPage.js before deploying.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div className="section-title" style={{ marginBottom: 4 }}>Update scores</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Enter each golfer's current leaderboard position after each round. The live leaderboard updates immediately for all participants.
            </p>
          </div>
        </div>

        {!activeGolfers.length && (
          <div className="empty-state">No entries yet — nothing to score.</div>
        )}

        {activeGolfers.length > 0 && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 70px', gap: 10, padding: '8px 14px', background: 'var(--off-white)', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              <div>Golfer</div>
              <div style={{ textAlign: 'center' }}>Position</div>
              <div style={{ textAlign: 'center' }}>Score vs par</div>
              <div style={{ textAlign: 'right' }}>Pts preview</div>
            </div>
            {activeGolfers.map(p => {
              const pos = positions[p.name] ? parseInt(positions[p.name]) : null
              const pts = pos ? calcScore(p.odds, pos) : 0
              const entrant = entrants.find(e => e.golfer === p.name)
              return (
                <div key={p.name} className="admin-golfer-row">
                  <div className="admin-golfer-info">
                    <div className="admin-golfer-name">{p.name}</div>
                    <div className="admin-golfer-meta">
                      {entrant?.name} · {formatOdds(p.odds)} · {getMultiplier(p.odds)}
                    </div>
                  </div>
                  <input
                    type="number"
                    className="admin-pos-input"
                    min="1"
                    max="100"
                    placeholder="—"
                    value={positions[p.name] || ''}
                    onChange={e => setPositions(prev => ({ ...prev, [p.name]: e.target.value }))}
                  />
                  <input
                    type="number"
                    className="admin-pos-input"
                    min="-30"
                    max="50"
                    placeholder="E"
                    value={parScores[p.name] || ''}
                    onChange={e => setParScores(prev => ({ ...prev, [p.name]: e.target.value }))}
                    style={{ textAlign: 'center' }}
                  />
                  <div style={{ textAlign: 'right', fontFamily: "'Playfair Display', serif", fontSize: 15, color: pts > 0 ? 'var(--green-mid)' : 'var(--text-muted)', fontWeight: pts > 0 ? 500 : 400 }}>
                    {pts > 0 ? pts.toLocaleString() : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {saveMsg && (
          <div className={`notice notice-${saveMsg.type}`} style={{ marginTop: '1rem' }}>
            {saveMsg.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !activeGolfers.length}>
            {saving ? 'Saving...' : 'Save & update leaderboard'}
          </button>
          <button className="btn btn-danger" onClick={handleClearScores}>
            Clear all scores
          </button>
          <button className="btn" onClick={() => setAuthed(false)} style={{ marginLeft: 'auto' }}>
            Log out
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">All entrants</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {entrants.length} entrant{entrants.length !== 1 ? 's' : ''} · €{entrants.length * 5} pot
        </p>
        {entrants.length === 0 && <div className="empty-state">No entries yet.</div>}
        {entrants.map((e, i) => {
          const p = PLAYERS.find(pl => pl.name === e.golfer)
          return (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.golfer} · {p ? formatOdds(p.odds) : ''}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(e.entered_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
