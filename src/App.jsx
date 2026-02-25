import { useEffect, useRef, useState } from 'react'
import './App.css'

const heroPhotoSrc = '/photos/04.jpg'

const youtubeVideoIds = [
  'GFsq4rtOjMQ',
  'yasC9Lp5DOI',
  '3L0HIRWP8_w',
]

const venueItems = [
  'Metamorphose (Mexico)',
  'Berlin Beats & Boats (Berlin)',
  'Tresor (Berlin)',
  'Kater Holzing (Berlin)',
  'Sisyphos (Berlin)',
  'D-Edge (Brazil)',
  'Lips & Rhythm (SF)',
  'Muka (SF)',
  'Mnml Underground (SF)',
  'Radio Valencia (SF)',
  'Like Minded (Costa Mesa)',
  'Yvoo (Boston)',
  'Love Life (San Diego)',
  'Resident of Clique (San Diego)',
]

const titleChars = 'Konnin'.split('')

function YouTubeCard({ videoId }) {
  const iframeRef = useRef(null)

  const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&playsinline=1&start=120&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&iv_load_policy=3`

  const sendCommand = (func, args = []) => {
    const playerWindow = iframeRef.current?.contentWindow
    if (!playerWindow) return

    playerWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args,
      }),
      '*',
    )
  }

  const handleMouseEnter = () => {
    sendCommand('unMute')
  }

  const handleMouseLeave = () => {
    sendCommand('mute')
  }

  return (
    <article className="video-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <iframe
        ref={iframeRef}
        src={src}
        title={`YouTube video ${videoId}`}
        loading="eager"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
      />
    </article>
  )
}

function App() {
  const [venueHoverIndex, setVenueHoverIndex] = useState(null)
  const [venueRippleTime, setVenueRippleTime] = useState(0)
  const [titleHoverIndex, setTitleHoverIndex] = useState(null)
  const [introPhase, setIntroPhase] = useState('show')

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setIntroPhase('closing')
    }, 900)

    const doneTimer = window.setTimeout(() => {
      setIntroPhase('done')
    }, 3000)

    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  useEffect(() => {
    if (venueHoverIndex === null) return

    let animationFrameId = 0

    const animate = (time) => {
      setVenueRippleTime(time)
      animationFrameId = window.requestAnimationFrame(animate)
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [venueHoverIndex])

  const handleVenueMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeY = event.clientY - rect.top
    const ratio = Math.min(Math.max(relativeY / rect.height, 0), 1)
    setVenueHoverIndex(ratio * (venueItems.length - 1))
  }

  const handleVenueMouseLeave = () => {
    setVenueHoverIndex(null)
    setVenueRippleTime(0)
  }

  const handleTitleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = event.clientX - rect.left
    const ratio = Math.min(Math.max(relativeX / rect.width, 0), 1)
    setTitleHoverIndex(ratio * (titleChars.length - 1))
  }

  const handleTitleMouseLeave = () => {
    setTitleHoverIndex(null)
  }

  return (
    <div className="page">
      {introPhase !== 'done' && (
        <div className={`intro-overlay${introPhase === 'closing' ? ' is-closing' : ''}`} aria-hidden="true">
          <h1 className="intro-title">
            {titleChars.map((char, index) => (
              <span className="intro-char" style={{ '--delay': index }} key={`intro-${char}-${index}`}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      )}

      <header className="site-header">
        <h1 className="site-title" onMouseMove={handleTitleMouseMove} onMouseLeave={handleTitleMouseLeave} aria-label="Konnin">
          {titleChars.map((char, index) => {
            const distance = titleHoverIndex === null ? 999 : Math.abs(index - titleHoverIndex)
            const wave = titleHoverIndex === null ? 0 : Math.exp(-(distance * distance) / 0.95)

            const style = {
              '--hStretch': (1 + wave * 0.2).toFixed(3),
              '--hSqueeze': (1 - wave * 0.05).toFixed(3),
              '--hGlow': wave.toFixed(3),
            }

            return (
              <span className="site-title-char" style={style} key={`${char}-${index}`}>
                {char}
              </span>
            )
          })}
        </h1>
        <nav className="nav">
          <a href="https://soundcloud.com/guilhermekonnin" >SoundCloud</a>
          <a href="https://www.instagram.com/konnin.dj/">Instagram</a>
          <a href="https://pt.ra.co/dj/konnin">RA</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container">
            <div className="container-size">
              <div className="hero-photo-frame">
                <img className="hero-photo" src={heroPhotoSrc} alt="Konnin DJ" />
              </div>
            </div>
          </div>

          <div className="hero-text">
            <p className="eyebrow">Profile</p>
            <div className="container-size text-row">
              <div className="text-columns">
                <p>
                  Originally from Blumenau, Brazil, Konnin is known 
                  for his versatile repertoire, deep musical research, 
                  and strong dancefloor presence. He has built a solid 
                  international trajectory, with remarkable stints in 
                  Berlin, California, and Barcelona.
                </p>
                <p>
                  Previously based in Los Angeles, where he held a 
                  residency, he is now living in Barcelona and is part 
                  of the roster of the Brazilian label Sudd Records.
                </p>
              </div>
            </div>
          </div>

          <div className="hero-end">
            <div className="booking">
              <p className="eyebrow">Booking</p>
              <p>Henrique Bagnati Vieceli</p>
              <p>
                <a href="mailto:bookings@kickclapagency.com">bookings@kickclapagency.com</a>
              </p>
              <p>
                <a href="tel:+5548999344069">+55 48 9 9934-4069</a>
              </p>
            </div>
            <div className="soundcloud-player">
              <iframe
                width="100%"
                height="20"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2268918260&color=%23000000&inverse=false&auto_play=false&show_user=true"
              />
            </div>
          </div>
        </section>

        <section className="venues">
          <div id="gallery" className="gallery">
            <div className="gallery-grid">
              {youtubeVideoIds.map((videoId) => (
                <YouTubeCard key={videoId} videoId={videoId} />
              ))}
            </div>
          </div>

          <div>
            <div className="container">
              <h2 className="container-size eyebrow">Performed at events such as</h2>
            </div>
            <div className="container">
              <div
                className="container-size venue-list"
                onMouseMove={handleVenueMouseMove}
                onMouseLeave={handleVenueMouseLeave}
              >
                {venueItems.map((venue, index) => {
                  const distance = venueHoverIndex === null ? 999 : Math.abs(index - venueHoverIndex)
                  const radius = venueHoverIndex === null ? 0 : (venueRippleTime * 0.0026) % 7.5
                  const band = distance - radius

                  const primaryRing = Math.exp(-((band * band) / 0.52))
                  const secondaryRing = 0.55 * Math.exp(-(((band - 1.05) * (band - 1.05)) / 0.72))
                  const energy = (primaryRing + secondaryRing) * Math.exp(-distance * 0.23)
                  const ripple = energy * Math.sin((distance - radius) * Math.PI * 1.45)
                  const intensity = Math.abs(ripple)

                  const style = {
                    '--stretch': (1 + intensity * 0.08).toFixed(3),
                    '--squeeze': (1 - intensity * 0.05).toFixed(3),
                    '--drift': `${(ripple * 2.1).toFixed(2)}px`,
                    '--glow': intensity.toFixed(3),
                  }

                  return (
                    <p className="venue-item" style={style} key={venue}>
                      {venue}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="media">
          <img className="media-image" src="/photos/06.jpg" alt="Konnin visual" />
        </section>

      </main>
    </div>
  )
}

export default App
