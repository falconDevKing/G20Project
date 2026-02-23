import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import SupabaseClient from "@/supabase/supabaseConnection";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const region = import.meta.env.VITE_APP_AWS_REGION || "";
const Bucket = import.meta.env.VITE_APP_AWS_BUCKET || "";

const credentials = {
  accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY || "",
  secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_KEY || "",
};

const s3 = new S3Client({ region, credentials });

export interface MailingMediaRow {
  id: string;
  media_name: string;
  media_url: string;
  division_id: string;
  uploader_id: string;
  uploader_name: string;
  created_at: string;
  updated_at: string;
}

export interface MailingMediaInsert {
  media_name: string;
  media_url: string;
  division_id: string;
  uploader_id: string;
  uploader_name: string;
}

/**
 * Uploads an image file to S3 and returns the public URL
 */
export const uploadMediaAsset = async (file: File, divisionId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_"); // Sanitize filename
    const userStorageKey = `GenericMailing/${divisionId || "noDivision"}/${sanitizedFileName}.${fileExtension}`;

    const putCmd = new PutObjectCommand({
      Bucket,
      Key: userStorageKey,
      ContentType: file.type,
    });

    const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: 900 });

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const publicUrl = `https://ohip-public.s3.eu-west-1.amazonaws.com/${userStorageKey}`;
    return publicUrl;
  } catch (error) {
    console.log("S3 upload error", error);
    throw error;
  }
};

/**
 * Checks if a media name already exists for a given division
 */
export const checkDuplicateMediaName = async (mediaName: string, divisionId: string): Promise<boolean> => {
  try {
    const { data, error } = await SupabaseClient.from("mailing_media").select("id").eq("media_name", mediaName).eq("division_id", divisionId).limit(1);

    if (error) {
      console.log("Supabase duplicate check error", error);
      throw error;
    }

    return (data && data.length > 0) || false;
  } catch (error) {
    console.log("Runtime error checking duplicate", error);
    throw error;
  }
};

/**
 * Creates a new media asset record in Supabase
 */
export const createMediaAsset = async (mediaData: MailingMediaInsert): Promise<MailingMediaRow> => {
  try {
    const { data, error }: PostgrestSingleResponse<MailingMediaRow[]> = await SupabaseClient.from("mailing_media").insert([mediaData]).select();

    if (error) {
      console.log("Supabase insert error", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Media asset creation failed: No data returned.");
    }

    return data[0];
  } catch (error) {
    console.log("Runtime error creating media asset", error);
    throw error;
  }
};

/**
 * Fetches all media assets for a given division, ordered by created_at descending
 */
export const fetchMediaAssets = async (divisionId: string): Promise<MailingMediaRow[]> => {
  try {
    const { data, error }: PostgrestSingleResponse<MailingMediaRow[]> = await SupabaseClient.from("mailing_media")
      .select("*")
      .eq("division_id", divisionId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase fetch error", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.log("Runtime error fetching media assets", error);
    throw error;
  }
};
