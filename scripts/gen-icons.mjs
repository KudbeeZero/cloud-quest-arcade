import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

const NAVY = [11, 16, 33];
const YELLOW = [255, 214, 10];
const MAGENTA = [255, 46, 154];

const FONT = {
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  Q: ["01110", "10001", "10011", "10101", "10010", "10001", "01111"],
};

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeIcon(size) {
  const block = Math.floor(size / 13);
  const totalW = 11 * block;
  const totalH = 7 * block;
  const left = Math.floor((size - totalW) / 2);
  const top = Math.floor((size - totalH) / 2);
  const border = Math.max(2, Math.floor(block / 3));

  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = NAVY[0];
    rgba[i * 4 + 1] = NAVY[1];
    rgba[i * 4 + 2] = NAVY[2];
    rgba[i * 4 + 3] = 255;
  }

  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const o = (y * size + x) * 4;
    rgba[o] = color[0];
    rgba[o + 1] = color[1];
    rgba[o + 2] = color[2];
    rgba[o + 3] = 255;
  };

  const inCorner = (x, y) => {
    const cx = x < border * 2 || x >= size - border * 2;
    const cy = y < border * 2 || y >= size - border * 2;
    return cx && cy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const onEdge =
        x < border || x >= size - border || y < border || y >= size - border;
      if (onEdge && !inCorner(x, y)) set(x, y, MAGENTA);
    }
  }

  const letters = ["C", "Q"];
  letters.forEach((ch, li) => {
    const ox = left + li * 6 * block;
    const glyph = FONT[ch];
    for (let r = 0; r < glyph.length; r++) {
      for (let c = 0; c < glyph[r].length; c++) {
        if (glyph[r][c] === "1") {
          for (let by = 0; by < block; by++) {
            for (let bx = 0; bx < block; bx++) {
              set(ox + c * block + bx, top + r * block + by, YELLOW);
            }
          }
        }
      }
    }
  });

  return encodePng(size, size, rgba);
}

mkdirSync("public", { recursive: true });
writeFileSync("public/icon-192x192.png", makeIcon(192));
writeFileSync("public/icon-512x512.png", makeIcon(512));
console.log("Wrote public/icon-192x192.png and public/icon-512x512.png");
