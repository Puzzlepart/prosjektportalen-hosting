/**
 * Generate placeholder thumbnail images (16:9) for every package under
 * `packages/`. Produces a real PNG (no external dependencies — uses Node's
 * built-in `zlib`) with a deterministic two-tone "card" look derived from the
 * package name, so each template gets a distinct, recognizable image to start
 * with.
 *
 * Usage:
 *   node scripts/generate-placeholder-thumbnails.js            # all packages
 *   node scripts/generate-placeholder-thumbnails.js --force    # overwrite existing
 *   node scripts/generate-placeholder-thumbnails.js --name=pp-byggprosjekt
 *
 * Replace the generated files with real artwork before publishing a package.
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const WIDTH = 640
const HEIGHT = 360
const HEADER_HEIGHT = 96
const ACCENT_HEIGHT = 6

const PACKAGES_DIR = path.resolve(__dirname, '..', 'packages')

// ---- minimal PNG encoder (RGB, 8-bit, color type 2) ------------------------

const CRC_TABLE = (() => {
  const table = new Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buffer) {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([length, typeBuffer, data, crc])
}

function encodePng(width, height, colorAt) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor (RGB)
  // 10..12 = compression / filter / interlace = 0

  const raw = Buffer.alloc((width * 3 + 1) * height)
  let offset = 0
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0 // filter type: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = colorAt(x, y)
      raw[offset++] = r
      raw[offset++] = g
      raw[offset++] = b
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// ---- color helpers ---------------------------------------------------------

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function buildPalette(name) {
  const hue = hashString(name) % 360
  return {
    header: hslToRgb(hue, 0.55, 0.32),
    accent: hslToRgb(hue, 0.7, 0.55),
    body: hslToRgb(hue, 0.35, 0.92)
  }
}

// ---- main ------------------------------------------------------------------

function generateForPackage(packageName) {
  const { header, accent, body } = buildPalette(packageName)
  const png = encodePng(WIDTH, HEIGHT, (x, y) => {
    if (y < HEADER_HEIGHT) return header
    if (y < HEADER_HEIGHT + ACCENT_HEIGHT) return accent
    return body
  })
  const outPath = path.join(PACKAGES_DIR, packageName, 'thumbnail.png')
  fs.writeFileSync(outPath, png)
  return outPath
}

function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const nameArg = args.find((a) => a.startsWith('--name='))
  const only = nameArg ? nameArg.substring('--name='.length) : null

  const packageNames = fs
    .readdirSync(PACKAGES_DIR)
    .filter((name) => fs.statSync(path.join(PACKAGES_DIR, name)).isDirectory())
    .filter((name) => !only || name === only)

  for (const packageName of packageNames) {
    const target = path.join(PACKAGES_DIR, packageName, 'thumbnail.png')
    const exists = fs.existsSync(target)
    const isPlaceholderText =
      exists && fs.statSync(target).size < 1024 && fs.readFileSync(target).indexOf(0x89) !== 0
    if (exists && !force && !isPlaceholderText) {
      console.log(`• ${packageName}: thumbnail.png already exists (use --force to overwrite)`)
      continue
    }
    const out = generateForPackage(packageName)
    console.log(`✓ ${packageName}: wrote ${path.relative(process.cwd(), out)}`)
  }
}

main()
