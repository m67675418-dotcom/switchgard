require('dotenv').config();
const { google } = require('googleapis');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate authorization URL
exports.getAuthUrl = (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Ensures we get a refresh token
  });
  
  res.json({ authUrl });
};

// Handle callback from Google
exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // ✅ Save tokens to database or session here
    // For testing, just return them (don't do this in production!)
    res.json({ 
      message: 'Authentication successful!',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token // Save this securely!
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to authenticate', details: error.message });
  }
};

// Example: Get user's Gmail info
exports.getUserInfo = async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    res.json(profile.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};