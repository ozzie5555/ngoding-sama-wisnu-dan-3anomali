import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer'
import './Home.css'

const services=[
  ['order-delivered.svg','Donasi Online','Isi Form Donasi','lime'],
  ['analyze-data.svg','Informasi & Wawasan','Pelajari Lebih Lanjut','mint'],
  ['content-media-folder.svg','Dokumentasi','Lihat Dokumentasi','blue'],
  ['diversity-unity.svg','Komunitas','Lihat Komunitas','cyan'],
]
const items=[
  ['girl-doing-shopping-with-cart-2194198-0.svg','Barang Bekas','lime'],
  ['shopping-2194208-0.svg','Pakaian Layak','blue'],
  ['student-studying.svg','Buku & ATK Bekas','cyan'],
  ['girl-doing-paiting-on-the-canvas-2194214-0.svg','Karya Hasil Daur Ulang','mint'],
]
const partners=[
  ['sedekas semarang barat 1.svg','Sedekas','Komunitas di Semarang Barat yang mengumpulkan dan menyalurkan barang bekas layak pakai untuk membantu yang membutuhkan.','Jl. Simongan No. 69, Ngemplak Simongan, Semarang Barat, Kota Semarang, 50148','@sedekas'],
  ['dipo waste bank 1.svg','Dipo Waste Bank','Bank sampah di lingkungan kampus UNDIP yang menampung sampah terpilah untuk dikelola menjadi tabungan nasabah.','Tempat Pengelolaan Sampah Terpadu (TPST) UNDIP, Universitas Diponegoro, Tembalang, Semarang','@dipowastebank'],
  ['Panji AL JANNAH 1.svg','Panti Asuhan Al Jannah','Panti Asuhan Al Jannah adalah panti asuhan di Semarang yang membina anak yatim, piatu, dan dhuafa melalui pendidikan serta pembinaan tahfidz Al-Qur’an.','Jl. Tapak No. 53, Tugurejo, Tugu, Kota Semarang, Jawa Tengah','@pantialjannah'],
  ['Panti asuhan kristen tanah putih 1.svg','Panti Asuhan Kristen Tanah Putih','Panti asuhan yang membina anak-anak yatim dan kurang mampu lewat pendidikan, ibadah, dan kegiatan sosial.','Jl. Dr. Wahidin No. 14, Jomblang, Kec. Candisari, Kota Semarang, Jawa Tengah 50256, Indonesia','@pantiasuhankristentanahputih'],
]
const reviews=[
  ['User 03C.svg','Jennifer O.G','Donasi','Proses donasinya mudah dan transparan. Senang rasanya mengetahui barang yang sudah tidak saya gunakan bisa bermanfaat bagi orang lain.'],
  ['User 05c.svg','Komunitas Hijau Semarang','Komunitas','KEMBALI berhasil menghubungkan banyak orang yang ingin berbagi. Semoga gerakan seperti ini terus berkembang.'],
  ['User 03C.svg','Jennifer O.G','Donasi','Proses donasinya mudah dan transparan. Senang rasanya mengetahui barang yang sudah tidak saya gunakan bisa bermanfaat.'],
  ['User 05c.svg','Andrew Young','Penerima Donasi','Saya mendapatkan perlengkapan sekolah yang masih sangat layak pakai. Terima kasih kepada KEMBALI dan para donatur.'],
]
const stats=[['12.400+','Barang Tersirkulasi'],['2.000 kg','Sampah Dikurangi'],['4.680 kg','CO2 Dihemat'],['1.500+','Pengguna Aktif']]

