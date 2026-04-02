import React from 'react'
import { BASE_POINTS } from '../data'

const EXAMPLES = [
  { label: 'Favourite (+500)', odds: 500 },
  { label: 'Contender (+3000)', odds: 3000 },
  { label: 'Longshot (+8000)', odds: 8000 },
]

export default function ScoringPage() {
  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">How scoring works</div>
        <div className="scoring-explainer">
          <div className="scoring-step">
            <div className="step-num">1</div>
            <div className="step-body">
              <h3>Base points for finishing position</h3>
              <p>Only the top 10 finishers score points. 1st place earns 100 base points, scaling down to 6 points for 10th.</p>
            </div>
          </div>
          <div className="scoring-step">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>Odds multiplier rewards bold picks</h3>
              <p>Your golfer's starting odds become a multiplier. +1000 odds = 10x. +5000 = 50x. Picking the short-priced favourite earns fewer points — picking a longshot who delivers earns a massive score.</p>
            </div>
          </div>
          <div className="scoring-step">
            <div className="step-num">3</div>
            <div className="step-body">
              <h3>Final score = base points × odds multiplier</h3>
              <p>Picking Scheffler (+500) to win gives 100 × 5 = <strong>500 pts</strong>. Picking a +8000 outsider who finishes 3rd gives 65 × 80 = <strong>5,200 pts</strong>. Every round matters.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Points table</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="scoring-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Base pts</th>
                {EXAMPLES.map(e => <th key={e.odds}>{e.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {BASE_POINTS.map((pts, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>
                    {['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'][i]}
                  </td>
                  <td>{pts}</td>
                  {EXAMPLES.map(e => (
                    <td key={e.odds} className="pts-bold">
                      {(pts * e.odds / 100).toLocaleString()} pts
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: 'var(--off-white)' }}>
                <td style={{ color: 'var(--text-muted)' }}>11th+</td>
                <td style={{ color: 'var(--text-muted)' }}>0</td>
                {EXAMPLES.map(e => <td key={e.odds} style={{ color: 'var(--text-muted)' }}>0 pts</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '1rem' }}>
          Odds multiplier = starting odds ÷ 100. Example: +4500 odds → 45× multiplier.
          This means every golfer has a genuine shot at winning the sweepstakes — not just whoever picks the world number one.
        </p>
      </div>
    </div>
  )
}
