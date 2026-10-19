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
);

INSERT INTO clinic (clinic_name, doctor_name, address, phone, services, opening_hours, email)
VALUES
('Kabwe Central Clinic', 'Dr. Banda', 'Kabwe Central', '0977000001', 'General consultation', '08:00-17:00', 'central@example.com'),
('Hope Medical Centre', 'Dr. Phiri', 'Kabwe East', '0977000002', 'Family medicine', '08:00-18:00', 'hope@example.com'),
('Sunrise Clinic', 'Dr. Zulu', 'Kabwe West', '0977000003', 'Maternal care', '07:00-16:00', 'sunrise@example.com'),
('Mercy Health Clinic', 'Dr. Tembo', 'Kabwe North', '0977000004', 'Child healthcare', '08:00-17:00', 'mercy@example.com'),
('LifeCare Medical Centre', 'Dr. Mwansa', 'Kabwe South', '0977000005', 'Laboratory services', '08:00-18:00', 'lifecare@example.com'),
('New Hope Clinic', 'Dr. Chanda', 'Makululu', '0977000006', 'General consultation', '08:00-17:00', 'newhope@example.com'),
('Family First Clinic', 'Dr. Lungu', 'Kabwe Central', '0977000007', 'Family planning', '08:00-16:00', 'familyfirst@example.com'),
('Green Valley Clinic', 'Dr. Sakala', 'Kabwe East', '0977000008', 'Vaccination', '07:00-15:00', 'greenvalley@example.com'),
('Community Health Centre', 'Dr. Musonda', 'Kabwe West', '0977000009', 'Outpatient care', '08:00-17:00', 'community@example.com'),
('Wellness Medical Clinic', 'Dr. Kapata', 'Kabwe North', '0977000010', 'General healthcare', '08:00-18:00', 'wellness@example.com');