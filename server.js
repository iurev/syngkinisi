const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3001;
const clientSecret = process.env.CLIENT_SECRET || 'LZL$8Y$7zhR2s+2x*&I787qu$Bs4Rbm(';
const redirectUri = process.env.REDIRECT_URI || "https://supreme-enigma-6r67xw54g62xq9j-3001.app.github.dev/";
const clientId = process.env.CLIENT_ID || 'PrD4niU8Npk4l3C5Bn';

const apiBase = 'https://api.ticktick.com/open/v1';

// Endpoint to handle authorization
app.get('/authorize', (req, res) => {
  const authUrl = `https://ticktick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  res.redirect(authUrl);
});

// Endpoint to get the token
app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.post('https://ticktick.com/oauth/token', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a task
app.post('/task', async (req, res) => {
  const { token, taskData } = req.body;
  try {
    const response = await axios.post(`${apiBase}/task`, taskData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.error(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
