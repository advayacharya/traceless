/**
 * Hash Utilities — SHA-256 computation using the Web Crypto API.
 * 100% client-side, no external calls.
 */

/**
 * Computes SHA-256 hash of a File or Blob.
 * @param {File|Blob} fileOrBlob
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
export async function computeSHA256(fileOrBlob) {
  const buffer = await fileOrBlob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes SHA-256 for a File and returns both the hash and file info.
 * @param {File} file
 * @returns {Promise<{name: string, size: number, hash: string}>}
 */
export async function hashFile(file) {
  const hash = await computeSHA256(file);
  return {
    name: file.name,
    size: file.size,
    hash,
  };
}
