/**
 * Sanitization Engine — Zero-Trust Canvas-based EXIF Stripping
 *
 * Redraws image pixels onto a clean canvas, discarding ALL metadata.
 * Handles EXIF Orientation tags (values 1–8) so the output is always upright.
 */

/**
 * Applies EXIF orientation transforms to a canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} orientation - EXIF orientation value (1-8)
 * @param {number} width - original image width
 * @param {number} height - original image height
 */
function applyOrientationTransform(ctx, orientation, width, height) {
  switch (orientation) {
    case 2: // Mirrored horizontally
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3: // Rotated 180°
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4: // Mirrored vertically
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5: // Mirrored horizontally + rotated 270° CW
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6: // Rotated 90° CW
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7: // Mirrored horizontally + rotated 90° CW
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8: // Rotated 270° CW
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default: // case 1 or unknown — no transform
      break;
  }
}

/**
 * Strips all EXIF metadata from a single File by redrawing on canvas.
 * @param {File} file - The source image file
 * @param {number} orientation - EXIF Orientation value (1-8), default 1
 * @param {number} quality - JPEG quality (0.0 – 1.0), default 0.90
 * @returns {Promise<{blob: Blob, filename: string}>}
 */
export function stripMetadata(file, orientation = 1, quality = 0.90) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const { naturalWidth: w, naturalHeight: h } = img;

        // For orientations 5-8, canvas dimensions are swapped
        const swapped = orientation >= 5 && orientation <= 8;
        const canvasW = swapped ? h : w;
        const canvasH = swapped ? w : h;

        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;

        const ctx = canvas.getContext('2d');
        applyOrientationTransform(ctx, orientation, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('Canvas toBlob returned null'));
              return;
            }
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            resolve({ blob, filename: `${baseName}-clean.jpg` });
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Triggers a browser download of a blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
