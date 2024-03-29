import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import trackCurrentFolder from './utilities/session-folder-manager.js';
import handleFileFavourites from './modules/file-management/favourites-handler.js';
import handleFolderFavourites from './modules/folder-management/folder-favourites-handler.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

handleFileFavourites();
handleFolderFavourites();

trackCurrentFolder();
