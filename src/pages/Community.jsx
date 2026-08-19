import { useState } from 'react'
import Footer from '../components/Footer'
import './Community.css'

const donators = [
  { id: 'wisnu',  name: 'Wisnu3anomali', avatar: '/assets/community/avatars/wisnu.png' },
  { id: 'eloj',   name: 'Eloj',          avatar: '/assets/community/avatars/eloj.png' },
  { id: 'krisnq', name: 'Krisnq',        avatar: '/assets/community/avatars/krisnq.png' },
  { id: 'hnyin',  name: 'Hnyin',         avatar: '/assets/community/avatars/hnyin.png' },
]

const initialCommunities = [
  {
    id: 'general',
    name: 'General',
    category: 'Temukan Teman dan Jelajahi Komunitas',
    location: '',
    image: '/assets/community/general.png',
    messages: [
      { id: 1, sender: 'You',   avatar: '/assets/community/avatars/wisnu.png', text: 'Hai guyssss!', isOwn: true },
      { id: 2, sender: 'Eloj',  avatar: '/assets/community/avatars/eloj.png',  text: 'Mas/mbak, udah pernah coba donasi ke Sedekas?', isOwn: false },
      { id: 3, sender: 'Hnyin', avatar: '/assets/community/avatars/hnyin.png', text: 'Halo gesssss yahahahahah', isOwn: false },
    ],
  },
  {
    id: 'dipo-waste-bank',
    name: 'Dipo Waste Bank',
    category: 'Bank Sampah',
    location: 'Tembalang, Semarang',
    image: '/dipo waste bank 1.svg',
    messages: [
      { id: 1, sender: 'You',             avatar: '/assets/community/avatars/wisnu.png', text: 'Hai guyssss!', isOwn: true },
      { id: 2, sender: 'Dipo Waste Bank', avatar: '/dipo waste bank 1.svg',              text: 'Selamat bergabung di Komunitas ini melalui platform KEMBALI!', isOwn: false },
      { id: 3, sender: 'Hnyin',           avatar: '/assets/community/avatars/hnyin.png', text: 'hai', isOwn: false },
    ],
  },
  {
    id: 'sedekas',
    name: 'SEDEKAS',
    category: 'Komunitas Barang Layak Pakai',
    location: 'Semarang Barat',
    image: '/sedekas semarang barat 1.svg',
    messages: [
      { id: 1, sender: 'You',     avatar: '/assets/community/avatars/wisnu.png', text: 'Hai guyssss!', isOwn: true },
      { id: 2, sender: 'Sedekas', avatar: '/sedekas semarang barat 1.svg',       text: 'Selamat bergabung di Komunitas ini melalui platform KEMBALI!', isOwn: false },
      { id: 3, sender: 'Hnyin',   avatar: '/assets/community/avatars/hnyin.png', text: 'hai', isOwn: false },
    ],
  },
  {
    id: 'panti-asuhan-al-jannah',
    name: 'PANTI ASUHAN AL-JANNAH',
    category: 'Panti Asuhan',
    location: 'Tugu, Semarang',
    image: '/Panji AL JANNAH 1.svg',
    messages: [
      { id: 1, sender: 'You',                    avatar: '/assets/community/avatars/wisnu.png', text: 'Hai guyssss!', isOwn: true },
      { id: 2, sender: 'Panti Asuhan Al-Jannah', avatar: '/Panji AL JANNAH 1.svg',              text: 'Selamat bergabung di Komunitas ini melalui platform KEMBALI!', isOwn: false },
      { id: 3, sender: 'Hnyin',                  avatar: '/assets/community/avatars/hnyin.png', text: 'hai', isOwn: false },
    ],
  },
  {
    id: 'panti-asuhan-kristen-tanah-putih',
    name: 'Panti Asuhan Kristen Tanah Putih',
    category: 'Panti Asuhan',
    location: 'Candisari, Semarang',
    image: '/Panti asuhan kristen tanah putih 1.svg',
    messages: [
      { id: 1, sender: 'You',                              avatar: '/assets/community/avatars/wisnu.png',      text: 'Hai guyssss!', isOwn: true },
      { id: 2, sender: 'Panti Asuhan Kristen Tanah Putih', avatar: '/Panti asuhan kristen tanah putih 1.svg', text: 'Selamat bergabung di Komunitas ini melalui platform KEMBALI!', isOwn: false },
      { id: 3, sender: 'Hnyin',                            avatar: '/assets/community/avatars/hnyin.png',      text: 'hai', isOwn: false },
    ],
  },
]

