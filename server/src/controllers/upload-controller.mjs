import path from 'path';
import sanitize from 'sanitize-filename';
import { db } from '../services/database.mjs';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import {
  storeFileInformation,
  fetchLastFileUploaded,
} from '../models/files.mjs';

// Check if the name of a file or folder already exists in the database, if it does, modify it
const handleDuplicateNames = async (uploadedName, table, column, userId) => {
  const query = `SELECT f.${column} FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [uploadedName, userId], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        reject('Database error.');
      } else if (row) {
        const timestamp = `-${Date.now()}`;

        // File name already exists, modify the filename
        if (table === 'files') {
          let nameCopy = uploadedName.replace(/(\.[^\.]+)$/, `${timestamp}$1`);
          resolve(nameCopy);
        } else {
          // If table being queried is not 'files' (which means it is a folder), append timestamp directly to the end of the name, without looking for a file extension
          let nameCopy = `${uploadedName}${timestamp}`;
          resolve(nameCopy);
        }
      } else {
        // No duplicate found, use the original filename
        resolve(uploadedName);
      }
    });
  });
};

// Handle file uploads to S3
const uploadFile = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    let fileName = sanitize(req.file.originalname);

    // Check and modify file name if it's a duplicate
    fileName = await handleDuplicateNames(fileName, table, column, userId);

    // Upload file and its info to S3
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
      },
    });

    await uploader.done();

    // Retrieve file information on upload
    const folderName = req.body.folderName;
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
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    const files = req.files;
    let uploadedFiles = [];

    // Store files uploaded from a folder in S3
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = sanitize(file.originalname);

      // Check and modify file name if it's a duplicate
      fileName = await handleDuplicateNames(fileName, table, column, userId);

      const uploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
        },
      });

      await uploader.done();

      // Retrieve file metadata
      const folderName = sanitize(req.body['folderName' + i]);
      const fileSizeBytes = file.size;
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      // Convert file size from bytes to megabytes
      const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

      // Store the metadata for each file uploaded in the database
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

export { handleDuplicateNames, uploadFile, uploadFolder };
