require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Create the clinic table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clinic (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clinic_name VARCHAR(150) NOT NULL,
            doctor_name VARCHAR(150),
            address VARCHAR(200),
            phone VARCHAR(20),
            services VARCHAR(200),
            opening_hours VARCHAR(100),
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Table creation failed:', err.message);
        } else {
            console.log('Clinic table is ready.');
        }
    });
});
// Add 10 sample clinics if the table is empty
db.get('SELECT COUNT(*) AS count FROM clinic', (err, row) => {
    if (err) {
        console.error(err.message);
        return;
    }

    if (row.count === 0) {
        const clinics = [
            ['Kabwe Central Clinic', 'Dr. Banda', 'Kabwe Central', '0977000001', 'General consultation', '08:00-17:00', 'central@example.com'],
            ['Hope Medical Centre', 'Dr. Phiri', 'Kabwe East', '0977000002', 'Family medicine', '08:00-18:00', 'hope@example.com'],
            ['Sunrise Clinic', 'Dr. Zulu', 'Kabwe West', '0977000003', 'Maternal care', '07:00-16:00', 'sunrise@example.com'],
            ['Mercy Health Clinic', 'Dr. Tembo', 'Kabwe North', '0977000004', 'Child healthcare', '08:00-17:00', 'mercy@example.com'],
            ['LifeCare Medical Centre', 'Dr. Mwansa', 'Kabwe South', '0977000005', 'Laboratory services', '08:00-18:00', 'lifecare@example.com'],
            ['New Hope Clinic', 'Dr. Chanda', 'Makululu', '0977000006', 'General consultation', '08:00-17:00', 'newhope@example.com'],
            ['Family First Clinic', 'Dr. Lungu', 'Kabwe Central', '0977000007', 'Family planning', '08:00-16:00', 'familyfirst@example.com'],
            ['Green Valley Clinic', 'Dr. Sakala', 'Kabwe East', '0977000008', 'Vaccination', '07:00-15:00', 'greenvalley@example.com'],
            ['Community Health Centre', 'Dr. Musonda', 'Kabwe West', '0977000009', 'Outpatient care', '08:00-17:00', 'community@example.com'],
            ['Wellness Medical Clinic', 'Dr. Kapata', 'Kabwe North', '0977000010', 'General healthcare', '08:00-18:00', 'wellness@example.com']
        ];

        const insert = db.prepare(`
            INSERT INTO clinic
            (clinic_name, doctor_name, address, phone, services, opening_hours, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        clinics.forEach(clinic => insert.run(clinic));
        insert.finalize(() => console.log('10 sample clinics added.'));
    }
});
// GET all clinics
app.get('/api/clinic', (req, res) => {
    db.all('SELECT * FROM clinic', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET one clinic
app.get('/api/clinic/:id', (req, res) => {
    db.get('SELECT * FROM clinic WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Clinic not found' });
        res.json(row);
    });
});

// CREATE a clinic
app.post('/api/clinic', (req, res) => {
    const { clinic_name, doctor_name, address, phone, services, opening_hours, email } = req.body;

    if (!clinic_name) {
        return res.status(400).json({ error: 'Clinic name is required' });
    }

    db.run(
        `INSERT INTO clinic
        (clinic_name, doctor_name, address, phone, services, opening_hours, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [clinic_name, doctor_name || null, address || null, phone || null,
         services || null, opening_hours || null, email || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Clinic created successfully' });
        }
    );
});

// UPDATE a clinic
app.put('/api/clinic/:id', (req, res) => {
    const { clinic_name, doctor_name, address, phone, services, opening_hours, email } = req.body;

    if (!clinic_name) {
        return res.status(400).json({ error: 'Clinic name is required' });
    }

    db.run(
        `UPDATE clinic SET
        clinic_name = ?, doctor_name = ?, address = ?, phone = ?,
        services = ?, opening_hours = ?, email = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [clinic_name, doctor_name || null, address || null, phone || null,
         services || null, opening_hours || null, email || null, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Clinic not found' });
            res.json({ message: 'Clinic updated successfully' });
        }
    );
});

// DELETE a clinic
app.delete('/api/clinic/:id', (req, res) => {
    db.run('DELETE FROM clinic WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Clinic not found' });
        res.json({ message: 'Clinic deleted successfully' });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});