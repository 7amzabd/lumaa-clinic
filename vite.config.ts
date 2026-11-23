import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { site } from './src/content/site.ts'

/** يحوّل النص إلى صيغة آمنة داخل وسوم HTML */
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * إضافة صغيرة: تملأ عنوان الصفحة ووصفها وبيانات المشاركة في index.html
 * من ملف المحتوى src/content/site.ts، فلا تحتاج إلى تعديل HTML يدويًا.
 * (محركات البحث وواتساب لا تشغّل JavaScript، لذلك نكتبها في HTML نفسه)
 */
function siteMetaPlugin(): Plugin {
  const values: Record<string, string> = {
    __SITE_TITLE__: site.meta.title.ar,
    __SITE_DESCRIPTION__: site.meta.description.ar,
    __SITE_NAME__: site.brand.name.ar,
    __SITE_URL__: site.meta.siteUrl.replace(/\/$/, ''),
    __SITE_OG_ALT__: site.meta.ogImageAlt.ar,
    __SITE_ROBOTS__: site.meta.noIndex ? 'noindex, nofollow' : 'index, follow',
  }

  return {
    name: 'lumaa-site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html
        for (const [placeholder, value] of Object.entries(values)) {
          result = result.replaceAll(placeholder, escapeHtml(value))
        }
        return result
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetaPlugin()],
})
