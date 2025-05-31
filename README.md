# 🦸‍♀️ Superhero Database Web App

A full-stack web application for managing a list of superheroes, including CRUD operations and image handling via Cloudinary.

## 🛠 Stack

* **Frontend**: React, React Router, Chakra Ui
* **Backend**: Node.js, Express.js, Sequelize (PostgreSQL)
* **Database**: PostgreSQL
* **ORM**: Sequelize
* **Image Hosting**: Cloudinary

---

## 🚀 Features

* View a list of superheroes (nickname + main image)
* View full hero details
* Add new heroes 
* Edit existing heroes
* Delete heroes
* Upload images via file or URL


---

## 📥 Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/shizoevich/superhero-db.git
cd superhero-db
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

Then run:

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all 
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend will be available at:
`http://localhost:5173` (Vite default)

---

## 🧪 Seeding Sample Data

We created a seed file with 10 fictional heroes (name, bio, superpowers, etc.)
To apply the seed:

```bash
cd server
npx sequelize db:seed:all
```

---

## 🌐 API Endpoints (backend)

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/heroes`            | Get all heroes        |
| GET    | `/api/heroes/:id`        | Get single hero by ID |
| POST   | `/api/heroes`            | Create a new hero     |
| PUT    | `/api/heroes/:id`        | Edit hero             |
| DELETE | `/api/heroes/:id`        | Delete hero           |
| POST   | `/api/heroes/:id/images` | Add images to hero    |

---

## 📸 Image Handling

* Images are stored on **Cloudinary**
* You can upload via:

  * File upload
  * URL input (validated)
* Only **1 main image** is allowed per hero (validated on backend)

---

## 📸 UI Preview

*Add screenshots here if desired*

---


