import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Generate S3 presigned URL and send it as a response for file downloads
export const sendPresignedUrlForDownload = async (req, res) => {
  try {
    const fileData = await getPresignedUrl('file-storage-aws', req.params.filename, 3600);
    res.json(fileData);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
