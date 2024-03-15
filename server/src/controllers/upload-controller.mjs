import path from 'path';
import sanitize from 'sanitize-filename';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import {
  storeFileInformation,
  fetchLastFileUploaded,
} from '../models/files.mjs';

// Handle file uploads to S3
const uploadFile = async (req, res) => {
  const uploader = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.BUCKET_NAME,
      Key: req.file.originalname,
      Body: req.file.buffer,
    },
  });

  try {
    await uploader.done();

    // Retrieve user and file information on upload
    const userId = req.user.id;
    const folderName = req.body.folderName;
    const fileName = sanitize(req.file.originalname);
    const fileSizeBytes = req.file.size;
    const fileExtension = path.extname(fileName);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';

    // Convert file size from bytes to megabytes
    const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

    // Store relevant file information in database
    storeFileInformation(
      userId,
      folderName,
      fileName,
      fileSize,
      fileExtension,
      isFavourite,
      shared,
      deleted
    );
    fetchLastFileUploaded(userId);

    console.log(`File ${fileName} uploaded successfully`);
    res.status(200).json({ userId: userId, fileName: fileName });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send('Error uploading file.');
  }
};

// Upload files that exist within a folder
const uploadFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;
    let uploadedFiles = [];

    // Store files uploaded from a folder in S3
    // Retrieve the relevant metadata and then store it in the database
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
        },
      });

      await uploader.done();

      const fileName = sanitize(file.originalname);
      const folderName = sanitize(req.body['folderName' + i]);
      const fileSizeBytes = file.size;
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      // Convert file size from bytes to megabytes
      const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

      storeFileInformation(
        userId,
        folderName,
        fileName,
        fileSize,
        fileExtension,
        isFavourite,
        shared,
        deleted
      );
      fetchLastFileUploaded(userId);

      // Push the name of each file into an array
      uploadedFiles.push(fileName);
    }

    res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('There was an error uploading your folder contents.');
  }
};

export { uploadFile, uploadFolder };
