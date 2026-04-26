require('dotenv').config();
const { google } = require('googleapis');
const stream = require('stream');

async function testUpload() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Step 1: Create a "CampusConnect Proofs" folder (app-owned, so drive.file scope works)
    console.log('Creating "CampusConnect Proofs" folder...');
    const folder = await drive.files.create({
      requestBody: {
        name: 'CampusConnect Proofs',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });
    const folderId = folder.data.id;
    console.log('Folder created! ID:', folderId);

    // Step 2: Upload a test file into that folder
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from('Hello from CampusConnect! Test upload successful.'));

    console.log('Uploading test file...');
    const response = await drive.files.create({
      requestBody: {
        name: `test-upload-${Date.now()}.txt`,
        parents: [folderId],
      },
      media: {
        mimeType: 'text/plain',
        body: bufferStream,
      },
      fields: 'id, webViewLink',
    });

    console.log('\n✅ UPLOAD SUCCESS!');
    console.log('File ID:', response.data.id);
    console.log('View Link:', response.data.webViewLink);
    console.log('\n📋 Update your .env with this folder ID:');
    console.log(`DRIVE_FOLDER_ID=${folderId}`);
    console.log('\nCheck your Google Drive — you should see the folder and test file! 🎉');
  } catch (error) {
    console.error('\n❌ UPLOAD FAILED:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testUpload();
