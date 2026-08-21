import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { chatService } from '../features/community/services/chatService'
import { communityService, FALLBACK_COMMUNITIES } from '../features/community/services/communityService'
import Footer from '../components/Footer'
import LoadingScreen from '../components/LoadingScreen'
import './Community.css'

const donators = []

const GENERAL_COMMUNITY = {
  id: 'general',
  name: 'General',
  category: 'Temukan Teman dan Jelajahi Komunitas',
  location: '',
  image: '/assets/community/general.png',
}

const mapChatCommunity = (community) => ({ ...community, image: community.logo })
const fallbackChatCommunities = [GENERAL_COMMUNITY, ...FALLBACK_COMMUNITIES.map(mapChatCommunity)]

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

function MessageBody({ message, onPreviewImage }) {
  return (
    <>
      {message.replyTo && <div className="message-reply-preview"><strong>{message.replyTo.sender}</strong><span>{message.replyTo.text}</span></div>}
      {message.images?.length > 0 && (
        <div className={`message-image-grid image-count-${message.images.length}`}>
          {message.images.map((url, index) => (
            <button type="button" onClick={() => onPreviewImage(url)} key={url} aria-label={`Perbesar gambar ${index + 1}`}>
              <img src={url} alt={`Lampiran chat ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {message.text && <p>{message.text} {message.editedAt && <small className="message-edited-label">(diedit)</small>}</p>}
    </>
  )
}

export default function Community() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [topDonors, setTopDonors] = useState([])
  const [topDonorsLoading, setTopDonorsLoading] = useState(true)
  const [communities, setCommunities] = useState(fallbackChatCommunities)
  const [communitiesLoading, setCommunitiesLoading] = useState(true)
  const [selectedId, setSelectedId]     = useState('general')
  const [messageInput, setMessageInput] = useState('')
  const [allMessages, setAllMessages]   = useState(() => {
    const map = {}
    fallbackChatCommunities.forEach((c) => { map[c.id] = [] })
    return map
  })
  const [replyingTo, setReplyingTo]         = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [attachedImages, setAttachedImages] = useState([])
  const [roomIds, setRoomIds] = useState({})
  const [chatLoading, setChatLoading] = useState(false)
  const [chatSending, setChatSending] = useState(false)
  const [chatError, setChatError] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const fileInputRef = useRef(null)
  const chatMessagesRef = useRef(null)
  const selected = communities.find((c) => c.id === selectedId) || GENERAL_COMMUNITY
  const exploreList = communities.filter((community) => community.id !== 'general')
  const messages = allMessages[selectedId] || []

  useEffect(() => {
    let active = true
    communityService.getCommunities()
      .then((rows) => {
        if (active && rows.length) setCommunities([GENERAL_COMMUNITY, ...rows.map(mapChatCommunity)])
      })
      .catch((error) => console.error('[Community] Failed to load communities:', error))
      .finally(() => { if (active) setCommunitiesLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const messagesContainer = chatMessagesRef.current
    if (!messagesContainer) return

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, [selectedId, messages.length])

  useEffect(() => {
    if (!previewImage) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewImage('')
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [previewImage])

  useEffect(() => {
    let active = true
    const loadTopDonors = () => chatService.getTopDonors(4)
      .then((donors) => { if (active) setTopDonors(donors) })
      .catch((error) => console.error('[Community] Failed to load top donors:', error))
      .finally(() => { if (active) setTopDonorsLoading(false) })

    loadTopDonors()
    const refreshTimer = window.setInterval(loadTopDonors, 15000)
    const refreshWhenVisible = () => { if (!document.hidden) loadTopDonors() }
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      active = false
      window.clearInterval(refreshTimer)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined
    let active = true
    let cleanup = () => {}
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
    setChatLoading(true)
    setChatError('')
    setSelectedId(id)
    setMessageInput('')
    setReplyingTo(null)
    setEditingMessage(null)
    setAttachedImages([])
  }

  function handleBackToGeneral() {
    setChatLoading(true)
    setChatError('')
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
      setChatSending(true)
      setChatError('')
      if (editingMessage) {
        const updated = await chatService.updateMessage(editingMessage.id, text, user.id)
        setAllMessages((prev) => ({
          ...prev,
          [selectedId]: (prev[selectedId] || []).map((message) => message.id === updated.id ? updated : message),
        }))
      } else {
        const sent = await chatService.sendMessage(roomId, text, user.id, replyingTo?.id || null, attachedImages)
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
    } finally {
      setChatSending(false)
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
    setAttachedImages([])
    setMessageInput(msg.text)
  }

  function handleCancelEdit() {
    setEditingMessage(null)
    setMessageInput('')
  }

  function handleAttachImages(e) {
    const files = Array.from(e.target.files || [])
    const invalidFile = files.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)
    if (invalidFile) {
      setChatError('Gunakan gambar JPG, PNG, atau WebP dengan ukuran maksimal 5MB.')
    } else if (attachedImages.length + files.length > 4) {
      setChatError('Maksimal 4 gambar per pesan.')
    } else if (files.length > 0) {
      setChatError('')
      setAttachedImages((prev) => [...prev, ...files])
    }
    // Reset so the same file can be selected again
    e.target.value = ''
  }

  function handleRemoveImage(index) {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const memberAvatars = (topDonors.length > 0 ? topDonors : donators).slice(0, 4)

  if (communitiesLoading || topDonorsLoading) {
    return <LoadingScreen message="Memuat komunitas dan Top Donatur..." />
  }

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
                        <MessageBody message={msg} onPreviewImage={setPreviewImage} />
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
                        <MessageBody message={msg} onPreviewImage={setPreviewImage} />
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

            {!isAuthenticated ? (
              <div className="chat-login-gate" role="status" aria-label="Login diperlukan untuk mengirim pesan">
                <span className="chat-login-gate-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="10" width="16" height="11" rx="3" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <span className="chat-login-gate-copy">
                  <strong>Masuk untuk bergabung dalam obrolan</strong>
                  <small>Silakan masuk atau daftar untuk mengirim pesan.</small>
                </span>
                <button
                  type="button"
                  className="chat-login-gate-button"
                  onClick={() => navigate('/login', { state: { returnTo: '/komunitas' } })}
                >
                  Masuk / Daftar
                </button>
              </div>
            ) : (
            <form className="chat-input-area" onSubmit={handleSend} aria-label="Kirim pesan">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
                    disabled={!isAuthenticated || chatLoading || chatSending}
                  />
                  <button
                    type="button"
                    className="chat-attach-btn"
                    aria-label="Lampirkan gambar"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isAuthenticated || chatLoading || chatSending || Boolean(editingMessage)}
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
                disabled={chatSending || (!messageInput.trim() && attachedImages.length === 0)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
            )}
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

    </main>

    {previewImage && (
      <div className="chat-image-preview" role="dialog" aria-modal="true" aria-label="Pratinjau gambar chat" onClick={() => setPreviewImage('')}>
        <div className="chat-image-preview-content" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="chat-image-preview-back" onClick={() => setPreviewImage('')}>
            <span aria-hidden="true">&#8592;</span> Kembali
          </button>
          <img src={previewImage} alt="Pratinjau lampiran chat" />
        </div>
      </div>
    )}

    <Footer />
  </>
)
}
