const http = require('http');

let jsonDataGET = {}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'music-application://desktop',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/track_info') {
    res.writeHead(200, {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    try {
      const data = require('fs').readFileSync('data.json', 'utf8');
      res.end(data);
    } catch (error) {
      console.error('Error getting track information:', error);
      res.end(JSON.stringify({error: 'Error getting track information'}));
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/update_data') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        // console.log(jsonData);
        jsonDataGET = jsonData
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Data received successfully'}));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Invalid JSON'}));
      }
    });
    return;
  }

  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: 'Not found'}));
});

const PORT = 19582;
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});


const getTrackInfo = () => {
  return jsonDataGET;
};

module.exports = getTrackInfo;
