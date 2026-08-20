import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/useAuth'
import { chatService } from '../features/community/services/chatService'
import Footer from '../components/Footer'
import './Community.css'

const donators = []

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
  const { isAuthenticated, user } = useAuth()
  const [topDonors, setTopDonors] = useState([])
  const [topDonorsLoading, setTopDonorsLoading] = useState(true)
  const [selectedId, setSelectedId]     = useState('general')
  const [messageInput, setMessageInput] = useState('')
  const [allMessages, setAllMessages]   = useState(() => {
    const map = {}
    initialCommunities.forEach((c) => { map[c.id] = [] })
    return map
  })
  const [replyingTo, setReplyingTo]         = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [attachedImages, setAttachedImages] = useState([])
  const [roomIds, setRoomIds] = useState({})
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const fileInputRef = useRef(null)
  const chatMessagesRef = useRef(null)
  const selected = initialCommunities.find((c) => c.id === selectedId) || initialCommunities[0]
  const messages = allMessages[selectedId] || []

  useEffect(() => {
    const messagesContainer = chatMessagesRef.current
    if (!messagesContainer) return

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, [selectedId, messages.length])

  useEffect(() => {
    let active = true
    chatService.getTopDonors(4)
      .then((donors) => active && setTopDonors(donors))
      .catch((error) => {
        console.error('[Community] Failed to load top donors:', error)
        if (active) setTopDonors([])
      })
      .finally(() => active && setTopDonorsLoading(false))
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined
    let active = true
    let cleanup = () => {}
    setChatLoading(true)
    setChatError('')
    chatService.getRoom(selectedId)
      .then(async (room) => {
        if (!active) return
        setRoomIds((prev) => ({ ...prev, [selectedId]: room.id }))
        const remoteMessages = await chatService.getMessages(room.id, user.id)
        if (!active) return
        setAllMessages((prev) => ({ ...prev, [selectedId]: remoteMessages }))
        cleanup = chatService.subscribe(room.id, user.id, (incoming) => {
          setAllMessages((prev) => {
            const current = prev[selectedId] || []
            return current.some((message) => message.id === incoming.id)
              ? prev
              : { ...prev, [selectedId]: [...current, incoming] }
          })
        })
      })
      .catch((error) => {
        if (active) setChatError(error.message || 'Chat belum dapat dimuat.')
      })
      .finally(() => active && setChatLoading(false))
    return () => {
      active = false
      cleanup()
    }
  }, [isAuthenticated, user?.id, selectedId])

  function handleSelectCommunity(id) {
    setSelectedId(id)
    setMessageInput('')
    setReplyingTo(null)
    setEditingMessage(null)
    setAttachedImages([])
  }

  function handleBackToGeneral() {
    setSelectedId('general')
    setMessageInput('')
    setReplyingTo(null)
    setEditingMessage(null)
    setAttachedImages([])
  }

  async function handleSend(e) {
    e.preventDefault()
    const text = messageInput.trim()
    if (!text && attachedImages.length === 0) return
    if (!isAuthenticated || !user?.id) {
      setChatError('Masuk terlebih dahulu untuk mengirim pesan.')
      return
    }
    const roomId = roomIds[selectedId]
    if (!roomId) {
      setChatError('Ruang chat sedang disiapkan. Coba lagi sebentar.')
      return
    }
    try {
      setChatError('')
      if (editingMessage) {
        const updated = await chatService.updateMessage(editingMessage.id, text, user.id)
        setAllMessages((prev) => ({
          ...prev,
          [selectedId]: (prev[selectedId] || []).map((message) => message.id === updated.id ? updated : message),
        }))
      } else {
        const sent = await chatService.sendMessage(roomId, text || attachedImages.map((file) => file.name).join(', '), user.id, replyingTo?.id || null)
        if (sent) {
          setAllMessages((prev) => {
            const current = prev[selectedId] || []
            return current.some((message) => message.id === sent.id)
              ? prev
              : { ...prev, [selectedId]: [...current, sent] }
          })
        }
      }
      setMessageInput('')
      setReplyingTo(null)
      setEditingMessage(null)
      setAttachedImages([])
    } catch (error) {
      setChatError(error.message || 'Pesan gagal dikirim.')
    }
  }

  async function handleCopy(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
      }
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    } catch (error) {
      console.error('[Community] Copy failed:', error)
    }
  }

  function handleReply(msg) {
    setReplyingTo(msg)
  }

  function handleCancelReply() {
    setReplyingTo(null)
  }

  function handleEdit(msg) {
    setEditingMessage(msg)
    setReplyingTo(null)
    setMessageInput(msg.text)
  }

  function handleCancelEdit() {
    setEditingMessage(null)
    setMessageInput('')
  }

  function handleAttachImages(e) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachedImages((prev) => [...prev, ...files])
    }
    // Reset so the same file can be selected again
    e.target.value = ''
  }

  function handleRemoveImage(index) {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const memberAvatars = (topDonors.length > 0 ? topDonors : donators).slice(0, 4)

  return (
    <>
      <main className="community-page">
      <div className="community-wrapper">
        <div className="community-layout">

          <aside className="top-donators" aria-label="Top Donatur">
            <header className="top-donators-header">
              <h2 className="top-donators-title">Top Donatur</h2>
              <p className="top-donators-sub">Para Donatur KEMBALI</p>
            </header>
            <ul className="donator-list" role="list">
              {topDonorsLoading ? (
                <li className="donator-empty-state">Memuat donatur...</li>
              ) : topDonors.length === 0 ? (
                <li className="donator-empty-state">Belum ada donasi tercatat.</li>
              ) : (
                topDonors.map((d) => (
                  <li key={d.id} className="donator-item">
                    <AvatarImg src={d.avatar} alt={d.name} className="donator-avatar" />
                    <span className="donator-name">{d.name}</span>
                  </li>
                ))
              )}
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

            {chatLoading && <div className="chat-status-message" role="status">Menghubungkan ke chat...</div>}
            {chatError && <div className="chat-status-message is-error" role="alert">{chatError}</div>}
            <div
              ref={chatMessagesRef}
              className="chat-messages"
              role="log"
              aria-live="polite"
              aria-label="Pesan komunitas"
            >
              {messages.map((msg) =>
                msg.isOwn ? (
                  <div key={msg.id} className="message-row message-own">
                    <div className="message-bubble-group own">
                      <span className="message-sender-label own">You</span>
                      <div className="message-bubble own">
                        {msg.replyTo && <div className="message-reply-preview"><strong>{msg.replyTo.sender}</strong><span>{msg.replyTo.text}</span></div>}
                        <p>{msg.text} {msg.editedAt && <small className="message-edited-label">(diedit)</small>}</p>
                      </div>
                      <div className="message-actions own">
                        <button type="button" className="msg-action-btn" onClick={() => handleEdit(msg)}>
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
                        {msg.replyTo && <div className="message-reply-preview"><strong>{msg.replyTo.sender}</strong><span>{msg.replyTo.text}</span></div>}
                        <p>{msg.text} {msg.editedAt && <small className="message-edited-label">(diedit)</small>}</p>
                      </div>
                      <div className="message-actions other">
                        <button type="button" className="msg-action-btn" onClick={() => handleReply(msg)}>
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleAttachImages}
                tabIndex={-1}
              />
              <div className={`chat-input-wrapper${replyingTo ? ' has-reply' : ''}${attachedImages.length > 0 ? ' has-attachments' : ''}`}>
                {editingMessage && (
                  <div className="chat-reply-bar chat-edit-bar">
                    <span className="reply-text">Mengedit pesan...</span>
                    <button type="button" className="reply-close-btn" onClick={handleCancelEdit} aria-label="Batal edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
                {replyingTo && !editingMessage && (
                  <div className="chat-reply-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="reply-icon" aria-hidden="true">
                      <path d="M9 14l-4-4 4-4" />
                      <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
                    </svg>
                    <span className="reply-text">Reply Messages....</span>
                    <button type="button" className="reply-close-btn" onClick={handleCancelReply} aria-label="Batal reply">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
                {attachedImages.length > 0 && (
                  <div className="chat-attachments">
                    {attachedImages.map((file, idx) => (
                      <span key={idx} className="chat-attachment-chip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="attachment-chip-icon" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="attachment-chip-name">{file.name}</span>
                        <button type="button" className="attachment-chip-remove" onClick={() => handleRemoveImage(idx)} aria-label={`Hapus ${file.name}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="chat-input-row">
                  <label htmlFor="community-msg-input" className="sr-only">Masukkan pesan</label>
                  <input
                    id="community-msg-input"
                    type="text"
                    className="chat-input"
                    placeholder="Masukkan pesan..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    autoComplete="off"
                    disabled={!isAuthenticated || chatLoading}
                  />
                  <button
                    type="button"
                    className="chat-attach-btn"
                    aria-label="Lampirkan gambar"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="chat-send-btn"
                aria-label="Kirim pesan"
                disabled={!messageInput.trim() && attachedImages.length === 0}
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
    </main>

    <Footer />
  </>
)
}