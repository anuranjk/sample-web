const express = require('express');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const port = 3000;

// AWS Configuration
AWS.config.update({
    region: 'us-east-1', // Change to your desired region
});

const dynamoDB = new AWS.DynamoDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- API Routes ---

// POST /quotes - Save a new quote
app.post('/quotes', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Quote text is required' });
    }

    const quoteId = uuidv4();

    const params = {
        TableName: 'Quotes',
        Item: {
            'id': { S: quoteId },
            'text': { S: text },
        },
    };

    dynamoDB.putItem(params, (err, data) => {
        if (err) {
            console.error('Error saving quote to DynamoDB:', err);
            return res.status(500).json({ error: 'Could not save quote' });
        }
        res.status(201).json({ id: quoteId, text: text });
    });
});

// GET /quotes/random - Fetch a random quote
app.get('/quotes/random', (req, res) => {
    const params = {
        TableName: 'Quotes',
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error('Error fetching quotes from DynamoDB:', err);
            return res.status(500).json({ error: 'Could not fetch quotes' });
        }

        if (data.Items.length === 0) {
            return res.status(404).json({ error: 'No quotes found' });
        }

        const randomIndex = Math.floor(Math.random() * data.Items.length);
        const randomQuote = {
            id: data.Items[randomIndex].id.S,
            text: data.Items[randomIndex].text.S,
        };

        res.json(randomQuote);
    });
});

// --- Server --- 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
