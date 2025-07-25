const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // default for XAMPP is blank
  database: 'uploader_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL (XAMPP)');
});

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure folders exist
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = file.mimetype.startsWith('image/') ? 'uploads/images' :
                 file.mimetype.startsWith('video/') ? 'uploads/videos' :
                 null;

    if (!folder) return cb(new Error('Unsupported file type'), null);

    const fullPath = path.join(__dirname, folder);
    ensureFolderExists(fullPath);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/mkv'
  ];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const folder = req.file.mimetype.startsWith('image/') ? 'images' : 'videos';
  const fileUrl = `/uploads/${folder}/${req.file.filename}`;
  const fileType = req.file.mimetype;

  const sql = 'INSERT INTO uploads (filename, filetype, fileurl) VALUES (?, ?, ?)';
  const values = [req.file.filename, fileType, fileUrl];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ DB insert failed:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    res.status(200).json({
      message: 'File uploaded and saved to database successfully',
      fileUrl
    });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(400).json({ error: err.message || 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