function Heading({eyebrow,title,accent,sub,preAccent}){return <header className="section-heading">{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2>{preAccent&&<em>{preAccent} </em>}{title}{accent&&<em> {accent}</em>}</h2>{sub&&<p>{sub}</p>}</header>}
function PartnerGrid(){return <div className="partner-grid">{partners.map(([image,name,desc,address,handle])=><article className="partner-card" key={name}><img src={'/'+image} alt="" /><h3>{name}</h3><p>{desc}</p><div className="partner-meta"><address>{address}</address><span>{handle}</span></div></article>)}</div>}
function AnimatedStat({value}){
  const ref=useRef(null)
  const [display,setDisplay]=useState('0')

  useEffect(()=>{
    const target=Number(value.replace(/\D/g,''))
    const suffix=value.includes('kg')?' kg':value.includes('+')?'+':''
    const format=number=>`${new Intl.NumberFormat('id-ID').format(number)}${suffix}`
    let frame

    const animate=()=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setDisplay(format(target));return}
      const started=performance.now()
      const tick=now=>{
        const progress=Math.min((now-started)/1600,1)
        setDisplay(format(Math.round(target*(1-Math.pow(1-progress,3)))))
        if(progress<1) frame=requestAnimationFrame(tick)
      }
      frame=requestAnimationFrame(tick)
    }

    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){observer.disconnect();animate()}},{threshold:.35})
    observer.observe(ref.current)
    return()=>{observer.disconnect();cancelAnimationFrame(frame)}
  },[value])

  return <strong ref={ref}>{display}</strong>
}

