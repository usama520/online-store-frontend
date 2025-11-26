/**
 * Chunked MD5 checksum generation utility
 * Uses spark-md5 for a well-tested implementation.
 *
 * NOTE:
 * Active Storage expects the checksum to be a Base64-encoded MD5 digest
 * of the file's raw bytes (Digest::MD5.base64digest on the Rails side).
 */
import SparkMD5 from "spark-md5";

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
  const spark = new SparkMD5.ArrayBuffer();
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    spark.append(arrayBuffer);
    offset += chunkSize;
  }

  // spark-md5: end(true) returns a raw binary string (16-byte digest),
  // which we then Base64-encode so it matches Rails' Digest::MD5.base64digest
  const binaryDigest = spark.end(true);
  return btoa(binaryDigest);
}