const exploreList = [
  {
    id: 'dipo-waste-bank',
    name: 'Dipo Waste Bank',
    category: 'Bank Sampah',
    location: 'Tembalang, Semarang',
    image: '/dipo waste bank 1.svg',
    description: 'Dipo Waste Bank menerima sampah anorganik terpilah dari warga/civitas UNDIP untuk dikelola secara berkelanjutan melalui program bank sampah.',
  },
  {
    id: 'sedekas',
    name: 'SEDEKAS',
    category: 'Komunitas Barang Layak Pakai',
    location: 'Semarang Barat',
    image: '/sedekas semarang barat 1.svg',
    description: 'Mengumpulkan dan menyalurkan barang layak pakai untuk membantu masyarakat yang membutuhkan.',
  },
  {
    id: 'panti-asuhan-al-jannah',
    name: 'PANTI ASUHAN AL-JANNAH',
    category: 'Panti Asuhan',
    location: 'Tugu, Semarang',
    image: '/Panji AL JANNAH 1.svg',
    description: "Panti Asuhan Al Jannah membina anak yatim, piatu, dan dhuafa melalui pendidikan, tahfidz Al-Qur'an, serta pemenuhan kebutuhan harian.",
  },
  {
    id: 'panti-asuhan-kristen-tanah-putih',
    name: 'Panti Asuhan Kristen Tanah Putih',
    category: 'Panti Asuhan',
    location: 'Candisari, Semarang',
    image: '/Panti asuhan kristen tanah putih 1.svg',
    description: 'Panti Asuhan Kristen Tanah Putih membina dan merawat anak-anak melalui pendidikan, pembinaan, serta pemenuhan kebutuhan sehari-hari.',
  },
]

const stats = [
  { value: '12.400+',  label: 'Barang Tersirkulasi' },
  { value: '2.000 kg', label: 'Sampah Dikurangi' },
  { value: '4.680 kg', label: 'CO2 Dihemat' },
  { value: '1.500+',   label: 'Pengguna Aktif' },
]

