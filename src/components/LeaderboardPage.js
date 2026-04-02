import React from 'react'
import { PLAYERS, calcScore, formatOdds, getMultiplier, ordinal } from '../data'

export default function LeaderboardPage({ entrants, scores }) {
  const rows = entrants.map(e => {
    const player = PLAYERS.find(p => p.name === e.golfer)
    const scoreData = scores[e.golfer]
    const position = scoreData ? scoreData.position : null
    const points = player && position ? calcScore(player.odds, position) : 0
    return {
      ...e,
      player,
      position,
      points,
      scoreVsPar: scoreData ? scoreData.score_vs_par : null,
    }
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (a.position && b.position) return a.position - b.position
    if (a.position) return -1
    if (b.position) return 1
    return 0
  })

  const anyScores = rows.some(r => r.points > 0 || r.position !== null)

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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Standings</div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Points = base position score × odds multiplier. Last updated live.
          </p>
        </div>

        <div className="lb-header-row">
          <div></div>
          <div>Entrant</div>
          <div>Golfer</div>
          <div style={{ textAlign: 'center' }}>Position</div>
          <div style={{ textAlign: 'right' }}>Points</div>
        </div>

        {rows.map((r, i) => {
          const posClass = i === 0 && r.points > 0 ? 'pos-1' : i === 1 && r.points > 0 ? 'pos-2' : i === 2 && r.points > 0 ? 'pos-3' : ''
          const svp = formatScoreVsPar(r.scoreVsPar)
          return (
            <div key={r.id} className={`lb-row${i === 0 && r.points > 0 ? ' is-leader' : ''}`}>
              <div className={`pos-circle ${posClass}`}>{i + 1}</div>
              <div>
                <div className="lb-entrant-name">{r.name}</div>
              </div>
              <div>
                <div className="lb-golfer-name">{r.golfer}</div>
                <div className="lb-golfer-odds">
                  {r.player ? `${formatOdds(r.player.odds)} · ${getMultiplier(r.player.odds)}` : ''}
                </div>
              </div>
              <div className="lb-position">
                {r.position ? (
                  <div>
                    <div>{ordinal(r.position)}</div>
                    {svp && (
                      <div style={{ fontSize: 11, color: scoreColor(r.scoreVsPar), fontWeight: 500 }}>
                        {svp}
                      </div>
                    )}
                  </div>
                ) : '—'}
              </div>
              <div className={`lb-points${r.points === 0 ? ' zero' : ''}`}>
                {r.points > 0 ? r.points.toLocaleString() : '—'}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
        {entrants.length} entrant{entrants.length !== 1 ? 's' : ''} · Prize pot €{entrants.length * 5} · Leaderboard updates live
      </p>
    </div>
  )
}
