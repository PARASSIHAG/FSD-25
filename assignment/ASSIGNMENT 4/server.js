import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'requests.json');

// Middleware to parse JSON and serve static frontend files
app.use(express.json());
app.use(express.static('public'));

// Ensure requests.json exists
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]');
}

// Helper functions for reading and writing data
const getRequests = () => JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
const saveRequests = (data) => fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

// GET /api/requests - Get all requests
app.get('/api/requests', (req, res) => {
    res.json(getRequests());
});

// GET /api/requests/:id - Get a specific request
app.get('/api/requests/:id', (req, res) => {
    const requests = getRequests();
    const found = requests.find(r => r.id == req.params.id);
    found ? res.json(found) : res.status(404).send('Request not found');
});

// POST /api/requests - Submit a new request
app.post('/api/requests', (req, res) => {
    const requests = getRequests();
    const newRequest = { id: Date.now(), ...req.body };
    requests.push(newRequest);
    saveRequests(requests);
    res.status(201).json(newRequest);
});

// PUT /api/requests/:id - Update a request
app.put('/api/requests/:id', (req, res) => {
    const requests = getRequests();
    const index = requests.findIndex(r => r.id == req.params.id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...req.body };
        saveRequests(requests);
        res.json(requests[index]);
    } else {
        res.status(404).send('Request not found');
    }
});

// DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', (req, res) => {
    let requests = getRequests();
    requests = requests.filter(r => r.id != req.params.id);
    saveRequests(requests);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));