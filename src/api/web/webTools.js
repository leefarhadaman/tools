const express = require('express');
const router = express.Router();
const { encode, decode } = require('html-entities');
const beautify = require('js-beautify');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const JavaScriptObfuscator = require('javascript-obfuscator');
const QRCode = require('qrcode');
const QRReader = require('qrcode-reader');
const Jimp = require('jimp');
const axios = require('axios');
const cheerio = require('cheerio');

const { AppError } = require('../../middleware/errorHandler');
const { validateRequiredFields, validateStringFields, validateURLField } = require('../../middleware/validation');
const { defaultLimiter, strictLimiter } = require('../../middleware/rateLimiter');

// HTML Encode/Decode
router.post('/html-encode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const encoded = encode(text);
            res.json({
                status: 'success',
                result: encoded
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/html-decode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const decoded = decode(text);
            res.json({
                status: 'success',
                result: decoded
            });
        } catch (error) {
            next(error);
        }
    }
);

// URL Encode/Decode
router.post('/url-encode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const encoded = encodeURIComponent(text);
            res.json({
                status: 'success',
                result: encoded
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/url-decode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const decoded = decodeURIComponent(text);
            res.json({
                status: 'success',
                result: decoded
            });
        } catch (error) {
            next(error);
        }
    }
);

// HTML Beautifier/Minifier
router.post('/html-beautify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const beautified = beautify.html(code, {
                indent_size: 2,
                wrap_line_length: 80,
                preserve_newlines: true,
                max_preserve_newlines: 2
            });
            res.json({
                status: 'success',
                result: beautified
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/html-minify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const minified = code.replace(/\s+/g, ' ')
                               .replace(/>\s+</g, '><')
                               .trim();
            res.json({
                status: 'success',
                result: minified
            });
        } catch (error) {
            next(error);
        }
    }
);

// CSS Beautifier/Minifier
router.post('/css-beautify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const beautified = beautify.css(code, {
                indent_size: 2
            });
            res.json({
                status: 'success',
                result: beautified
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/css-minify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const minified = new CleanCSS({
                level: 2,
                format: 'keep-breaks'
            }).minify(code);

            if (minified.errors.length > 0) {
                throw new AppError(`CSS Minification error: ${minified.errors.join(', ')}`, 400);
            }

            res.json({
                status: 'success',
                result: minified.styles,
                stats: minified.stats
            });
        } catch (error) {
            next(error);
        }
    }
);

// JavaScript Beautifier/Minifier
router.post('/js-beautify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const beautified = beautify.js(code, {
                indent_size: 2,
                space_in_empty_paren: true
            });
            res.json({
                status: 'success',
                result: beautified
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/js-minify',
    defaultLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const minified = UglifyJS.minify(code, {
                compress: {
                    dead_code: true,
                    drop_debugger: true,
                    drop_console: false
                }
            });

            if (minified.error) {
                throw new AppError(`JavaScript Minification error: ${minified.error.message}`, 400);
            }

            res.json({
                status: 'success',
                result: minified.code
            });
        } catch (error) {
            next(error);
        }
    }
);

// JavaScript Obfuscator/Deobfuscator
router.post('/js-obfuscate',
    strictLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const obfuscated = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                debugProtection: true,
                debugProtectionInterval: true,
                disableConsoleOutput: false,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: true,
                renameGlobals: false,
                selfDefending: true,
                simplify: true,
                splitStrings: true,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: false
            });
            res.json({
                status: 'success',
                result: obfuscated.getObfuscatedCode()
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/js-deobfuscate',
    strictLimiter,
    validateRequiredFields(['code']),
    validateStringFields(['code']),
    async (req, res, next) => {
        try {
            const { code } = req.body;
            if (code.length > 100000) {
                throw new AppError('Code too long. Maximum 100000 characters allowed.', 400);
            }
            const beautified = beautify.js(code, {
                indent_size: 2,
                space_in_empty_paren: true
            });
            res.json({
                status: 'success',
                result: beautified,
                warning: 'Full deobfuscation may not be possible for heavily obfuscated code'
            });
        } catch (error) {
            next(error);
        }
    }
);

// QR Code Generator/Decoder
router.post('/qr-generate',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 2000) {
                throw new AppError('Text too long. Maximum 2000 characters allowed.', 400);
            }
            const qr = await QRCode.toDataURL(text, {
                errorCorrectionLevel: 'H',
                margin: 4,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            res.json({
                status: 'success',
                result: qr
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/qr-decode',
    defaultLimiter,
    validateRequiredFields(['image']),
    validateStringFields(['image']),
    async (req, res, next) => {
        try {
            const { image } = req.body;
            if (!image.startsWith('data:image/')) {
                throw new AppError('Invalid image format. Base64 image data required.', 400);
            }

            const imageData = await Jimp.read(Buffer.from(image.split(',')[1], 'base64'));
            const qr = new QRReader();
            
            const value = await new Promise((resolve, reject) => {
                qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
                qr.decode(imageData.bitmap);
            });
            
            if (!value.result) {
                throw new AppError('No QR code found in the image', 400);
            }

            res.json({
                status: 'success',
                result: value.result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Facebook ID Finder
router.post('/find-facebook-id',
    strictLimiter,
    validateURLField('url'),
    async (req, res, next) => {
        try {
            const { url } = req.body;
            const response = await axios.get(url, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const $ = cheerio.load(response.data);
            const fbId = $('meta[property="al:android:url"]').attr('content')?.split('/')[3] ||
                        $('meta[property="fb:app_id"]').attr('content');
            
            if (!fbId) {
                throw new AppError('Facebook ID not found on the page', 404);
            }

            res.json({
                status: 'success',
                result: fbId
            });
        } catch (error) {
            if (error.response?.status === 404) {
                next(new AppError('Facebook page not found', 404));
            } else if (error.code === 'ECONNABORTED') {
                next(new AppError('Request timeout while accessing the Facebook page', 408));
            } else {
                next(error);
            }
        }
    }
);

module.exports = router; 