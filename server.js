const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize Express application
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const databasePath = path.join(__dirname, 'Product.json');

function readDatabase() {
    const data = fs.readFileSync(databasePath);
    return JSON.parse(data).products;
}

function writeDatabase(data) {
    fs.writeFileSync(databasePath, JSON.stringify({ products: data }, null, 2));
}

app.get('/products', (req, res) => {
    const data = readDatabase();
    res.json(data);
});

app.get('/products/:id', (req, res) => {
    const data = readDatabase();
    const product = data.find(p => p.id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.post('/products', (req, res) => {
    const data = readDatabase();
    const newProduct = req.body;
    data.push(newProduct);
    writeDatabase(data);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const data = readDatabase();
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        writeDatabase(data);
        res.json(data[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(3000, () => {
    console.log('API running on http://localhost:3000');
});

