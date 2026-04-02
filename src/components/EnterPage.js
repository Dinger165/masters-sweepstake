import React, { useState } from 'react'
import { supabase } from '../supabase'
import { PLAYERS, TIER_ORDER, TIER_LABELS, formatOdds, getMultiplier, ENTRY_FEE } from '../data'

export default function EnterPage({ entrants, onEntered }) {
  const [name, setName] = useState('')
  const [selectedGolfer, setSelectedGolfer] = useState(null)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const takenGolfers = new Set(entrants.map(e => e.golfer))
  const takenNames = new Set(entrants.map(e => e.name.toLowerCase()))

  const filteredPlayers = PLAYERS.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || p.tier === tierFilter
    return matchSearch && matchTier
  })

  const grouped = {}
  TIER_ORDER.forEach(t => {
    const group = filteredPlayers.filter(p => p.tier === t)
    if (group.length) grouped[t] = group
  })

  async function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) { setMessage({ type: 'error', text: 'Please enter your name' }); return }
    if (!selectedGolfer) { setMessage({ type: 'error', text: 'Please pick a golfer' }); return }
    if (takenNames.has(trimmedName.toLowerCase())) { setMessage({ type: 'error', text: 'That name has already been entered' }); return }
    if (takenGolfers.has(selectedGolfer)) { setMessage({ type: 'error', text: 'That golfer has already been picked' }); return }

    setSubmitting(true)
    const { error } = await supabase.from('entrants').insert({ name: trimmedName, golfer: selectedGolfer })
    setSubmitting(false)

    if (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } else {
      setMessage({ type: 'success', text: `Entry submitted! Good luck, ${trimmedName}.` })
      setName('')
      setSelectedGolfer(null)
      setSearch('')
      onEntered()
    }
    setTimeout(() => setMessage(null), 4000)
  }

  const selectedPlayer = selectedGolfer ? PLAYERS.find(p => p.name === selectedGolfer) : null

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Entrants</div>
          <div className="stat-card-val">{entrants.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Prize pot</div>
          <div className="stat-card-val">€{entrants.length * ENTRY_FEE}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Entry fee</div>
          <div className="stat-card-val">€{ENTRY_FEE}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Spots left</div>
          <div className="stat-card-val">{PLAYERS.length - entrants.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Your entry</div>

        <div className="form-group">
          <label className="form-label">Your name</label>
          <input
            type="text"
            placeholder="First and last name..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
          />
        </div>

        {selectedPlayer && (
          <div className="notice notice-success" style={{ marginBottom: '1rem' }}>
            <span>Selected: <strong>{selectedPlayer.name}</strong> — odds {formatOdds(selectedPlayer.odds)} · {getMultiplier(selectedPlayer.odds)} multiplier</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Pick your golfer</label>
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="Search golfer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
              <option value="all">All tiers</option>
              {TIER_ORDER.map(t => (
                <option key={t} value={t}>{TIER_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {Object.keys(grouped).length === 0 && (
            <div className="empty-state">No golfers match your search</div>
          )}

          {TIER_ORDER.filter(t => grouped[t]).map(tier => (
            <div key={tier}>
              <div className="tier-section-label">{TIER_LABELS[tier]}</div>
              {grouped[tier].map(p => {
                const taken = takenGolfers.has(p.name)
                const sel = selectedGolfer === p.name
                return (
                  <div
                    key={p.name}
                    className={`player-pick-row${sel ? ' selected' : ''}${taken ? ' taken' : ''}`}
                    onClick={() => !taken && setSelectedGolfer(sel ? null : p.name)}
                  >
                    <div className="pick-check">{sel ? '✓' : ''}</div>
                    <span className="player-pick-name">
                      {p.name}
                      {taken && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>taken</span>}
                    </span>
                    <span className="player-pick-country">{p.country}</span>
                    <span className={`tier-badge tier-${p.tier}`}>{formatOdds(p.odds)}</span>
                    <span className="player-pick-mult">{getMultiplier(p.odds)}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {message && (
          <div className={`notice notice-${message.type}`} style={{ marginBottom: '1rem' }}>
            {message.text}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : `Submit entry · €${ENTRY_FEE}`}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Each golfer can only be picked once. Higher odds = bigger multiplier if they finish top 10.
        </p>
      </div>
    </div>
  )
}
