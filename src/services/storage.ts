import { getUrl } from "aws-amplify/storage";

export const getFileUrl = async (filePath: string) => {
  const fileUrl = await getUrl({
    path: filePath,
    options: {
      expiresIn: 3600,
    },
  });

  return fileUrl.url.toString();
};
