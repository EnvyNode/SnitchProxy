const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Simulated Proxy Database
const proxyDatabase = [
  '123.45.67.89:8080',
  '98.76.54.32:3128',
  '192.168.1.1:8000'
];

// Generate Proxies
app.get('/generate', (req, res) => {
  res.json(proxyDatabase);
});

// Check Proxy
app.post('/check', async (req, res) => {
  const { proxy } = req.body;
  try {
    const response = await axios.get('https://httpbin.org/ip', {
      proxy: {
        host: proxy.split(':')[0],
        port: parseInt(proxy.split(':')[1])
      },
      timeout: 5000
    });
    res.json({ status: `Proxy is working. Your IP: ${response.data.origin}` });
  } catch (err) {
    res.json({ status: 'Proxy is not working.' });
  }
});

// Serve Frontend
app.use(express.static(__dirname));

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
