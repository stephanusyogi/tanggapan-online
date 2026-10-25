import fs from "fs/promises";
import path from "path";

const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".pdf"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB limit

/**
 * Save an uploaded File to public/storage/<folderRel>/<timestamp>_<filename>
 * Returns relative path stored in database (e.g. "upload/response_new/1730..._ktp.jpg")
 */
export async function saveUploadedFile(file: File, folderRel: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} melebihi batas maksimal 2MB.`);
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    throw new Error(`Format file ${file.name} tidak diizinkan. Gunakan JPG, PNG, atau PDF.`);
  }

  // Clean original file name
  const cleanOriginalName = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 50);

  const fileName = `${Date.now()}_${cleanOriginalName}${ext}`;
  const targetDir = path.join(process.cwd(), "public", "storage", folderRel);

  // Ensure target folder exists
  await fs.mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(targetPath, buffer);

  // Return relative path matching Laravel storage structure:
  // e.g. "upload/response_new/173000_file.jpg"
  return `${folderRel.replace(/\\/g, "/")}/${fileName}`;
}

/**
 * Save base64 signature data URL to public/storage/upload/signature/signature_<timestamp>.png
 * Returns relative path "upload/signature/signature_<timestamp>.png"
 */
export async function saveBase64Signature(base64Data: string): Promise<string> {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let buffer: Buffer;

  if (matches && matches.length === 3) {
    buffer = Buffer.from(matches[2], "base64");
  } else {
    // Try raw base64 or comma-separated
    const commaIdx = base64Data.indexOf(",");
    const raw = commaIdx >= 0 ? base64Data.slice(commaIdx + 1) : base64Data;
    buffer = Buffer.from(raw, "base64");
  }

  const fileName = `signature_${Date.now()}.png`;
  const targetDir = path.join(process.cwd(), "public", "storage", "upload", "signature");
  await fs.mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);
  await fs.writeFile(targetPath, buffer);

  return `upload/signature/${fileName}`;
}
