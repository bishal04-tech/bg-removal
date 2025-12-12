# 🖼️ BG-Removal – AI-Powered Background Remover

A full-stack web app that lets users upload images, remove backgrounds using the **Clipdrop API**, and manage credits with **Razorpay payments**.  
Built with **React**, **Node.js**, **Express**, **MongoDB**, **JWT Auth**, **Cloudinary**, and **Multer**.

---

## 🚀 Features
- ✨ User register/login with JWT authentication  
- 🖼️ Upload images and remove background via Clipdrop API  
- 💰 Credit system with Razorpay integration (buy & track credits)  
- ☁️ Cloud storage using Cloudinary  
- 🔐 Secure password hashing with bcrypt  
- 📜 View processed image history & download results  

---

## 🧰 Tech Stack
**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB (Mongoose)  
**Storage:** Cloudinary  
**Payments:** Razorpay (Test & Live keys)  
**Auth:** JWT, bcrypt  

---

## 🏗️ Project Structure
bg-removal/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── server.js
│
└── frontend/
├── src/
└── package.json

yaml
Copy code

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone repo
```bash
git clone https://github.com/yourusername/bg-removal.git
cd bg-removal
2️⃣ Backend setup
bash
Copy code
cd backend
npm install
Create .env file:

env
Copy code
PORT=4000
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_secret>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLIPDROP_API_KEY=<api_key>
RAZORPAY_KEY_ID=<key_id>
RAZORPAY_KEY_SECRET=<key_secret>
Run backend:

bash
Copy code
npm run dev
3️⃣ Frontend setup
bash
Copy code
cd ../frontend
npm install
npm start
🔌 API Routes
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get logged-in user
POST	/api/images/upload	Upload & process image
POST	/api/payments/create-order	Create Razorpay order
