const { google } = require('googleapis');
const fs = require('fs');
const stream = require('stream');

/**
 * Get OAuth2 client using the user's refresh token (NOT service account)
 * This uploads to the USER's personal Google Drive (15GB free)
 */
const getOAuth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  });
  return oauth2Client;
};

/**
 * Upload a file to Google Drive using OAuth (personal account)
 * @param {Object} file - Multer file object (from diskStorage)
 * @returns {{ id: string, webViewLink: string }}
 */
const uploadFileToDrive = async (file) => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: 'v3', auth });

  const folderId = process.env.DRIVE_FOLDER_ID;

  // Read file from disk (multer diskStorage)
  let body;
  if (file.path) {
    body = fs.createReadStream(file.path);
  } else if (file.buffer) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    body = bufferStream;
  }

  console.log(`Uploading "${file.originalname}" to Google Drive...`);

  const requestBody = {
    name: `${Date.now()}-${file.originalname}`,
  };
  // Only set parents if we have a folder ID
  if (folderId) {
    requestBody.parents = [folderId];
  }

  const response = await drive.files.create({
    requestBody,
    media: {
      mimeType: file.mimetype,
      body,
    },
    fields: 'id, webViewLink',
  });

  // Make file viewable by anyone with the link
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Clean up local temp file
  if (file.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  console.log(`✅ Uploaded to Drive: ${response.data.webViewLink}`);
  return response.data;
};

module.exports = { uploadFileToDrive };
