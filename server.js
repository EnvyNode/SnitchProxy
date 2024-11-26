const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Generate Random Proxies
function generateRandomProxies(count) {
  const proxies = [];
  for (let i = 0; i < count; i++) {
    const ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    const port = Math.floor(Math.random() * 65535) + 1;
    proxies.push(`${ip}:${port}`);
  }
  return proxies;
}

// Proxy Generator Endpoint
app.get('/generate', (req, res) => {
  const count = parseInt(req.query.count, 10) || 10;
  const proxies = generateRandomProxies(count);
  const fileContent = proxies.join('\n');
  const filePath = './proxies.txt';

  fs.writeFileSync(filePath, fileContent);
  res.download(filePath, 'proxies.txt', () => {
    fs.unlinkSync(filePath); // Delete file after download
  });
});

// Proxy Checker Endpoint
app.post('/check', async (req, res) => {
  const { proxies } = req.body;
  const results = [];

  for (const proxy of proxies) {
    try {
      const [host, port] = proxy.split(':');
      await axios.get('https://httpbin.org/ip', {
        proxy: { host, port: parseInt(port, 10) },
        timeout: 5000,
      });
      results.push({ proxy, status: 'Working' });
    } catch {
      results.push({ proxy, status: 'Not Working' });
    }
  }

  res.json(results);
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
