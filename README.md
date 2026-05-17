📦 Advanced Inventory Management System

A secure, professional, and high-performance Inventory Management System built with a **Django REST Framework (DRF)** backend and a **React (JSX)** frontend. This project is specifically enhanced with robust security measures to prevent server overload and unauthorized employee access.

---

## 🚀 Key Features

- **Dynamic Inventory & Stock Tracking**: Full CRUD operations for Products, Categories, and Real-time Stock Transactions (In/Out logs).
- **Dynamic Secret Invitation Code**: Prevents public registrations. New users must provide a valid secret code which is managed and validated dynamically via the Django database.
- **Rate Limiting (Throttling)**: Protects registration and authentication endpoints from DDoS attacks and brute-force spam bots (restricted to 3 attempts per minute for anonymous users).
- **Secure UX Authentication**: Built-in 30-second token expiration interception that elegantly routes expired sessions to login without crashing the UI.
- **Form Best Practices**: Fully accessible forms utilizing explicit `id`, `name`, and `htmlFor` attributes to maintain zero-console-warnings compliance.
- **Password Visibility Toggle**: Integrated clean, grid-line-free eye icons for a modern password viewing experience.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.x, Django, Django REST Framework (DRF), Simple JWT (Optional for Token Auth)
- **Frontend**: React.js, React Router v6, Axios, Bootstrap 5, Bootstrap Icons

---

## 📂 Project Architecture


```
inventory-project/
│
├── backend/                  # Django Project Directory
│   ├── backend_project/      # Main settings configuration
│   └── your_app_name/        # Core business logic app
│       ├── models.py         # Includes Product, Category, Transaction & InvitationCode
│       ├── views.py          # Pure Function-Based Views (@api_view)
│       └── urls.py           # Explicit URL path routings
│
└── frontend/                 # React Project Directory
    ├── public/               # Static assets & index.html (Includes Bootstrap Icons CDN)
    └── src/
        ├── api.js            # Central Axios instance with global Interceptors
        ├── App.js            # App routing definitions and protected routes
        └── components/       # ProductList, AddProduct, AddCategory, AddTransaction, Login, Register

```

---

## ⚙️ Installation & Setup

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install required dependencies:
```bash
pip install django djangorestframework django-cors-headers

```


3. Apply database migrations to set up core tables and the new dynamic `InvitationCode` schema:
```bash
python manage.py makemigrations
python manage.py migrate

```


4. Create a superuser account to manage your inventory and generate invitation codes via the admin portal:
```bash
python manage.py createsuperuser

```


5. Run the development server:
```bash
python manage.py runserver

```


*The API will be available at `http://127.0.0.1:8000/api/`.*

### 2. Initial Security Configuration (Crucial Step)

Before testing registration on the frontend, you **must create an active invitation code**:

1. Log in to your Django Admin Panel at `http://127.0.0.1:8000/admin/`.
2. Under **Invitation Codes**, click **Add Invitation Code**.
3. Create a code of your choice (e.g., `BAKERY_STAFF_2026`) and ensure `Is Active` is checked. Save it.

---

### 3. Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend

```


2. Install npm packages:
```bash
npm install

```


3. Run the React application:
```bash
npm start

```


*The client app will launch at `http://127.0.0.1:3000/`.*

---

## 🔒 Security Configuration Details

### Throttling (Rate Limiting)

Configured in `settings.py` to prevent brute-force exploitation of the registration flow:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '3/minute',  # Limits unauthorized registration calls to 3 per minute per IP.
    }
}

```

### Dynamic Validation Model

Stored securely in `models.py`:

```python
class InvitationCode(models.Model):
    code = models.CharField(max_length=50, unique=True, help_text="The unique secret code required for new user registration.")
    is_active = models.BooleanField(default=True, help_text="Designates whether this invitation code is active and valid for use.")
    created_at = models.DateTimeField(auto_now_add=True)

```

---

## 📝 API Endpoints Summary

| HTTP Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/api/register/` | Registers a new user (Requires valid `secret_code`) | Public (Rate Limited) |
| **POST** | `/api/token/` | Generates access token (Login) | Public |
| **GET / POST** | `/api/products/` | Lists all products / Creates a new product | Protected (Authenticated) |
| **PUT / DELETE** | `/api/products/<id>/` | Updates or deletes a specific product item | Protected (Authenticated) |
| **GET / POST** | `/api/categories/` | Lists or creates product classification groups | Protected (Authenticated) |
| **GET / POST** | `/api/transactions/` | Logs stock changes (IN/OUT adjustments) | Protected (Authenticated) |

---

## 💡 Project Purpose & Showcase

This repository was developed as a **Personal Portfolio Project** to demonstrate full-stack development capabilities, security best practices (rate-limiting and dynamic invitation codes), and clean architectural design using Django and React.

While it is structured to simulate a real-world internal business inventory logistics system, the codebase is entirely open for educational review and technical evaluation by hiring managers and tech recruiters.
