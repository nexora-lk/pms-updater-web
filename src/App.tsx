import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Downloads from './components/Downloads'
import LatestVersion from './components/LatestVersion'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'downloads' | 'latest'>('home')

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">PMS Updater</h1>
          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'latest' ? 'active' : ''}`}
                onClick={() => setCurrentPage('latest')}
              >
                Latest Version
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'downloads' ? 'active' : ''}`}
                onClick={() => setCurrentPage('downloads')}
              >
                All Downloads
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {currentPage === 'home' && (
        <>
          <section id="center">
            <div className="hero">
              <img src={heroImg} className="base" width="170" height="179" alt="" />
              <img src={reactLogo} className="framework" alt="React logo" />
              <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>
            <div>
              <h1>PMS Updater</h1>
              <p>
                Download the latest version of PMS software for your business
              </p>
            </div>
            <button
              className="counter"
              onClick={() => setCurrentPage('latest')}
            >
              Get Latest Version
            </button>
          </section>

          <section id="next-steps">
            <div id="docs">
              <h2>Latest Release</h2>
              <p>Access the most recent version</p>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('latest'); }}>
                    <img className="logo" src={viteLogo} alt="" />
                    Download Latest
                  </a>
                </li>
              </ul>
            </div>
            <div id="social">
              <h2>All Downloads</h2>
              <p>Browse version history</p>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('downloads'); }}>
                    <img className="button-icon" src={reactLogo} alt="" />
                    View All Versions
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <div className="ticks"></div>
          <section id="spacer"></section>
        </>
      )}

      {currentPage === 'latest' && (
        <LatestVersion />
      )}

      {currentPage === 'downloads' && (
        <Downloads />
      )}
    </>
  )
}

export default App
