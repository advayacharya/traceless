/**
 * EXIF Parsing Engine — Wraps exifreader and categorizes extracted tags.
 */
import ExifReader from 'exifreader';

/**
 * Converts EXIF GPS DMS (Degrees, Minutes, Seconds) array to decimal degrees.
 * @param {number[]} dmsArray - [degrees, minutes, seconds]
 * @param {string} ref - 'N', 'S', 'E', or 'W'
 * @returns {number} Decimal degree value
 */
export function dmsToDecimal(dmsArray, ref) {
  if (!dmsArray || dmsArray.length < 3) return null;
  const [deg, min, sec] = dmsArray;
  let decimal = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

/**
 * Reads a File and extracts categorised EXIF metadata.
 * @param {File} file
 * @returns {Promise<Object>} Parsed and categorised metadata
 */
export async function parseExifData(file) {
  const arrayBuffer = await file.arrayBuffer();
  let tags;
  try {
    tags = ExifReader.load(arrayBuffer, { expanded: true });
  } catch {
    return {
      raw: {},
      identity: {},
      location: null,
      technical: {},
      orientation: 1,
      hasGps: false,
    };
  }

  const exif = tags.exif || {};
  const gps = tags.gps || {};

  // ── Identity ──
  const identity = {
    make: exif.Make?.description || null,
    model: exif.Model?.description || null,
    software: exif.Software?.description || null,
    lensModel: exif.LensModel?.description || null,
    artist: exif.Artist?.description || null,
    copyright: exif.Copyright?.description || null,
    ownerName: exif.OwnerName?.description || exif.CameraOwnerName?.description || null,
    serialNumber: exif.BodySerialNumber?.description || exif.SerialNumber?.description || null,
  };

  // ── Location ──
  let location = null;
  let hasGps = false;

  if (gps.Latitude && gps.Longitude) {
    hasGps = true;
    location = {
      latitude: gps.Latitude,
      longitude: gps.Longitude,
      altitude: gps.Altitude ?? null,
      latitudeRef: gps.LatitudeRef || null,
      longitudeRef: gps.LongitudeRef || null,
    };
  }

  // ── Technical ──
  const technical = {
    fNumber: exif.FNumber?.description || null,
    exposureTime: exif.ExposureTime?.description || null,
    iso: exif.ISOSpeedRatings?.description || exif.PhotographicSensitivity?.description || null,
    focalLength: exif.FocalLength?.description || null,
    dateTimeOriginal: exif.DateTimeOriginal?.description || null,
    imageWidth: exif.PixelXDimension?.description || exif.ImageWidth?.description || null,
    imageHeight: exif.PixelYDimension?.description || exif.ImageLength?.description || null,
    colorSpace: exif.ColorSpace?.description || null,
    flash: exif.Flash?.description || null,
    whiteBalance: exif.WhiteBalance?.description || null,
    meteringMode: exif.MeteringMode?.description || null,
    exposureProgram: exif.ExposureProgram?.description || null,
  };

  // ── Orientation ──
  const orientation = exif.Orientation?.value || 1;

  return {
    raw: tags,
    identity,
    location,
    technical,
    orientation,
    hasGps,
  };
}