export default function Home(){
  const [article,setArticle]=useState(0)
  const articles=[
    {title:'Kebaikan Kecil untuk Bumi',date:'Semarang, 18 Juni 2026',image:'/ecology.svg'},
    {title:'Ide Daur Ulang Sampah',date:'Semarang, 24 Juli 2026',image:'/recycle.svg'},
    {title:'Berita Ekonomi Sirkular',date:'Jakarta, 29 April 2026',image:'/ecology.svg'},
  ]
  const visibleArticles=[0,1,2].map(offset=>articles[(article+offset)%articles.length])
  return <main className="home">
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy"><span className="outline-pill">Donasikan Barang Bekas & Karya Daur Ulangmu!</span><h1><em>Jangan Buang!</em> Beri Kesempatan<span className="desktop-break"><br/></span> Kedua untuk Barangmu!</h1><p><strong>KEMBALI</strong> menghubungkan <strong>donatur</strong> dengan penerima<span className="desktop-break"><br/></span> <strong>manfaat</strong>, menyelamatkan barang layak pakai dari tempat<span className="desktop-break"><br/></span> sampah dan memberikan dampak nyata bagi lingkungan.</p><div className="actions"><Link className="button primary" to="/donasi">Mulai Donasi Sekarang <b>→</b></Link><a className="button secondary" href="#layanan">Hubungi Kami</a></div></div>
        <img className="hero-art" src="/HEROSECTION_1_VECTOR.svg" alt="Orang-orang berbagi barang layak pakai" />
      </div>
      <div className="landscape" aria-hidden="true"><i/><i/><i/><i/></div>
    </section>

    <section className="impact"><div className="stat-grid">{stats.map(([n,l])=><article key={l}><AnimatedStat value={n}/><span>{l}</span></article>)}</div><div className="impact-copy"><h2>Dampak Positif<br/>Untuk <em>Bumi</em></h2><p>Mengurangi sampah, menghemat sumber daya, dan menciptakan dampak positif bagi bumi melalui penggunaan kembali barang layak pakai.</p></div></section>

    <section className="insight" id="insight"><Heading title="Seputar Tentang" accent="KEMBALI" sub="Temukan berita terbaru, artikel inspiratif, tips gaya hidup berkelanjutan, serta berbagai informasi mengenai program dan dampak KEMBALI."/><div className="article-carousel"><button aria-label="Artikel sebelumnya" onClick={()=>setArticle((article+articles.length-1)%articles.length)}>‹</button><div className="article-window">{visibleArticles.map((item,index)=><article className={index===1?'is-featured':''} key={`${item.title}-${index}`}><div><small>{item.date}</small><h3>{item.title}</h3><p>KEMBALI Insight<br/>By - Anonymous</p><a href="#artikel">Visit Now</a></div><img src={item.image} alt="" /></article>)}</div><button aria-label="Artikel berikutnya" onClick={()=>setArticle((article+1)%articles.length)}>›</button></div><div className="dots">{articles.map((item,index)=><i key={item.title} className={article===index?'active':''}/>)}</div></section>

    <section className="services" id="layanan"><Heading eyebrow="Kami Menyediakan yang Anda Butuhkan" title="Layanan untuk" accent="Anda" sub="Kami Selalu Memberikan Layanan yang Terbaik"/><div className="service-grid">{services.map(([img,title,action,color],i)=><article className="service-card" key={title}><div className={'art-blob '+color}><img src={'/'+img} alt="" /></div><h3>{title}</h3>{i===0?<button disabled title="Form donasi belum tersedia">{action}<span>Segera hadir</span></button>:<a href={i===3?'#komunitas':'#insight'}>{action}<b>→</b></a>}</article>)}</div></section>

    <section className="testimonials"><Heading eyebrow="Segala Masukan Sangat Berarti untuk Kami" title="Ulasan" accent="Pengguna" sub="Bersama Menciptakan Perubahan"/><div className="review-board"><div className="review-track review-row-one">{[...reviews, ...reviews].map(([avatar,name,role,text],i)=><article key={`first-${i}`}><header><img src={'/'+avatar} alt="" /><div><h3>{name}</h3><span>{role}</span></div></header><p>“{text}”</p></article>)}</div><div className="review-track review-row-two">{[...reviews, ...reviews].reverse().map(([avatar,name,role,text],i)=><article key={`second-${i}`}><header><img src={'/'+avatar} alt="" /><div><h3>{name}</h3><span>{role}</span></div></header><p>“{text}”</p></article>)}</div></div></section>

    <section className="steps"><h2>Bagaimana Cara<br/><em>Berdonasi?</em></h2><p className="steps-intro">Ikuti langkah-langkah berikut untuk melakukan donasi online melalui KEMBALI.</p><div className="step-grid">{[['Cari Kebutuhan','Temukan barang yang sedang dibutuhkan oleh komunitas.'],['Isi Form Donasi','Lengkapi informasi barang dan data diri dengan mudah.'],['Konfirmasi','Periksa kembali detail donasi dan konfirmasi pengajuan.'],['Tracking Donasi','Pantau proses donasi hingga sampai ke penerima.']].map(([t,d],i)=><article key={t}><b>{i+1}</b><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></section>

    <section className="donatable"><Heading eyebrow="Beri Kehidupan Kedua untuk Barangmu!" preAccent="Barang" title={<>yang Bisa<br/>Anda Donasikan</>} sub="Barang apa saja yang bisa didonasikan melalui KEMBALI?"/><div className="item-grid">{items.map(([img,title,color])=><article key={title}><div className={'art-blob '+color}><img src={'/'+img} alt="" /></div><h3>{title}</h3></article>)}</div></section>

    <section className="partners" id="komunitas"><Heading eyebrow="Berkenalan dengan Komunitas Kami" title="Partner Kami" sub="Kami bekerja sama dengan berbagai komunitas."/><PartnerGrid/></section>

    <div className="dark-band">
      <section className="final-cta"><img src="/jumping-2194230-0.svg" alt="" /><div><span className="outline-pill">Melakukan Kebaikan untuk Bumi & Sesama</span><h2>Mari Berdonasi & Jelajahi<br/>Komunitas Kami!</h2><p><strong>KEMBALI</strong> menghubungkan <strong>donatur</strong> dengan <strong>penerima manfaat</strong>, menyelamatkan barang layak pakai dari tempat sampah dan memberikan dampak nyata bagi lingkungan.</p><div className="actions"><Link className="button primary" to="/donasi">Mulai Donasi Sekarang →</Link><a className="button dark-outline" href="#steps">▶ &nbsp; Pelajari Lebih Lanjut</a></div></div><img src="/order-delivered.svg" alt="" /></section>
      <section className="impact-banner"><div><h2>Siap Memberikan Kehidupan<br/>Kedua untuk Barangmu?</h2><p>Salurkan barang layak pakai ke komunitas yang membutuhkan hanya dalam beberapa langkah mudah.</p></div><div className="mini-stats">{stats.map(([n,l])=><article key={l}><strong>{n}</strong><span>{l}</span></article>)}</div><img src="/Donation Streamline Bruxelles.svg" alt="" /></section>
    </div>
    <Footer/>
  </main>
}
