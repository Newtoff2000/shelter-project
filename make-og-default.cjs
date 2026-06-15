// Generates web/public/og-default.png — the 1200×630 fallback share-preview
// card used by pages without their own cover photo (homepage + coverless
// animals). Self-contained: only Node built-ins (zlib), no image deps.
//
// Design: brand sand background, centred coral heart enclosing two white paw
// dots — the Ericeira Paws mark. Re-run with `node make-og-default.cjs` to
// regenerate after a brand-colour change.
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const W = 1200
const H = 630

// Brand palette (see DESIGN.md §2)
const SAND = [245, 240, 235]
const CORAL = [255, 87, 87]
const WHITE = [255, 255, 255]

// RGBA framebuffer
const px = Buffer.alloc(W * H * 4)
function set(x, y, [r, g, b], a = 255) {
  if (x < 0 || y < 0 || x >= W || y >= H) return
  const i = (y * W + x) * 4
  // simple alpha-over onto whatever's there
  const ia = a / 255
  px[i] = Math.round(px[i] * (1 - ia) + r * ia)
  px[i + 1] = Math.round(px[i + 1] * (1 - ia) + g * ia)
  px[i + 2] = Math.round(px[i + 2] * (1 - ia) + b * ia)
  px[i + 3] = 255
}

// Fill sand background
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) set(x, y, SAND)

// Heart via implicit curve, centred. Normalised coords (u,v) around centre.
const cx = W / 2
const cy = H / 2 - 20
const scale = 190 // heart radius-ish in px
function inHeart(u, v) {
  // classic heart: (x^2 + y^2 - 1)^3 - x^2*y^3 <= 0, y pointing up
  const x = u
  const y = -v
  const a = x * x + y * y - 1
  return a * a * a - x * x * y * y * y <= 0
}
for (let y = cy - scale * 1.4; y < cy + scale * 1.4; y++) {
  for (let x = cx - scale * 1.4; x < cx + scale * 1.4; x++) {
    const u = (x - cx) / scale
    const v = (y - cy) / scale
    if (inHeart(u, v)) set(Math.round(x), Math.round(y), CORAL)
  }
}

// Two white paw dots (main pad + toes) sitting inside the heart's lobes
function paw(px0, py0, s) {
  // main pad
  fillCircle(px0, py0 + s * 0.9, s * 0.9, WHITE)
  // three toes
  fillCircle(px0 - s * 0.85, py0, s * 0.42, WHITE)
  fillCircle(px0, py0 - s * 0.35, s * 0.46, WHITE)
  fillCircle(px0 + s * 0.85, py0, s * 0.42, WHITE)
}
function fillCircle(ox, oy, r, color) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) set(Math.round(ox + x), Math.round(oy + y), color)
    }
  }
}
paw(cx - 70, cy - 10, 34)
paw(cx + 70, cy - 10, 34)

// --- PNG encode (truecolour+alpha, single IDAT, zlib) ---
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0)
  return Buffer.concat([len, typeBuf, data, crc])
}
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return c ^ 0xffffffff
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // colour type RGBA
// rest 0 (compression/filter/interlace)

// add filter byte (0) per scanline
const raw = Buffer.alloc(H * (W * 4 + 1))
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0
  px.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4)
}
const idat = zlib.deflateSync(raw, { level: 9 })

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
])

const out = path.join(__dirname, 'web', 'public', 'og-default.png')
fs.writeFileSync(out, png)
console.log(`wrote ${out} (${W}×${H}, ${png.length} bytes)`)
