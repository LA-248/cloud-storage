import { db } from "../services/database.mjs";

// Retrieve file data and send it as a response for both the download and preview functionalities
export const retrieveFileData = (req, res) => {
  const query = 'SELECT f.fileData FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], (err, row) => {
    if (err) {
      res.status(500).send('Database error.');
    } else {
      res.send(row.fileData);
    }
  });
};
