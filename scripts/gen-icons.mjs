// Generates PWA PNG icons from public/favicon.svg.
// Run: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const BG = '#0D141F' // matches theme-color / app background

// Extract just the <path> art from the favicon so we can recompose it,
// centered and padded, on a solid background for Android icon masks.
const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')

// The logo art lives in a 48x46 viewBox. We letterbox it into a square,
// scale it to `logoFrac` of the canvas, and center it on BG.
function iconSvg(logoFrac) {
  const S = 512
  const vbW = 48
  const vbH = 46
  const target = S * logoFrac
  const scale = target / Math.max(vbW, vbH)
  const w = vbW * scale
  const h = vbH * scale
  const x = (S - w) / 2
  const y = (S - h) / 2
  // Pull the inner markup out of the source <svg> wrapper.
  const inner = favicon.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${BG}"/>
  <g transform="translate(${x} ${y}) scale(${scale})">${inner}</g>
</svg>`
}

// "any" icons: modest padding. "maskable": logo kept well inside the 80% safe zone.
const any = Buffer.from(iconSvg(0.62))
const maskable = Buffer.from(iconSvg(0.5))

const jobs = [
  [any, 192, 'public/icon-192.png'],
  [any, 512, 'public/icon-512.png'],
  [maskable, 512, 'public/icon-512-maskable.png'],
  [any, 180, 'public/apple-touch-icon.png'],
]

for (const [buf, size, out] of jobs) {
  await sharp(buf).resize(size, size).png().toFile(new URL(`../${out}`, import.meta.url).pathname)
  console.log(`wrote ${out} (${size}x${size})`)
}
