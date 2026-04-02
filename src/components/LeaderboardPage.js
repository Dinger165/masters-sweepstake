import React from 'react'
import { PLAYERS, calcScore, formatOdds, getMultiplier, ordinal, ENTRY_FEE } from '../data'

export default function LeaderboardPage({ entrants, scores }) {
  const rows = entrants.map(e => {
    const golfers = e.golfers || (e.golfer ? [e.golfer] : [])
    const golferDetails = golfers.map(name => {
      const player = PLAYERS.find(p => p.name === name)
      const scoreData = scores[name]
      const position = scoreData ? scoreData.position : null
      const points = player && position ? calcScore(player.odds, position) : 0
      return { name, player, position, points, scoreVsPar: scoreData ? scoreData.score_vs_par : null }
    })
    const totalPoints = golferDetails.reduce((sum, g) => sum + g.points, 0)
    return { ...e, golferDetails, totalPoints }
  }).sort((a, b) => b.totalPoints - a.totalPoints)

  const anyScores = rows.some(r => r.totalPoints > 0)

  function formatScoreVsPar(s) {
    if (s === null || s === undefined) return null
    if (s === 0) return 'E'
    return s > 0 ? '+' + s : String(s)
  }

  function scoreColor(s) {
    if (s === null || s === undefined) return 'var(--text-muted)'
    if (s < 0) return 'var(--green-mid)'
    if (s > 0) return '#c0392b'
    return 'var(--text-secondary)'
  }

  if (!entrants.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div style={{ fontSize: 32, marginBottom: '0.5rem' }}>⛳</div>
          <strong>No entries yet</strong>
          <p>Be the first to enter the sweepstakes!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {!anyScores && (
        <div className="notice notice-info" style={{ marginBottom: '1rem' }}>
          Tournament starts April 9. Scores and points will update here in real time once play begins.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((r, i) => {
          const posClass = i === 0 && r.totalPoints > 0 ? 'pos-1' : i === 1 && r.totalPoints > 0 ? 'pos-2' : i === 2 && r.totalPoints > 0 ? 'pos-3' : ''
          return (
            <div key={r.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: i === 0 && r.totalPoints > 0 ? '#faf8ef' : 'transparent',
                borderBottom: '1px solid var(--border)'
              }}>
                <div className={`pos-circle ${posClass}`}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {r.golferDetails.length} golfers · €{ENTRY_FEE} entry
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 500,
                    color: r.totalPoints > 0 ? 'var(--green-mid)' : 'var(--text-muted)'
                  }}>
                    {r.totalPoints > 0 ? r.totalPoints.toLocaleString() : '—'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>total pts</div>
                </div>
              </div>

              <div style={{ padding: '8px 16px' }}>
                {r.golferDetails.map(g => {
                  const svp = formatScoreVsPar(g.scoreVsPar)
                  return (
                    <div key={g.name} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '6px 0', borderBottom: '1px solid var(--border)',
                      fontSize: 13
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 500 }}>{g.name}</span>
                        <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 11 }}>
                          {g.player ? `${formatOdds(g.player.odds)} · ${getMultiplier(g.player.odds)}` : ''}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', minWidth: 40, textAlign: 'center' }}>
                        {g.position ? (
                          <span>
                            {ordinal(g.position)}
                            {svp && <span style={{ marginLeft: 4, color: scoreColor(g.scoreVsPar), fontWeight: 500 }}>{svp}</span>}
                          </span>
                        ) : '—'}
                      </div>
                      <div style={{
                        minWidth: 60, textAlign: 'right', fontWeight: 500,
                        color: g.points > 0 ? 'var(--green-mid)' : 'var(--text-muted)'
                      }}>
                        {g.points > 0 ? g.points.toLocaleString() + ' pts' : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
        {entrants.length} entrant{entrants.length !== 1 ? 's' : ''} · Prize pot €{entrants.length * ENTRY_FEE} · Updates live
      </p>
    </div>
  )
}
