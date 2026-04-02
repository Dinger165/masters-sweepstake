import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import EnterPage from './components/EnterPage'
import LeaderboardPage from './components/LeaderboardPage'
import ScoringPage from './components/ScoringPage'
import AdminPage from './components/AdminPage'
import './App.css'

const TABS = [
  { id: 'enter', label: 'Enter' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'scoring', label: 'How it works' },
  { id: 'admin', label: 'Admin' },
]

export default function App() {
  const [tab, setTab] = useState('enter')
  const [entrants, setEntrants] = useState([])
  const [scores, setScores] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [{ data: entrantData }, { data: scoreData }] = await Promise.all([
      supabase.from('entrants').select('*').order('entered_at', { ascending: true }),
      supabase.from('scores').select('*'),
    ])
    if (entrantData) setEntrants(entrantData)
    if (scoreData) {
      const map = {}
      scoreData.forEach(s => { map[s.golfer] = s })
      setScores(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

    const entrantSub = supabase
      .channel('entrants-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entrants' }, fetchData)
      .subscribe()

    const scoreSub = supabase
      .channel('scores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(entrantSub)
      supabase.removeChannel(scoreSub)
    }
  }, [fetchData])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-flag">
          <span className="flag-stripe green" />
          <span className="flag-stripe white" />
          <span className="flag-stripe green" />
        </div>
        <p>Loading the Masters 2026 sweepstakes...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-top">
            <div className="header-flag">
              <span className="flag-stripe green" />
              <span className="flag-stripe white" />
              <span className="flag-stripe green" />
            </div>
            <div>
              <h1 className="app-title">Masters 2026</h1>
              <p className="app-subtitle">Sweepstakes · Augusta National · Apr 9–12</p>
            </div>
            <div className="header-stats">
              <div className="header-stat">
                <span className="header-stat-val">{entrants.length}</span>
                <span className="header-stat-label">entrants</span>
              </div>
              <div className="header-stat-divider" />
              <div className="header-stat">
                <span className="header-stat-val">€{entrants.length * 5}</span>
                <span className="header-stat-label">pot</span>
              </div>
            </div>
          </div>
          <nav className="app-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`nav-btn${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main">
        {tab === 'enter' && (
          <EnterPage entrants={entrants} onEntered={fetchData} />
        )}
        {tab === 'leaderboard' && (
          <LeaderboardPage entrants={entrants} scores={scores} />
        )}
        {tab === 'scoring' && <ScoringPage />}
        {tab === 'admin' && (
          <AdminPage entrants={entrants} scores={scores} onUpdated={fetchData} />
        )}
      </main>

      <footer className="app-footer">
        <p>Masters 2026 Sweepstakes · For entertainment purposes · €5 entry</p>
      </footer>
    </div>
  )
}