function AvatarImg({ src, alt, className }) {
  const [errored, setErrored] = useState(false)
  const initial = alt ? alt.charAt(0).toUpperCase() : '?'
  if (errored || !src) {
    return (
      <span className={`avatar-fallback ${className || ''}`} aria-label={alt}>
        {initial}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}

export default function Community() {
  const [selectedId, setSelectedId]     = useState('general')
  const [messageInput, setMessageInput] = useState('')
  const [allMessages, setAllMessages]   = useState(() => {
    const map = {}
    initialCommunities.forEach((c) => { map[c.id] = [...c.messages] })
    return map
  })
  const selected = initialCommunities.find((c) => c.id === selectedId) || initialCommunities[0]
  const messages = allMessages[selectedId] || []

  function handleSelectCommunity(id) {
    setSelectedId(id)
    setMessageInput('')
  }

  function handleBackToGeneral() {
    setSelectedId('general')
    setMessageInput('')
  }

  function handleSend(e) {
    e.preventDefault()
    const text = messageInput.trim()
    if (!text) return
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      avatar: '/assets/community/avatars/wisnu.png',
      text,
      isOwn: true,
    }
    setAllMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }))
    setMessageInput('')
  }

  function handleCopy(text) {
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  const memberAvatars = donators.slice(0, 4)

  return (
    <main className="community-page">
      <div className="community-wrapper">
        <div className="community-layout">

          <aside className="top-donators" aria-label="Top Donatur">
            <header className="top-donators-header">
              <h2 className="top-donators-title">Top Donatur</h2>
              <p className="top-donators-sub">Para Donatur KEMBALI</p>
            </header>
            <ul className="donator-list" role="list">
              {donators.map((d) => (
                <li key={d.id} className="donator-item">
                  <AvatarImg src={d.avatar} alt={d.name} className="donator-avatar" />
                  <span className="donator-name">{d.name}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section className="community-chat" aria-label="Community Chat">
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-member-avatars" aria-hidden="true">
                  {memberAvatars.map((m) => (
                    <AvatarImg key={m.id} src={m.avatar} alt={m.name} className="chat-member-avatar" />
                  ))}
                </div>
                <div className="chat-header-info">
                  <h2 className="chat-community-name">{selected.name}</h2>
                  <p className="chat-community-meta">
                    {[selected.category, selected.location].filter(Boolean).join(' - ')}
                  </p>
                </div>
              </div>
              {selectedId !== 'general' && (
                <button
                  type="button"
                  className="back-to-general-btn"
                  onClick={handleBackToGeneral}
                  aria-label="Kembali ke General"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 14l-4-4 4-4" />
                    <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
                  </svg>
                  Kembali ke General
                </button>
              )}
            </div>

            <div className="chat-messages" role="log" aria-live="polite" aria-label="Pesan komunitas">
              {messages.map((msg) =>
                msg.isOwn ? (
                  <div key={msg.id} className="message-row message-own">
                    <div className="message-bubble-group own">
                      <span className="message-sender-label own">You</span>
                      <div className="message-bubble own">
                        <p>{msg.text}</p>
                      </div>
                      <div className="message-actions own">
                        <button type="button" className="msg-action-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Edit
                        </button>
                        <button type="button" className="msg-action-btn" onClick={() => handleCopy(msg.text)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="message-row message-other">
                    <AvatarImg src={msg.avatar} alt={msg.sender} className="message-avatar" />
                    <div className="message-bubble-group other">
                      <span className="message-sender-label other">{msg.sender}</span>
                      <div className="message-bubble other">
                        <p>{msg.text}</p>
                      </div>
                      <div className="message-actions other">
                        <button type="button" className="msg-action-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          Reply
                        </button>
                        <button type="button" className="msg-action-btn" onClick={() => handleCopy(msg.text)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <form className="chat-input-area" onSubmit={handleSend} aria-label="Kirim pesan">
              <label htmlFor="community-msg-input" className="sr-only">Masukkan pesan</label>
              <input
                id="community-msg-input"
                type="text"
                className="chat-input"
                placeholder="Masukkan pesan..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                autoComplete="off"
              />
              <button type="button" className="chat-attach-btn" aria-label="Lampirkan gambar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </button>
              <button
                type="submit"
                className="chat-send-btn"
                aria-label="Kirim pesan"
                disabled={!messageInput.trim()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </section>

          <aside className="community-list" aria-label="Jelajahi Komunitas">
            <div className="explore-header">
              <h2 className="explore-title">Jelajahi Komunitas</h2>
              <p className="explore-sub">Temukan dan cari Komunitas yang membutuhkan</p>
            </div>
            <ul className="explore-list" role="list">
              {exploreList.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`community-card ${selectedId === c.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectCommunity(c.id)}
                    aria-pressed={selectedId === c.id}
                  >
                    <div className="community-card-img-wrap">
                      <AvatarImg src={c.image} alt={c.name} className="community-card-img" />
                    </div>
                    <div className="community-card-body">
                      <h3 className="community-card-name">{c.name}</h3>
                      <p className="community-card-meta">
                        {[c.category, c.location].filter(Boolean).join(' - ')}
                      </p>
                      <p className="community-card-desc">{c.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

        </div>
      </div>

      <section className="community-impact" aria-labelledby="impact-heading">
        <div className="impact-inner">
          <div className="impact-text">
            <h2 id="impact-heading">
              Siap Memberikan Kehidupan<br />
              Kedua untuk Barangmu?
            </h2>
            <p>
              Salurkan barang layak pakai ke komunitas yang membutuhkan
              hanya dalam beberapa langkah mudah.
            </p>
          </div>
          <div className="impact-stats">
            {stats.map((s) => (
              <article key={s.value} className="impact-stat-card">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </article>
            ))}
          </div>
          <div className="impact-illustration" aria-hidden="true">
            <img
              src="/assets/community/community-illustration.png"
              alt=""
              className="community-illustration"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}