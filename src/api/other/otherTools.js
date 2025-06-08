const express = require('express');
const router = express.Router();
const crypto = require('crypto-js');
const geoip = require('geoip-lite');
const convert = require('color-convert');
const vttToSrt = require('vtt-to-srt');
const srtToVtt = require('srt-to-vtt');
const axios = require('axios');
const { Readable } = require('stream');

const { AppError } = require('../../middleware/errorHandler');
const { 
    validateRequiredFields, 
    validateStringFields, 
    validateNumberFields,
    validateHexColor,
    validateRGBColor,
    validatePasswordOptions,
    validateURLField
} = require('../../middleware/validation');
const { defaultLimiter, strictLimiter } = require('../../middleware/rateLimiter');

// MD5 Generator
router.post('/md5-generate',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const hash = crypto.MD5(text).toString();
            res.json({
                status: 'success',
                result: hash
            });
        } catch (error) {
            next(error);
        }
    }
);

// What Is My IP & IP Address Lookup
router.get('/my-ip',
    defaultLimiter,
    (req, res, next) => {
        try {
            const ip = req.headers['x-forwarded-for'] || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress;
            
            if (!ip) {
                throw new AppError('Could not determine IP address', 400);
            }

            res.json({
                status: 'success',
                result: ip.split(',')[0].trim()
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/ip-lookup',
    defaultLimiter,
    validateRequiredFields(['ip']),
    validateStringFields(['ip']),
    async (req, res, next) => {
        try {
            const { ip } = req.body;
            const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            
            if (!ipRegex.test(ip)) {
                throw new AppError('Invalid IP address format', 400);
            }

            const info = geoip.lookup(ip);
            if (!info) {
                throw new AppError('IP information not found', 404);
            }

            res.json({
                status: 'success',
                result: info
            });
        } catch (error) {
            next(error);
        }
    }
);

// Base64 Encode/Decode
router.post('/base64-encode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            const encoded = Buffer.from(text).toString('base64');
            res.json({
                status: 'success',
                result: encoded
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/base64-decode',
    defaultLimiter,
    validateRequiredFields(['text']),
    validateStringFields(['text']),
    async (req, res, next) => {
        try {
            const { text } = req.body;
            if (text.length > 10000) {
                throw new AppError('Text too long. Maximum 10000 characters allowed.', 400);
            }
            
            if (!/^[A-Za-z0-9+/=]+$/.test(text)) {
                throw new AppError('Invalid base64 string', 400);
            }

            const decoded = Buffer.from(text, 'base64').toString('utf-8');
            res.json({
                status: 'success',
                result: decoded
            });
        } catch (error) {
            next(error);
        }
    }
);

// Color Converter
router.post('/color-convert',
    defaultLimiter,
    validateRequiredFields(['color', 'from', 'to']),
    validateStringFields(['from', 'to']),
    async (req, res, next) => {
        try {
            const { color, from, to } = req.body;
            let result;
            
            if (!['hex', 'rgb'].includes(from) || !['hex', 'rgb'].includes(to)) {
                throw new AppError('Unsupported color format. Supported formats: hex, rgb', 400);
            }

            if (from === 'hex' && to === 'rgb') {
                if (typeof color !== 'string') {
                    throw new AppError('HEX color must be a string', 400);
                }
                if (!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                    throw new AppError('Invalid HEX color format', 400);
                }
                result = convert.hex.rgb(color);
            } else if (from === 'rgb' && to === 'hex') {
                if (!Array.isArray(color) || color.length !== 3) {
                    throw new AppError('RGB color must be an array of 3 numbers', 400);
                }
                if (!color.every(v => typeof v === 'number' && v >= 0 && v <= 255)) {
                    throw new AppError('RGB values must be between 0 and 255', 400);
                }
                result = '#' + convert.rgb.hex(color[0], color[1], color[2]);
            }
            
            res.json({
                status: 'success',
                result,
                input: { color, from, to }
            });
        } catch (error) {
            next(error);
        }
    }
);

// Password Generator
router.post('/generate-password',
    defaultLimiter,
    validatePasswordOptions,
    async (req, res, next) => {
        try {
            const { 
                length = 12, 
                numbers = true, 
                symbols = true, 
                uppercase = true, 
                lowercase = true 
            } = req.body;

            if (!numbers && !symbols && !uppercase && !lowercase) {
                throw new AppError('At least one character type must be enabled', 400);
            }

            let chars = '';
            let password = '';
            
            if (numbers) chars += '0123456789';
            if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
            
            // Ensure at least one character from each selected type
            if (numbers) password += '0123456789'[Math.floor(Math.random() * 10)];
            if (symbols) password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 23)];
            if (uppercase) password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
            if (lowercase) password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
            
            // Fill the rest randomly
            while (password.length < length) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Shuffle the password
            password = password.split('').sort(() => Math.random() - 0.5).join('');
            
            res.json({
                status: 'success',
                result: password,
                meta: {
                    length,
                    containsNumbers: numbers,
                    containsSymbols: symbols,
                    containsUppercase: uppercase,
                    containsLowercase: lowercase
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// VTT to SRT and SRT to VTT conversion
router.post('/vtt-to-srt',
    defaultLimiter,
    validateRequiredFields(['vtt']),
    validateStringFields(['vtt']),
    async (req, res, next) => {
        try {
            const { vtt } = req.body;
            if (vtt.length > 100000) {
                throw new AppError('VTT content too long. Maximum 100000 characters allowed.', 400);
            }

            if (!vtt.trim().startsWith('WEBVTT')) {
                throw new AppError('Invalid VTT format. File must start with WEBVTT', 400);
            }

            const readable = new Readable();
            readable._read = () => {};
            readable.push(vtt);
            readable.push(null);
            
            let srt = '';
            await new Promise((resolve, reject) => {
                readable
                    .pipe(vttToSrt())
                    .on('data', chunk => srt += chunk)
                    .on('end', resolve)
                    .on('error', reject);
            });

            res.json({
                status: 'success',
                result: srt
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/srt-to-vtt',
    defaultLimiter,
    validateRequiredFields(['srt']),
    validateStringFields(['srt']),
    async (req, res, next) => {
        try {
            const { srt } = req.body;
            if (srt.length > 100000) {
                throw new AppError('SRT content too long. Maximum 100000 characters allowed.', 400);
            }

            // Basic SRT format validation
            if (!/^\d+\r?\n\d{2}:\d{2}:\d{2},\d{3}/.test(srt)) {
                throw new AppError('Invalid SRT format', 400);
            }

            const readable = new Readable();
            readable._read = () => {};
            readable.push(srt);
            readable.push(null);
            
            let vtt = '';
            await new Promise((resolve, reject) => {
                readable
                    .pipe(srtToVtt())
                    .on('data', chunk => vtt += chunk)
                    .on('end', resolve)
                    .on('error', reject);
            });

            res.json({
                status: 'success',
                result: vtt
            });
        } catch (error) {
            next(error);
        }
    }
);

// YouTube Thumbnail Downloader
router.post('/youtube-thumbnail',
    defaultLimiter,
    validateURLField('url'),
    async (req, res, next) => {
        try {
            const { url } = req.body;
            const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            
            if (!videoId) {
                throw new AppError('Invalid YouTube URL or video ID not found', 400);
            }

            // Check if video exists
            try {
                await axios.get(`https://img.youtube.com/vi/${videoId}/default.jpg`, {
                    timeout: 5000
                });
            } catch (error) {
                throw new AppError('YouTube video not found or thumbnail not available', 404);
            }
            
            const thumbnails = {
                max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                default: `https://img.youtube.com/vi/${videoId}/default.jpg`
            };
            
            res.json({
                status: 'success',
                result: thumbnails,
                videoId
            });
        } catch (error) {
            next(error);
        }
    }
);

// HEX to RGB and RGB to HEX
router.post('/hex-to-rgb',
    defaultLimiter,
    validateRequiredFields(['hex']),
    validateHexColor('hex'),
    async (req, res, next) => {
        try {
            const { hex } = req.body;
            const rgb = convert.hex.rgb(hex);
            res.json({
                status: 'success',
                result: rgb,
                input: hex
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/rgb-to-hex',
    defaultLimiter,
    validateRequiredFields(['r', 'g', 'b']),
    validateRGBColor,
    async (req, res, next) => {
        try {
            const { r, g, b } = req.body;
            const hex = '#' + convert.rgb.hex(r, g, b);
            res.json({
                status: 'success',
                result: hex,
                input: { r, g, b }
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 