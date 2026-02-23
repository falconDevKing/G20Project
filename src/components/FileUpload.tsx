import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadData } from "aws-amplify/storage";
import { useState, useEffect, useCallback } from "react";
import { getFileUrl } from "@/services/storage";

interface FileUploadProps {
  user_id?: string;
  filePath?: string;
  onChange: (filePath: string) => void;
  size?: "small" | "large";
}

export const FileUpload = ({ user_id, filePath, onChange, size = "large" }: FileUploadProps) => {
  const [fileUrl, setFileUrl] = useState<string>();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const fileExtension = file.name.split(".").at(-1);

      if (file) {
        const uploadedPicture = await uploadData({
          path: `profile-pictures/${user_id}/${new Date().toISOString()}.${fileExtension}`,
          data: file,
        }).result;

        const profilePicturePath = uploadedPicture.path;

        onChange(profilePicturePath);
      }
    },
    [onChange, user_id],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  useEffect(() => {
    const updateFileUrl = async () => {
      const fileUrl = await getFileUrl(filePath as string);
      setFileUrl(fileUrl);
    };

    if (filePath) {
      updateFileUrl();
    }
  }, [filePath]);

  return (
    <div {...getRootProps()} className="file-upload relative cursor-pointer flex flex-col items-center">
      <input {...getInputProps()} />

      {/* Box Background */}
      {size === "large" ? (
        <div className={`p-2 md:p-3 lg:p-6 w-full bg-GGP-lightWight rounded-lg flex items-center justify-center h-64`}>
          {/* Circle Avatar Inside */}
          <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-[350px] lg:h-[350px] rounded-full bg-white flex items-center justify-center overflow-hidden">
            {filePath ? (
              <img
                src={fileUrl}
                alt="uploaded"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "")} // Fallback Image
              />
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={35} className="text-gray-600/90" />
                <div className="file-upload_label text-center">
                  <p className="text-[14px]">
                    <span className="text-blue-500">Click to upload</span> or drag and drop
                  </p>
                  <p>SVG, PNG, JPG or GIF (max 800x400)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-4 md:p-3 lg:p-6 w-full bg-GGP-lightWight rounded-lg flex items-center justify-center h-40`}>
          <div className=" flex items-center justify-center overflow-hidden">
            {filePath ? (
              <img
                src={fileUrl}
                alt="uploaded"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "")} // Fallback Image
              />
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={35} className="text-gray-600/90" />
                <div className="file-upload_label text-center">
                  <p className="text-[14px]">
                    <span className="text-blue-500">Click to upload</span> or drag and drop
                  </p>
                  <p>Clear Image or PDf (max 10 MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
