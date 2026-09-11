import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const logoPath = path.join(root, "public/Creative_logo-200.svg")
const iconsDir = path.join(root, "public/icons")

const THEME_COLOR = "#644698"
const ACCENT_COLOR = "#df3d8f"
const BACKGROUND_COLOR = "#0a0a0f"

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

async function createIcon(size, maskable = false) {
  const padding = maskable ? Math.round(size * 0.2) : Math.round(size * 0.12)
  const logoSize = size - padding * 2
  const logo = await sharp(logoPath).resize(logoSize, logoSize, { fit: "contain" }).png().toBuffer()

  const background = maskable
    ? await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: THEME_COLOR,
        },
      })
        .png()
        .toBuffer()
    : await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 10, g: 10, b: 15, alpha: 1 },
        },
      })
        .png()
        .toBuffer()

  return sharp(background)
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toBuffer()
}

async function createOgImage() {
  const width = 1200
  const height = 630
  const logo = await sharp(logoPath).resize(220, 220, { fit: "contain" }).png().toBuffer()

  const gradientSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${THEME_COLOR}" />
          <stop offset="45%" stop-color="${ACCENT_COLOR}" />
          <stop offset="100%" stop-color="${BACKGROUND_COLOR}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <text x="80" y="360" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">
        Creative Organization DAO
      </text>
      <text x="80" y="430" fill="#f3f4f6" font-family="Arial, Helvetica, sans-serif" font-size="30">
        Governance for creators, culture, and treasury
      </text>
      <text x="80" y="520" fill="#d1d5db" font-family="Arial, Helvetica, sans-serif" font-size="24">
        dao.creativeplatform.xyz
      </text>
    </svg>
  `

  const base = await sharp(Buffer.from(gradientSvg)).png().toBuffer()

  return sharp(base)
    .composite([{ input: logo, top: 120, left: 80 }])
    .png()
    .toBuffer()
}

async function main() {
  await ensureDir(iconsDir)

  const [icon192, icon512, icon512Maskable, appleTouch, ogImage] = await Promise.all([
    createIcon(192),
    createIcon(512),
    createIcon(512, true),
    createIcon(180),
    createOgImage(),
  ])

  await Promise.all([
    writeFile(path.join(iconsDir, "icon-192.png"), icon192),
    writeFile(path.join(iconsDir, "icon-512.png"), icon512),
    writeFile(path.join(iconsDir, "icon-512-maskable.png"), icon512Maskable),
    writeFile(path.join(iconsDir, "apple-touch-icon.png"), appleTouch),
    writeFile(path.join(root, "public/og-image.png"), ogImage),
  ])

  console.log("Generated PWA icons and OG image from Creative_logo-200.svg")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
