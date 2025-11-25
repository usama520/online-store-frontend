/**
 * Chunked MD5 checksum generation utility
 * Reads files in chunks to handle large files efficiently
 */

// MD5 implementation (simplified version for browser)
// Note: Web Crypto API doesn't support MD5, so we use a pure JS implementation

class MD5 {
  private h: number[];
  private totalLength: number;
  private buffer: Uint8Array;
  private bufferLength: number;

  constructor() {
    this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    this.totalLength = 0;
    this.buffer = new Uint8Array(64);
    this.bufferLength = 0;
  }

  private leftRotate(value: number, amount: number): number {
    return (value << amount) | (value >>> (32 - amount));
  }

  private addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  private F(x: number, y: number, z: number): number {
    return (x & y) | (~x & z);
  }

  private G(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z);
  }

  private H(x: number, y: number, z: number): number {
    return x ^ y ^ z;
  }

  private I(x: number, y: number, z: number): number {
    return y ^ (x | ~z);
  }

  private FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.F(b, c, d), x), ac));
    return this.addUnsigned(this.leftRotate(a, s), b);
  }

  private GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.G(b, c, d), x), ac));
    return this.addUnsigned(this.leftRotate(a, s), b);
  }

  private HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.H(b, c, d), x), ac));
    return this.addUnsigned(this.leftRotate(a, s), b);
  }

  private II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.I(b, c, d), x), ac));
    return this.addUnsigned(this.leftRotate(a, s), b);
  }

  private convertToWordArray(data: Uint8Array): number[] {
    const wordArray: number[] = [];
    let i = 0;
    while (i < data.length) {
      wordArray.push(
        (data[i++] << 0) |
        (data[i++] << 8) |
        (data[i++] << 16) |
        (data[i++] << 24)
      );
    }
    return wordArray;
  }

  private wordToHex(value: number): string {
    let word = '';
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 0xff;
      word += byte.toString(16).padStart(2, '0');
    }
    return word;
  }

  private transform(data: Uint8Array): void {
    const a = this.h[0];
    const b = this.h[1];
    const c = this.h[2];
    const d = this.h[3];

    const x = this.convertToWordArray(data);

    // Round 1
    let aa = this.FF(a, b, c, d, x[0], 7, 0xd76aa478);
    let dd = this.FF(d, aa, b, c, x[1], 12, 0xe8c7b756);
    let cc = this.FF(c, dd, aa, b, x[2], 17, 0x242070db);
    let bb = this.FF(b, cc, dd, aa, x[3], 22, 0xc1bdceee);
    aa = this.FF(aa, bb, cc, dd, x[4], 7, 0xf57c0faf);
    dd = this.FF(dd, aa, bb, cc, x[5], 12, 0x4787c62a);
    cc = this.FF(cc, dd, aa, bb, x[6], 17, 0xa8304613);
    bb = this.FF(bb, cc, dd, aa, x[7], 22, 0xfd469501);
    aa = this.FF(aa, bb, cc, dd, x[8], 7, 0x698098d8);
    dd = this.FF(dd, aa, bb, cc, x[9], 12, 0x8b44f7af);
    cc = this.FF(cc, dd, aa, bb, x[10], 17, 0xffff5bb1);
    bb = this.FF(bb, cc, dd, aa, x[11], 22, 0x895cd7be);
    aa = this.FF(aa, bb, cc, dd, x[12], 7, 0x6b901122);
    dd = this.FF(dd, aa, bb, cc, x[13], 12, 0xfd987193);
    cc = this.FF(cc, dd, aa, bb, x[14], 17, 0xa679438e);
    bb = this.FF(bb, cc, dd, aa, x[15], 22, 0x49b40821);

    // Round 2
    aa = this.GG(aa, bb, cc, dd, x[1], 5, 0xf61e2562);
    dd = this.GG(dd, aa, bb, cc, x[6], 9, 0xc040b340);
    cc = this.GG(cc, dd, aa, bb, x[11], 14, 0x265e5a51);
    bb = this.GG(bb, cc, dd, aa, x[0], 20, 0xe9b6c7aa);
    aa = this.GG(aa, bb, cc, dd, x[5], 5, 0xd62f105d);
    dd = this.GG(dd, aa, bb, cc, x[10], 9, 0x2441453);
    cc = this.GG(cc, dd, aa, bb, x[15], 14, 0xd8a1e681);
    bb = this.GG(bb, cc, dd, aa, x[4], 20, 0xe7d3fbc8);
    aa = this.GG(aa, bb, cc, dd, x[9], 5, 0x21e1cde6);
    dd = this.GG(dd, aa, bb, cc, x[14], 9, 0xc33707d6);
    cc = this.GG(cc, dd, aa, bb, x[3], 14, 0xf4d50d87);
    bb = this.GG(bb, cc, dd, aa, x[8], 20, 0x455a14ed);
    aa = this.GG(aa, bb, cc, dd, x[13], 5, 0xa9e3e905);
    dd = this.GG(dd, aa, bb, cc, x[2], 9, 0xfcefa3f8);
    cc = this.GG(cc, dd, aa, bb, x[7], 14, 0x676f02d9);
    bb = this.GG(bb, cc, dd, aa, x[12], 20, 0x8d2a4c8a);

    // Round 3
    aa = this.HH(aa, bb, cc, dd, x[5], 4, 0xfffa3942);
    dd = this.HH(dd, aa, bb, cc, x[8], 11, 0x8771f681);
    cc = this.HH(cc, dd, aa, bb, x[11], 16, 0x6d9d6122);
    bb = this.HH(bb, cc, dd, aa, x[14], 23, 0xfde5380c);
    aa = this.HH(aa, bb, cc, dd, x[1], 4, 0xa4beea44);
    dd = this.HH(dd, aa, bb, cc, x[4], 11, 0x4bdecfa9);
    cc = this.HH(cc, dd, aa, bb, x[7], 16, 0xf6bb4b60);
    bb = this.HH(bb, cc, dd, aa, x[10], 23, 0xbebfbc70);
    aa = this.HH(aa, bb, cc, dd, x[13], 4, 0x289b7ec6);
    dd = this.HH(dd, aa, bb, cc, x[0], 11, 0xeaa127fa);
    cc = this.HH(cc, dd, aa, bb, x[3], 16, 0xd4ef3085);
    bb = this.HH(bb, cc, dd, aa, x[6], 23, 0x4881d05);
    aa = this.HH(aa, bb, cc, dd, x[9], 4, 0xd9d4d039);
    dd = this.HH(dd, aa, bb, cc, x[12], 11, 0xe6db99e5);
    cc = this.HH(cc, dd, aa, bb, x[15], 16, 0x1fa27cf8);
    bb = this.HH(bb, cc, dd, aa, x[2], 23, 0xc4ac5665);

    // Round 4
    aa = this.II(aa, bb, cc, dd, x[0], 6, 0xf4292244);
    dd = this.II(dd, aa, bb, cc, x[7], 10, 0x432aff97);
    cc = this.II(cc, dd, aa, bb, x[14], 15, 0xab9423a7);
    bb = this.II(bb, cc, dd, aa, x[5], 21, 0xfc93a039);
    aa = this.II(aa, bb, cc, dd, x[12], 6, 0x655b59c3);
    dd = this.II(dd, aa, bb, cc, x[3], 10, 0x8f0ccc92);
    cc = this.II(cc, dd, aa, bb, x[10], 15, 0xffeff47d);
    bb = this.II(bb, cc, dd, aa, x[1], 21, 0x85845dd1);
    aa = this.II(aa, bb, cc, dd, x[8], 6, 0x6fa87e4f);
    dd = this.II(dd, aa, bb, cc, x[15], 10, 0xfe2ce6e0);
    cc = this.II(cc, dd, aa, bb, x[6], 15, 0xa3014314);
    bb = this.II(bb, cc, dd, aa, x[13], 21, 0x4e0811a1);
    aa = this.II(aa, bb, cc, dd, x[4], 6, 0xf7537e82);
    dd = this.II(dd, aa, bb, cc, x[11], 10, 0xbd3af235);
    cc = this.II(cc, dd, aa, bb, x[2], 15, 0x2ad7d2bb);
    bb = this.II(bb, cc, dd, aa, x[9], 21, 0xeb86d391);

    this.h[0] = this.addUnsigned(this.h[0], aa);
    this.h[1] = this.addUnsigned(this.h[1], bb);
    this.h[2] = this.addUnsigned(this.h[2], cc);
    this.h[3] = this.addUnsigned(this.h[3], dd);
  }

  update(chunk: Uint8Array): void {
    this.totalLength += chunk.length;

    let offset = 0;
    while (offset < chunk.length) {
      const spaceInBuffer = 64 - this.bufferLength;
      const bytesToCopy = Math.min(spaceInBuffer, chunk.length - offset);

      this.buffer.set(chunk.subarray(offset, offset + bytesToCopy), this.bufferLength);
      this.bufferLength += bytesToCopy;
      offset += bytesToCopy;

      if (this.bufferLength === 64) {
        this.transform(this.buffer);
        this.bufferLength = 0;
      }
    }
  }

  finalize(): string {
    const bitLength = this.totalLength * 8;

    // Append padding bit (0x80)
    this.buffer[this.bufferLength] = 0x80;
    this.bufferLength++;

    // If we don't have room for the length (8 bytes), pad and transform
    if (this.bufferLength > 56) {
      // Fill rest of buffer with zeros
      this.buffer.fill(0, this.bufferLength);
      this.transform(this.buffer);
      this.bufferLength = 0;
    }

    // Fill buffer with zeros up to position 56
    this.buffer.fill(0, this.bufferLength, 56);

    // Append bit length as 64-bit little-endian integer
    // MD5 uses little-endian for the length
    for (let i = 0; i < 8; i++) {
      this.buffer[56 + i] = (bitLength >>> (i * 8)) & 0xff;
    }

    this.transform(this.buffer);

    // Convert to hex string
    return (
      this.wordToHex(this.h[0]) +
      this.wordToHex(this.h[1]) +
      this.wordToHex(this.h[2]) +
      this.wordToHex(this.h[3])
    );
  }
}

/**
 * Generate MD5 checksum for a file using chunked reading
 * @param file - The file to generate checksum for
 * @param chunkSize - Size of chunks to read (default: 1MB)
 * @returns Promise that resolves to Base64-encoded MD5 hash
 */
export async function generateMD5Checksum(
  file: File,
  chunkSize: number = 1024 * 1024
): Promise<string> {
  const md5 = new MD5();
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    md5.update(uint8Array);
    offset += chunkSize;
  }

  const hexHash = md5.finalize();

  // Convert hex to base64
  const hexBytes = hexHash.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
  const binaryString = String.fromCharCode(...hexBytes);
  return btoa(binaryString);
}

