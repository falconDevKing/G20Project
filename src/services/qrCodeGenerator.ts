import { G20PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import QRCode from "qrcode";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = import.meta.env.VITE_APP_AWS_REGION || "";
const Bucket = import.meta.env.VITE_APP_AWS_BUCKET || "";

const credentials = {
  accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY || "",
  secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_KEY || "",
};

const s3 = new S3Client({ region, credentials });

export const makeQrPngBlob = async (text: string) => {
  // Data URL → Blob
  const dataUrl = await QRCode.toDataURL(text, {
    width: 512,
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const res = await fetch(dataUrl);
  return await res.blob(); // image/png
};

const uploadQrCodePng = async (userId: string, pngBlob: Blob) => {
  const userStorageKey = `qr/${userId}.png`;
  const putCmd = new PutObjectCommand({
    Bucket,
    Key: userStorageKey,
    ContentType: "image/png",
  });

  const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: 900 });

  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: pngBlob,
  });

  return userStorageKey;
};

export const createG20UserQRCode = async (userData: G20PartnerRowType): Promise<any> => {
  try {
    const userId = userData.id;
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
    const url = baseUrl + "/g20-partner/" + userId;

    const pngBlob = await makeQrPngBlob(url);
    const storageKey = await uploadQrCodePng(userId, pngBlob);

    const QRCodeImageUrl = "https://ohip-public.s3.eu-west-1.amazonaws.com/" + storageKey;

    return QRCodeImageUrl;
  } catch (error) {
    console.log("Runtime error", error);
    throw error;
  }
};
