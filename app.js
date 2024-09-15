// Import dependencies
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 8000; // Use environment variable for port

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logging HTTP requests
app.use(express.json()); // Parse JSON bodies

// Import routes
const router = require('./routes');
app.use('/api', router); // Prefix all routes with /api

// Load Swagger documentation
const swaggerDocs = YAML.load(path.join(__dirname, 'docs.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: "404 Not Found!"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: err.message
    });
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
