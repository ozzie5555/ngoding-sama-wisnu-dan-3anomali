import { supabase } from '../../../lib/supabase/client'
import { articlesData, newsData } from '../../../data/insightData'

const articleSlugs = [
  'ide-daur-ulang-sampah',
  'donasi-barang-bekas-menjadi-manfaat',
  'ekonomi-sirkular-sumber-daya',
  'cara-berdonasi-aman-dan-tepat',
]
const newsSlugs = [
  'gempa-nagekeo-2026',
  'beri-kesempatan-kedua-untuk-barangmu',
  'bank-sampah-infrastruktur-resmi',
]

const categoryLabels = {
  artikel_edukasi: ['Education', 'Environment'],
  hasil_riset: ['Economy', 'Environment'],
  recycle_upcycle: ['Recycle', 'Environment'],
  berita_lingkungan: ['News', 'Environment'],
}

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)).toUpperCase()
  : ''

export const FALLBACK_ARTICLES = articlesData.map((article, index) => ({
  ...article,
  slug: articleSlugs[index],
  contentType: 'article',
}))

export const FALLBACK_NEWS = newsData.map((article, index) => ({
  ...article,
  slug: newsSlugs[index],
  contentType: article.isFeatured ? 'promo' : 'news',
}))

function mapArticle(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    categories: row.tags?.length ? row.tags : (categoryLabels[row.category] || ['Insight']),
    date: formatDate(row.published_at || row.created_at),
    detailDate: formatDate(row.published_at || row.created_at),
    author: `By ${row.author_name || 'KEMBALI'}`,
    source: row.author_name || 'KEMBALI',
    image: row.cover_path || '/insight/article-01.svg',
    excerpt: row.excerpt,
    paragraphs: row.content.split(/\n\s*\n/).filter(Boolean),
    contentType: row.content_type,
    isFeatured: row.is_featured,
    ctaText: row.cta_text || (row.content_type === 'promo' ? 'Donasi Sekarang' : 'Visit Now'),
    ctaLink: row.cta_link,
    isDatabaseArticle: true,
  }
}

const ARTICLE_SELECT = 'id, title, slug, content, excerpt, cover_path, category, tags, content_type, author_name, is_featured, cta_text, cta_link, is_published, published_at, created_at'

export const articleService = {
  async getPublished() {
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(mapArticle)
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? mapArticle(data) : null
  },
}
