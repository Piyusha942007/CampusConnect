/**
 * ONE-TIME SETUP: Run this script to authorize Google Drive access.
 * It will open a URL — sign in with your Google account and paste the code back here.
 */
require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/oauth2callback' // Redirect URI (not actually used, we copy the code manually)
);

// Generate the authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',       // Gets a refresh token
  prompt: 'consent',            // Force consent to always get refresh token
  scope: ['https://www.googleapis.com/auth/drive.file'],
});

console.log('\n🔑 Google Drive Authorization Setup\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with your Google account');
console.log('3. Click "Allow" to grant Drive access');
console.log('4. You will be redirected to a page (it may show an error - that\'s OK!)');
console.log('5. Copy the "code" parameter from the URL bar');
console.log('   (The URL will look like: http://localhost:5000/oauth2callback?code=THIS_PART&scope=...)');
console.log('\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Paste the authorization code here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ SUCCESS! Here is your refresh token:\n');
    console.log(tokens.refresh_token);
    console.log('\n📋 Add this line to your .env file:\n');
    console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\nDone! You can now upload files to Google Drive. 🚀');
  } catch (err) {
    console.error('\n❌ Error getting token:', err.message);
    console.error('Make sure you copied the full code from the URL.');
  }
  rl.close();
});
