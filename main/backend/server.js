const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow no origin (mobile/curl), specific production domain, and any vercel preview domain
        if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Helper to generate UHID
const generateUHID = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Right Reach API' });
});

// Auth Routes
const crypto = require('crypto');

// Encryption Settings
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || '12345678901234567890123456789012').slice(0, 32); // Must be 32 bytes
const IV_LENGTH = 16;

const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { userData } = req.body;
        const { username, password, role, firstName, lastName } = userData;

        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uhid = generateUHID();

        // Encrypt the sensitive user data before storing
        const encryptedData = encrypt(JSON.stringify(userData));

        const newUser = await db.query(
            'INSERT INTO users (uhid, username, password, role, first_name, last_name, full_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING uhid',
            [uhid, username, hashedPassword, role, firstName, lastName, encryptedData]
        );

        res.status(201).json({ message: 'User registered successfully', uhid: newUser.rows[0].uhid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            console.log(`Login attempt failed: User ${username} not found`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Login attempt for ${username}: ${isMatch ? 'Success' : 'Failed'}`);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Decrypt full_data to send back to frontend
        let fullUserInfo = {};
        if (user.full_data) {
            try {
                fullUserInfo = JSON.parse(decrypt(user.full_data));
            } catch (err) {
                console.warn('Failed to decrypt user data during login');
            }
        }

        const token = jwt.sign({ id: user.uhid, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.uhid,
                name: user.role === 'patient' ? `${user.first_name} ${user.last_name}` : user.username,
                role: user.role,
                username: user.username,
                ...fullUserInfo
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.post('/api/auth/login-uhid', async (req, res) => {
    try {
        const { uhid } = req.body;
        console.log(`UHID Login attempt for: ${uhid}`);

        const result = await db.query('SELECT * FROM users WHERE uhid = $1', [uhid]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'UHID not found' });
        }

        const user = result.rows[0];

        // Decrypt full_data to send back to frontend
        let fullUserInfo = {};
        if (user.full_data) {
            try {
                fullUserInfo = JSON.parse(decrypt(user.full_data));
            } catch (err) {
                console.warn('Failed to decrypt user data during UHID login');
            }
        }

        const token = jwt.sign({ id: user.uhid, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.uhid,
                name: user.role === 'patient' ? `${user.first_name} ${user.last_name}` : user.username,
                role: user.role,
                username: user.username,
                ...fullUserInfo
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during UHID login' });
    }
});

// Patient Data Routes
app.get('/api/patients/:uhid', authenticateToken, async (req, res) => {
    try {
        const { uhid } = req.params;

        // Check if user is trying to access their own data or is doctor/admin
        if (req.user.role === 'patient' && req.user.id !== uhid) {
            return res.status(403).json({ message: 'Access denied. You can only view your own records.' });
        }

        const result = await db.query('SELECT uhid, first_name, last_name, full_data FROM users WHERE uhid = $1 AND role = \'patient\'', [uhid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patient = result.rows[0];

        // Decrypt the data if it exists
        let fullData = {};
        if (patient.full_data) {
            try {
                const decryptedStr = decrypt(patient.full_data);
                fullData = JSON.parse(decryptedStr);
            } catch (err) {
                console.warn('Failed to decrypt patient data, falling back to raw data');
                fullData = typeof patient.full_data === 'string' ? JSON.parse(patient.full_data) : patient.full_data;
            }
        }

        res.json({
            uhid: patient.uhid,
            name: `${patient.first_name} ${patient.last_name}`,
            ...fullData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching patient' });
    }
});

// Prescriptions Routes
app.get('/api/prescriptions/:uhid', authenticateToken, async (req, res) => {
    try {
        const { uhid } = req.params;

        // Security check
        if (req.user.role === 'patient' && req.user.id !== uhid) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const result = await db.query('SELECT * FROM prescriptions WHERE patient_uhid = $1 ORDER BY date DESC', [uhid]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching prescriptions' });
    }
});

app.post('/api/prescriptions', authenticateToken, async (req, res) => {
    try {
        // Only doctors can write prescriptions
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can add prescriptions.' });
        }

        const { patientUhid, doctorUhid, medicineName, dosage, frequency } = req.body;
        await db.query(
            'INSERT INTO prescriptions (patient_uhid, doctor_uhid, medicine_name, dosage, frequency) VALUES ($1, $2, $3, $4, $5)',
            [patientUhid, doctorUhid, medicineName, dosage, frequency]
        );
        res.status(201).json({ message: 'Prescription added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding prescription' });
    }
});

// Appointments Routes
app.get('/api/appointments/:uhid', authenticateToken, async (req, res) => {
    try {
        const { uhid } = req.params;

        // Security check
        if (req.user.role === 'patient' && req.user.id !== uhid) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const result = await db.query('SELECT * FROM appointments WHERE patient_uhid = $1 ORDER BY date, time', [uhid]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const { patientUhid, doctorName, date, time } = req.body;

        // Security check
        if (req.user.role === 'patient' && req.user.id !== patientUhid) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        await db.query(
            'INSERT INTO appointments (patient_uhid, doctor_name, date, time) VALUES ($1, $2, $3, $4)',
            [patientUhid, doctorName, date, time]
        );
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error booking appointment' });
    }
});

// System Stats Routes
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        // Only admins can see system stats
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const result = await db.query('SELECT role, COUNT(*) FROM users GROUP BY role');
        const stats = result.rows.reduce((acc, row) => {
            acc[row.role] = parseInt(row.count);
            return acc;
        }, {});
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// ── Model AI Proxy ────────────────────────────────────────────────────────────
// Forwards requests to the Python Flask ML model running on MODEL_API_URL.
// This avoids CORS issues in production and keeps a single API surface.
app.post('/api/model/predict', async (req, res) => {
    const modelUrl = process.env.MODEL_API_URL || 'http://localhost:5001';
    const disease = (req.body?.disease || '').trim();

    if (!disease) {
        return res.status(400).json({ error: 'Please provide a disease name.' });
    }

    try {
        const response = await fetch(`${modelUrl}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disease }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.json(data);
    } catch (err) {
        console.error('Model proxy error:', err.message);
        return res.status(503).json({ error: 'AI model service is unavailable. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // ── Keepalive ping to prevent HF Space from sleeping ──────────────────
    const MODEL_URL = process.env.MODEL_API_URL;
    if (MODEL_URL) {
        setInterval(async () => {
            try {
                await fetch(`${MODEL_URL}/health`);
                console.log('[keepalive] HF Space pinged successfully');
            } catch (err) {
                console.warn('[keepalive] HF Space ping failed:', err.message);
            }
        }, 5 * 60 * 1000); // every 5 minutes
        console.log(`[keepalive] Started pinging ${MODEL_URL}/health every 5 minutes`);
    }
});
