#!/usr/bin/env node
/**
 * Kural Studio — one-time Google OAuth2 refresh-token bootstrap.
 *
 * Run this LOCALLY (never in the VPS container) once, to obtain a refresh
 * token for YOUR Google Drive account. studio-server.js then uses that
 * refresh token (as GOOGLE_OAUTH_REFRESH_TOKEN) to upload/read images
 * without ever needing you to log in again.
 *
 * Prerequisites (see docs/KURAL_STUDIO_SETUP.md for the full walkthrough):
 *   1. Create an OAuth 2.0 Client ID (type: Desktop app) in Google Cloud
 *      Console, with the Drive API enabled on the project.
 *   2. Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET below or
 *      as environment variables before running this script.
 *
 * Usage:
 *   GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... node server/get-refresh-token.js
 */
const readline = require("readline");
const { createOAuth2Client } = require("./drive-client.js");

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET before running this script.");
  process.exit(1);
}

// drive.file — only lets the app see/manage files IT creates, not your whole Drive.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const oauth2Client = createOAuth2Client({ clientId, clientSecret, refreshToken: undefined });
oauth2Client.redirectUri = "urn:ietf:wg:oauth:2.0:oob:auto";

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\n1. Open this URL in a browser and sign in with the Google account whose Drive you want to use:\n");
console.log(authUrl);
console.log("\n2. After approving, Google will show you an authorization code (or redirect with ?code=... if you set up a redirect URI).");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("\n3. Paste the authorization code here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    if (!tokens.refresh_token) {
      console.error(
        "\nNo refresh_token was returned. This usually means the account already granted this app " +
          "consent before. Revoke access at https://myaccount.google.com/permissions and try again."
      );
      process.exit(1);
    }
    console.log("\nSuccess! Set this in the VPS .env file (never commit it):\n");
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error("\nFailed to exchange the authorization code:", err.message);
    process.exit(1);
  }
});
