import React, { useState } from 'react'
import { supabase } from '../supabase'
import { PLAYERS, TIER_ORDER, TIER_LABELS, formatOdds, getMultiplier, ENTRY_FEE, PICKS_PER_ENTRY } from '../data'

export default function EnterPage({ entrants, onEntered }) {
  const [name, setName] = useState('')
  const [selectedGolfers, setSelectedGolfers] = useState([])
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

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

  function toggleGolfer(name) {
    if (selectedGolfers.includes(name)) {
      setSelectedGolfers(selectedGolfers.filter(g => g !== name))
    } else if (selectedGolfers.length < PICKS_PER_ENTRY) {
      setSelectedGolfers([...selectedGolfers, name])
    }
  }

  async function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) { setMessage({ type: 'error', text: 'Please enter your name' }); return }
    if (selectedGolfers.length !== PICKS_PER_ENTRY) {
      setMessage({ type: 'error', text: `Please pick exactly ${PICKS_PER_ENTRY} golfers` }); return
    }
    if (entrants.find(e => e.name.toLowerCase() === trimmedName.toLowerCase())) {
      setMessage({ type: 'error', text: 'That name has already been entered' }); return
    }

    setSubmitting(true)
    const { error } = await supabase.from('entrants').insert({
      name: trimmedName,
      golfers: selectedGolfers,
    })
    setSubmitting(false)

    if (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } else {
      setMessage({ type: 'success', text: `Entry submitted! Good luck, ${trimmedName}.` })
      setName('')
      setSelectedGolfers([])
      setSearch('')
      onEntered()
    }
    setTimeout(() => setMessage(null), 4000)
  }

  const remaining = PICKS_PER_ENTRY - selectedGolfers.length

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
          <div className="stat-card-label">Picks each</div>
          <div className="stat-card-val">{PICKS_PER_ENTRY}</div>
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

        <div className="form-group">
          <label className="form-label">
            Pick {PICKS_PER_ENTRY} golfers
            {selectedGolfers.length > 0 && (
              <span style={{ marginLeft: 8, color: remaining === 0 ? 'var(--green-mid)' : 'var(--gold)', fontWeight: 400 }}>
                — {remaining === 0 ? 'all picked!' : `${remaining} remaining`}
              </span>
            )}
          </label>

          {selectedGolfers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
              {selectedGolfers.map(g => {
                const p = PLAYERS.find(pl => pl.name === g)
                return (
                  <div key={g} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', background: 'var(--green-pale)',
                    border: '1px solid var(--green-light)', borderRadius: 99,
                    fontSize: 13
                  }}>
                    <span>{g}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{p ? formatOdds(p.odds) : ''}</span>
                    <button onClick={() => toggleGolfer(g)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: 14, padding: '0 2px', lineHeight: 1
                    }}>×</button>
                  </div>
                )
              })}
            </div>
          )}

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
                const sel = selectedGolfers.includes(p.name)
                const maxed = selectedGolfers.length >= PICKS_PER_ENTRY && !sel
                return (
                  <div
                    key={p.name}
                    className={`player-pick-row${sel ? ' selected' : ''}${maxed ? ' taken' : ''}`}
                    onClick={() => !maxed && toggleGolfer(p.name)}
                  >
                    <div className="pick-check">{sel ? '✓' : ''}</div>
                    <span className="player-pick-name">{p.name}</span>
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
          disabled={submitting || selectedGolfers.length !== PICKS_PER_ENTRY}
        >
          {submitting ? 'Submitting...' : `Submit entry · €${ENTRY_FEE}`}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Pick {PICKS_PER_ENTRY} golfers. Your combined points from all {PICKS_PER_ENTRY} count towards your total. Higher odds = bigger multiplier if they finish top 10.
        </p>
      </div>
    </div>
  )
}
