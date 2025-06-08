const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { configureMiddleware } = require('./config/middleware');
const { errorMiddleware } = require('./middleware/errorHandler');

const textRoutes = require('./api/text/textRoutes');
const imageRoutes = require('./api/image/imageRoutes');
const calculatorRoutes = require('./api/calculator/calculatorRoutes');
const converterRoutes = require('./api/converter/converterRoutes');
const binaryRoutes = require('./api/binary/binaryRoutes');
const devRoutes = require('./api/dev/devRoutes');
const webRoutes = require('./api/web/webTools');
const otherRoutes = require('./api/other/otherTools');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Apply middleware
configureMiddleware(app);

// Routes
app.use('/api/text', textRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/converter', converterRoutes);
app.use('/api/binary', binaryRoutes);
app.use('/api/dev', devRoutes);
app.use('/api/web', webRoutes);
app.use('/api/other', otherRoutes);

// API Documentation route
app.get('/api/docs', (req, res) => {
    res.json({
        status: 'success',
        version: '1.0.0',
        endpoints: {
            web: {
                'html-encode': 'POST /api/web/html-encode',
                'html-decode': 'POST /api/web/html-decode',
                'url-encode': 'POST /api/web/url-encode',
                'url-decode': 'POST /api/web/url-decode',
                'html-beautify': 'POST /api/web/html-beautify',
                'html-minify': 'POST /api/web/html-minify',
                'css-beautify': 'POST /api/web/css-beautify',
                'css-minify': 'POST /api/web/css-minify',
                'js-beautify': 'POST /api/web/js-beautify',
                'js-minify': 'POST /api/web/js-minify',
                'js-obfuscate': 'POST /api/web/js-obfuscate',
                'js-deobfuscate': 'POST /api/web/js-deobfuscate',
                'qr-generate': 'POST /api/web/qr-generate',
                'qr-decode': 'POST /api/web/qr-decode',
                'find-facebook-id': 'POST /api/web/find-facebook-id'
            },
            other: {
                'md5-generate': 'POST /api/other/md5-generate',
                'my-ip': 'GET /api/other/my-ip',
                'ip-lookup': 'POST /api/other/ip-lookup',
                'base64-encode': 'POST /api/other/base64-encode',
                'base64-decode': 'POST /api/other/base64-decode',
                'color-convert': 'POST /api/other/color-convert',
                'generate-password': 'POST /api/other/generate-password',
                'vtt-to-srt': 'POST /api/other/vtt-to-srt',
                'srt-to-vtt': 'POST /api/other/srt-to-vtt',
                'youtube-thumbnail': 'POST /api/other/youtube-thumbnail',
                'hex-to-rgb': 'POST /api/other/hex-to-rgb',
                'rgb-to-hex': 'POST /api/other/rgb-to-hex'
            }
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        error: 'Endpoint not found'
    });
});

// Error handling middleware
app.use(...errorMiddleware);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api/docs`);
});
