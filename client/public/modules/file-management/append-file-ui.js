// Add a new file entry to the UI after a file is uploaded
export default function appendUploadedFileToUI(fileName) {
  const uploadedFilesContainer = document.querySelector('.uploaded-files-container');

  const fileContainer = document.createElement('div');
  const fileItem = document.createElement('div');
  const uploadedFile = document.createElement('a');
  const actionButtonsContainer = document.createElement('div');
  const typeSubtext = document.createElement('div');
  const downloadButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const favouriteButton = document.createElement('button');

  fileContainer.className = 'file-container';
  fileItem.className = 'file-item';
  uploadedFile.className = 'uploaded-file';
  uploadedFile.href = `/preview/${fileName}`;
  typeSubtext.className = 'type-subtext';
  actionButtonsContainer.className = 'action-buttons-container';
  downloadButton.className = 'download-button';
  deleteButton.className = 'delete-file-button';
  favouriteButton.className = 'favourite-button';

  uploadedFile.textContent = fileName;
  typeSubtext.textContent = 'File';
  downloadButton.textContent = 'Download';
  deleteButton.textContent = 'Delete';
  favouriteButton.textContent = 'Add to favourites';

  fileContainer.appendChild(fileItem);
  fileItem.appendChild(uploadedFile);
  fileItem.appendChild(typeSubtext);
  fileItem.appendChild(actionButtonsContainer);
  actionButtonsContainer.appendChild(downloadButton);
  actionButtonsContainer.appendChild(deleteButton);
  actionButtonsContainer.appendChild(favouriteButton);

  uploadedFilesContainer.appendChild(fileContainer);
}
