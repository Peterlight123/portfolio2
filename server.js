const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ======================= MIDDLEWARE =======================
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// ======================= FILE UPLOAD SETUP =======================
// Ensure upload directories exist
const uploadDirs = ['uploads/testimonials', 'uploads/contact', 'uploads/temp'];
uploadDirs.forEach(dir => {
    fs.ensureDirSync(dir);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = req.body.form_type === 'testimonial_submission' 
            ? 'uploads/testimonials' 
            : 'uploads/contact';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    }
});

// ======================= EMAIL SETUP =======================
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ======================= VALIDATION RULES =======================
const testimonialValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('testimonial').trim().isLength({ min: 10, max: 1000 }).escape(),
    body('company_position').optional().trim().isLength({ max: 200 }).escape(),
    body('project_type').optional().trim().isLength({ max: 100 }).escape(),
    body('consent').equals('on')
];

const contactValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().isLength({ min: 10, max: 2000 }).escape(),
    body('subject').optional().trim().isLength({ max: 200 }).escape(),
    body('phone').optional().trim().isLength({ max: 20 }).escape()
];

// ======================= UTILITY FUNCTIONS =======================
async function processImage(filePath, outputPath, maxWidth = 800, quality = 80) {
    try {
        await sharp(filePath)
            .resize(maxWidth, maxWidth, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality })
            .toFile(outputPath);
        
        // Remove original file
        await fs.remove(filePath);
        return outputPath;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

function generateEmailTemplate(type, data) {
    const baseTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f8f9fa; }
                .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #007bff; }
                .image { max-width: 200px; border-radius: 8px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>${type === 'testimonial' ? '🌟 New Testimonial Submission' : '📧 New Contact Form Submission'}</h2>
                </div>
                <div class="content">
                    ${generateContentByType(type, data)}
                </div>
                <div class="footer">
                    <p>Received on ${new Date().toLocaleString()}</p>
                    <p>Peter's Portfolio Backend System</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return baseTemplate;
}

function generateContentByType(type, data) {
    if (type === 'testimonial') {
        return `
            <div class="field">
                <div class="label">Name:</div>
                <div>${data.name}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div>${data.email}</div>
            </div>
            <div class="field">
                <div class="label">Company/Position:</div>
                <div>${data.company_position || 'Not provided'}</div>
            </div>
            <div class="field">
                <div class="label">Project Type:</div>
                <div>${data.project_type || 'Not specified'}</div>
            </div>
            <div class="field">
                <div class="label">Testimonial:</div>
                <div style="background: white; padding: 15px; border-left: 4px solid #007bff; font-style: italic;">
                    "${data.testimonial}"
                </div>
            </div>
            ${data.photoPath ? `
            <div class="field">
                <div class="label">Photo:</div>
                <div>Photo uploaded: ${data.photoPath}</div>
            </div>
            ` : ''}
        `;
    } else {
        return `
            <div class="field">
                <div class="label">Name:</div>
                <div>${data.name}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div>${data.email}</div>
            </div>
            <div class="field">
                <div class="label">Phone:</div>
                <div>${data.phone || 'Not provided'}</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div>${data.subject || 'No subject'}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div style="background: white; padding: 15px; border-left: 4px solid #007bff;">
                    ${data.message}
                </div>
            </div>
            ${data.attachments && data.attachments.length > 0 ? `
            <div class="field">
                <div class="label">Attachments:</div>
                <div>${data.attachments.join(', ')}</div>
            </div>
            ` : ''}
        `;
    }
}

// ======================= API ROUTES =======================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Testimonial submission endpoint
app.post('/api/testimonial', upload.single('photo'), testimonialValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, testimonial, company_position, project_type } = req.body;
        let photoPath = null;

        // Process uploaded photo if exists
        if (req.file) {
            const processedPath = path.join(
                path.dirname(req.file.path),
                'processed-' + path.basename(req.file.path)
            );
            
            try {
                await processImage(req.file.path, processedPath, 400, 85);
                photoPath = processedPath;
            } catch (imageError) {
                console.error('Image processing error:', imageError);
                // Continue without image if processing fails
            }
        }

        // Save to database/file (you can implement your preferred storage)
        const testimonialData = {
            id: Date.now(),
            name,
            email,
            testimonial,
            company_position,
            project_type,
            photoPath,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save to JSON file (you can replace this with database)
        const testimonialsFile = 'data/testimonials.json';
        await fs.ensureFile(testimonialsFile);
        
        let testimonials = [];
        try {
            const existingData = await fs.readFile(testimonialsFile, 'utf8');
            testimonials = JSON.parse(existingData);
        } catch (error) {
            testimonials = [];
        }
        
        testimonials.push(testimonialData);
        await fs.writeFile(testimonialsFile, JSON.stringify(testimonials, null, 2));

        // Send email notification
        const emailHtml = generateEmailTemplate('testimonial', {
            ...testimonialData,
            photoPath: req.file ? req.file.filename : null
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
            subject: `New Testimonial from ${name}`,
            html: emailHtml,
            attachments: photoPath ? [{
                filename: `testimonial-photo-${name}.jpg`,
                path: photoPath
            }] : []
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Testimonial submitted successfully!',
            id: testimonialData.id
        });

    } catch (error) {
        console.error('Testimonial submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Contact form submission endpoint
app.post('/api/contact', upload.array('attachments', 5), contactValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, message, subject, phone } = req.body;
        let attachments = [];

        // Process uploaded files if any
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (file.mimetype.startsWith('image/')) {
                    const processedPath = path.join(
                        path.dirname(file.path),
                        'processed-' + path.basename(file.path)
                    );
                    
                    try {
                        await processImage(file.path, processedPath, 800, 80);
                        attachments.push(processedPath);
                    } catch (imageError) {
                        console.error('Image processing error:', imageError);
                        attachments.push(file.path);
                    }
                } else {
                    attachments.push(file.path);
                }
            }
        }

        // Save contact submission
        const contactData = {
            id: Date.now(),
            name,
            email,
            message,
            subject,
            phone,
            attachments: attachments.map(path => path.split('/').pop()),
            submittedAt: new Date().toISOString(),
            status: 'new'
        };

        // Save to JSON file
        const contactsFile = 'data/contacts.json';
        await fs.ensureFile(contactsFile);
        
        let contacts = [];
        try {
            const existingData = await fs.readFile(contactsFile, 'utf8');
            contacts = JSON.parse(existingData);
        } catch (error) {
            contacts = [];
        }
        
        contacts.push(contactData);
        await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2));

        // Send email notification
        const emailHtml = generateEmailTemplate('contact', contactData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact: ${subject || 'No Subject'} - ${name}`,
            html: emailHtml,
            attachments: attachments.map(filePath => ({
                filename: path.basename(filePath),
                path: filePath
            }))
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully!',
            id: contactData.id
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Get testimonials (for admin or display)
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonialsFile = 'data/testimonials.json';
        const testimonials = await fs.readFile(testimonialsFile, 'utf8');
        res.json({
            success: true,
            data: JSON.parse(testimonials)
        });
    } catch (error) {
        res.json({
            success: true,
            data: []
        });
    }
});

// Get contacts (for admin)
app.get('/api/contacts', async (req, res) => {
    try {
        const contactsFile = 'data/contacts.json';
        const contacts = await fs.readFile(contactsFile, 'utf8');
        res.json({
            success: true,
            data: JSON.parse(contacts)
        });
    } catch (error) {
        res.json({
            success: true,
            data: []
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 5 files.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// ======================= START SERVER =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email configured: ${!!process.env.EMAIL_USER}`);
    console.log(`📁 Upload directories created`);
});

module.exports = app;
