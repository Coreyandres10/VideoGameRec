// auth.js
const axios = require("axios");

// Store your client ID and client secret

let accessToken = null;
let tokenExpirationTime = 0; // Store the timestamp when the token expires

// Function to generate a new access token
async function generateAccessToken(CLIENT_ID, CLIENT_SECRET) {
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    accessToken = response.data.access_token;
    // Calculate the token expiration time (current time + expires_in seconds)
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    console.log("Access token generated:", accessToken);
  } catch (error) {
    console.error("Error generating access token:", error);
  }
}

// Function to get a valid access token or generate a new one
async function getAccessToken(CLIENT_ID, CLIENT_SECRET) {
  // If the access token is not set or has expired, generate a new one
  if (!accessToken || Date.now() > tokenExpirationTime) {
    await generateAccessToken(CLIENT_ID, CLIENT_SECRET);
  }
  return accessToken;
}

module.exports = { getAccessToken };
