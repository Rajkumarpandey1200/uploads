# 📤 File Uploader API

This is a simple Node.js + Express backend built for uploading and managing images and videos. It is part of our company website's functionality that allows users to upload media files which are stored locally and tracked in a MySQL database.

---

## 🚀 Features

- Upload images (`.jpg`, `.png`, `.webp`, `.gif`) and videos (`.mp4`, `.webm`, `.mov`, `.mkv`)
- Store uploaded files in separate folders (`uploads/images/`, `uploads/videos/`)
- Save file metadata (filename, type, URL, timestamp) to a MySQL database
- Serve uploaded files via public URL
- Multer for handling multipart file uploads
- CORS-enabled for frontend integration

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL (XAMPP-compatible)
- **File Uploads:** Multer
- **Others:** CORS, Path, FS

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Rajkumarpandey1200/uploads.git
cd uploads

# Install dependencies
npm install
