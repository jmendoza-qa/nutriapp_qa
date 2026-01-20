# 🧭 UI Exploration Summary - NutriApp
## Based on Real Browser Exploration with Playwright

**Date:** 2026-01-13  
**Exploration Method:** Real UI exploration using Playwright browser automation  
**Application URL:** http://localhost:3000

---

## 📄 Pages Identified

### 1. **Home Page** (`/`)
- **Purpose:** Landing page with welcome message
- **Key Elements:**
  - Header with NutriApp logo and navigation (Recetas, Logout)
  - Welcome message: "Welcome to NutriApp!"
  - Test user credentials display:
    - Email: `test@nutriapp.com`
    - Password: `nutriapp123`
  - "Go to Login" button/link
- **Accessibility:** Public (no authentication required)
- **User Flow:** Entry point → redirects to login for protected features

### 2. **Login Page** (`/login`)
- **Purpose:** User authentication
- **Key Elements:**
  - NutriApp logo and branding
  - Heading: "Bienvenido"
  - Subheading: "Inicia sesión para continuar"
  - Form fields:
    - Email input (`input[name="email"]`)
    - Password input (`input[name="password"]`)
  - Submit button: "Iniciar sesión" (`button[type="submit"]`)
  - Error message display (red text, `p.text-red-500`)
  - Link to register: "¿No tienes cuenta? Regístrate"
- **User Flow:** Login → redirects to `/dishes` on success
- **Validation:** Shows error message on invalid credentials

### 3. **Register Page** (`/register`)
- **Purpose:** New user registration
- **Key Elements:**
  - NutriApp logo and branding
  - Heading: "Crear cuenta"
  - Subheading: "Regístrate para comenzar"
  - Form fields (grid layout):
    - First Name (`input[name="firstName"]`)
    - Last Name (`input[name="lastName"]`)
    - Email (`input[name="email"]`)
    - Nationality (`input[name="nationality"]`)
    - Phone (`input[name="phone"]`)
    - Password (`input[name="password"]`)
  - Submit button: "Registrarse" (`button[type="submit"]`)
  - Error message display (red text)
  - Link to login: "¿Ya tienes cuenta? Inicia sesión"
- **User Flow:** Register → redirects to `/login` on success
- **Validation:** Shows error if email already exists (409 status)

### 4. **Dishes List Page** (`/dishes`)
- **Purpose:** Display all dishes for authenticated user
- **Access:** Protected (requires authentication)
- **Key Elements:**
  - Header with navigation
  - Heading: "Sugerencias de Platillos"
  - "Agregar Platillo" button/link (`/dishes/new`)
  - Grid of dish cards with:
    - Dish image (or placeholder)
    - Dish name
    - Description
    - Quick prep badge or time indicator
    - Action buttons: "Ver", "Editar", "Eliminar"
- **User Flow:** Main dashboard after login

### 5. **New Dish Page** (`/dishes/new`)
- **Purpose:** Create a new dish
- **Access:** Protected (requires authentication)
- **Key Elements:**
  - Heading: "Agregar Platillo"
  - Form with sections:
    - Basic Information:
      - Name (`input[name="name"]`)
      - Description (`textarea[name="description"]`)
      - Quick Prep checkbox (`input[name="quickPrep"]`)
    - Details:
      - Prep Time (`input[name="prepTime"]`)
      - Cook Time (`input[name="cookTime"]`)
      - Calories (`input[name="calories"]`)
      - Image URL (`input[name="imageUrl"]`)
    - Preparation Steps:
      - Dynamic step inputs (`input[placeholder="Paso 1"]`, etc.)
      - Add step button
      - Remove step buttons
  - Submit button: "Guardar"
- **User Flow:** Create → redirects to `/dishes` on success

### 6. **Edit Dish Page** (`/dishes/[id]`)
- **Purpose:** Edit existing dish
- **Access:** Protected (requires authentication)
- **Key Elements:** Similar to New Dish form, pre-filled with dish data
- **User Flow:** Edit → saves and redirects

### 7. **View Dish Page** (`/dishes/[id]/view`)
- **Purpose:** View dish details (read-only)
- **Access:** Protected (requires authentication)
- **Key Elements:** Display dish information in detail view

---

## 🎯 Critical User Flows

### Flow 1: User Registration → Login → View Dishes
1. Navigate to `/register`
2. Fill registration form
3. Submit → redirects to `/login`
4. Login with new credentials
5. Redirected to `/dishes`

### Flow 2: Login → View Dishes → Create Dish
1. Navigate to `/login`
2. Enter credentials (`test@nutriapp.com` / `nutriapp123`)
3. Submit → redirects to `/dishes`
4. Click "Agregar Platillo"
5. Fill dish form
6. Submit → redirects to `/dishes` with new dish

### Flow 3: View Dish → Edit → Delete
1. From `/dishes`, click "Ver" on a dish
2. View details at `/dishes/[id]/view`
3. Navigate back, click "Editar"
4. Edit at `/dishes/[id]`
5. Save changes
6. Delete dish from list

---

## 🔍 UI Element Patterns

### Locator Strategy (Web-First)
- **Buttons:** `getByRole('button', { name: '...' })`
- **Links:** `getByRole('link', { name: '...' })`
- **Form Inputs:** `getByLabel('...')` or `getByRole('textbox')`
- **Headings:** `getByRole('heading', { name: '...' })`
- **Error Messages:** `getByText(/error pattern/i)` or `locator('p.text-red-500')`

### Common Patterns
- All forms use `name` attributes for inputs
- Error messages appear in red (`text-red-500` class)
- Loading states: button text changes (e.g., "Registrando...", "Guardando...")
- Navigation links use standard `<a>` tags with `href`
- Forms submit via `button[type="submit"]`

---

## ⚠️ Assumptions Made

1. **Authentication:** Uses cookie-based session (`session` cookie)
2. **API Endpoints:**
   - `/api/login` - POST with `{email, password}`
   - `/api/register` - POST with user data
   - `/api/dishes` - GET (list), POST (create)
   - `/api/dishes/[id]` - GET, PUT, DELETE
   - `/api/logout` - POST
3. **Error Handling:** Client-side error messages displayed in red
4. **Navigation:** Client-side routing using Next.js router
5. **Protected Routes:** All `/dishes/*` routes require authentication

---

## 📝 Notes for Test Design

- **Happy Paths:** Registration, Login, CRUD operations on dishes
- **Negative Paths:** Invalid credentials, duplicate email, form validation
- **State Transitions:** Login → Logout, Create → Edit → Delete
- **Edge Cases:** Empty dish list, missing images, long text inputs

---

## ✅ Exploration Status

**Completed:** Real UI exploration using Playwright  
**Screenshots:** Captured for homepage and login page  
**Code Review:** Reviewed source files for all pages  
**Ready for:** Page Object Model implementation and test suite creation
