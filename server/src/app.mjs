import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './config/passport-setup.mjs';
import { db } from '../src/services/database.mjs';

import uploads from './routes/upload.mjs';
import getFiles from './routes/display-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';
import deleteFolder from './routes/delete-folder.mjs';
import download from './routes/download.mjs';
import preview from './routes/preview.mjs';
import favourites from './routes/favourites.mjs';
import login from './routes/login.mjs';
import logout from './routes/logout.mjs';
import createFolder from './routes/create-folder.mjs';
import viewFolder from './routes/view-folder.mjs';
import viewSharedFile from './routes/view-shared-file.mjs';
import createUuid from './routes/create-uuid.mjs';
import deleteUuid from './routes/delete-uuid.mjs';
import fetchSharedStatus from './routes/fetch-shared-status.mjs';
import displaySharedFiles from './routes/display-shared-files.mjs';
import viewPublicFolder from './routes/public-folder.mjs';

const app = express();
const port = 3000;

// Enables the app to parse JSON payloads in incoming requests
app.use(express.json());

app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());

// Attach routes
app.use('/', uploads);
app.use('/', getFiles);
app.use('/', deleteFile);
app.use('/', deleteFolder);
app.use('/', download);
app.use('/', preview);
app.use('/', favourites);
app.use('/', login);
app.use('/', logout);
app.use('/', createFolder);
app.use('/', viewFolder);
app.use('/', viewSharedFile);
app.use('/', createUuid);
app.use('/', deleteUuid);
app.use('/', fetchSharedStatus);
app.use('/', displaySharedFiles);
app.use('/', viewPublicFolder);

app.use(express.static('../../client/public'));

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/home`);
});
