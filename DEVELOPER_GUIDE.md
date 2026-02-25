# VendorMatch Frontend — Developer Guide

> A B2B platform that connects suppliers and retailers. Built with Vue 3, Quasar Framework, and Pinia.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Routing & Navigation](#routing--navigation)
7. [Authentication & Authorization](#authentication--authorization)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Component Conventions](#component-conventions)
11. [Styling](#styling)
12. [Internationalization (i18n)](#internationalization-i18n)
13. [Adding New Features](#adding-new-features)
14. [Code Quality](#code-quality)
15. [Build & Deployment](#build--deployment)
16. [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) + Quasar v2 |
| State Management | Pinia |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| UI Components | Quasar Material Components |
| Charts | Highcharts |
| PDF | PDFjs-dist + html2pdf.js |
| i18n | Vue-i18n 9 |
| Build Tool | Vite (via Quasar CLI) |
| Code Quality | ESLint + Prettier |

---

## Prerequisites

- **Node.js** v18 or higher (v20 recommended)
- **npm** v8+
- **Quasar CLI** (installed as a dev dependency — no global install needed)
- A running backend API at `http://127.0.0.1:8000/api/` (see [API Integration](#api-integration))

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd vendormatch-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server auto-opens the browser. Hot Module Replacement (HMR) is enabled.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build (output: `dist/`) |
| `npm run lint` | Run ESLint |
| `npm run format` | Auto-format with Prettier |

---

## Project Structure

```
vendormatch-frontend/
├── public/                   # Static assets (icons, pdf.worker.js)
├── src/
│   ├── App.vue               # Root component
│   ├── assets/               # Images, logos, placeholders
│   ├── boot/                 # Initialization files (run before app mounts)
│   │   ├── axios.js          # Axios instance + auth interceptor
│   │   ├── i18n.js           # Vue-i18n setup
│   │   ├── validator.js      # Token validation + route guards
│   │   └── auto-refresh.js   # Tab visibility auto-reload
│   ├── components/           # Shared/reusable components
│   ├── css/
│   │   ├── app.scss          # Global styles
│   │   └── font.size.scss    # Typography utilities
│   ├── i18n/                 # Translation files
│   │   └── en-US/            # English locale
│   ├── layouts/
│   │   └── MainLayout.vue    # App shell: header, nav drawer, router-view
│   ├── pages/                # Route-level components (lazy-loaded)
│   │   ├── dashboard/
│   │   ├── product/
│   │   ├── inquiry/
│   │   ├── request-for-quotation/
│   │   └── account/
│   ├── router/
│   │   ├── index.js          # Router creation + history mode
│   │   └── routes.js         # Route definitions
│   └── stores/               # Pinia stores
│       ├── auth.js
│       ├── user.js
│       ├── dashboard.js
│       ├── products.js
│       ├── rfq.js
│       ├── enterprise.js
│       ├── vendor.js
│       ├── buyer.js
│       ├── account.js
│       ├── chat.js
│       ├── helper.js
│       └── triggers.js
├── index.html
├── quasar.config.js
├── jsconfig.json
├── eslint.config.js
└── package.json
```

---

## Configuration

### `quasar.config.js`

Key settings:

| Setting | Value | Notes |
|---|---|---|
| Router mode | `history` | Clean URLs — requires server rewrite rules in production |
| Boot files | `i18n`, `axios`, `validator`, `auto-refresh` | Executed in this order on startup |
| Plugins | `Notify`, `Dialog` | Toast notifications and modal dialogs |
| Target browsers | Chrome/Firefox 115+, Safari 14 | ES2022 features available |

### `jsconfig.json`

Path aliases are configured for clean imports:

```js
import MyComponent from 'src/components/MyComponent.vue'
import { useAuthStore } from 'src/stores/auth'
```

### Environment Variables

The API base URL is currently hardcoded in `src/boot/axios.js`. For environment-specific configuration:

1. Create `.env.development` and `.env.production` at the project root:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/
   ```
2. Reference it in `axios.js` as `import.meta.env.VITE_API_BASE_URL`.

---

## Routing & Navigation

Routes are defined in [src/router/routes.js](src/router/routes.js).

### Route Structure

All authenticated routes are children of `MainLayout`:

```
/                     → MainLayout (auth required)
  /dashboard          → AdminDashboard      (level: 0)
  /dashboard/vendor   → VendorDashboard     (role: [0, 2])
  /dashboard/buyer    → BuyerDashboard      (role: [1])
  /products           → ProductList
  /inquiries          → InquiryPage
  /request-for-quotation         → CreateRFQ
  /request-for-quotation-cards   → RFQCards
  /rfq-requests                  → RFQRequest
  /rfq-responses                 → RFQResponse
  /accounts           → AccountList         (level: 0)
  /create-account     → CreateAccount

/signin               → SignIn  (public)
/signup               → SignUp  (public)
```

### Route Metadata

Use `meta` to restrict access:

```js
{
  path: '/accounts',
  component: () => import('pages/account/AccountList.vue'),
  meta: { requiresAuth: true, level: 0 }  // Admin only
}

{
  path: '/dashboard/vendor',
  meta: { requiresAuth: true, role: [0, 2] }  // Vendor or Agency
}
```

### Adding a New Route

1. Create the page component under `src/pages/`.
2. Add the route definition to `src/router/routes.js`.
3. Add a navigation link in `src/layouts/MainLayout.vue` (conditionally based on role if needed).

---

## Authentication & Authorization

### Flow

```
App starts
  → boot/validator.js runs
  → Reads Bearer token from localStorage
  → Calls GET /validate-token
    ├── Valid   → Stores user info in auth store, sets up route guards
    └── Invalid → Clears token, redirects to /signin
```

### Token Storage

The Bearer token is stored in Quasar's `LocalStorage` under the key `'Bearer'` and automatically attached to every outgoing request via the Axios request interceptor in `src/boot/axios.js`.

### User Roles & Levels

| Value | Meaning |
|---|---|
| `role: 0` | Vendor |
| `role: 1` | Buyer |
| `role: 2` | Agency / Sub-vendor |
| `level: 0` | Admin (highest privilege) |
| `level: 2` | Standard user |

Role-conditional rendering example:

```vue
<q-item v-if="user.role === 0" to="/dashboard/vendor">
  Vendor Dashboard
</q-item>
```

---

## State Management

State is managed with [Pinia](https://pinia.vuejs.org/). All stores are in `src/stores/`.

### Store Overview

| Store | File | Responsibility |
|---|---|---|
| `useAuthStore` | `auth.js` | Login, logout, token, user info |
| `useUserStore` | `user.js` | User search, update, password change |
| `useDashboardStore` | `dashboard.js` | Dashboard statistics & chart data |
| `useProductStore` | `products.js` | Product CRUD, favorites, search |
| `useRFQStore` | `rfq.js` | RFQ CRUD, responses, messages |
| `useEnterpriseStore` | `enterprise.js` | Enterprise management |
| `useVendorStore` | `vendor.js` | Vendor search/listing |
| `useBuyerStore` | `buyer.js` | Buyer search/listing |
| `useAccountStore` | `account.js` | Account registration |
| `useMessageStore` | `chat.js` | In-app messaging |
| `useHelperStore` | `helper.js` | PDF utilities |
| `useTriggersStore` | `triggers.js` | UI state (dialogs, drawers) |

### Using a Store in a Component

```vue
<script setup>
import { useProductStore } from 'src/stores/products'

const productStore = useProductStore()

// Call an action
await productStore.GetProducts({ page: 1 })

// Access state
const products = computed(() => productStore.Products)
</script>
```

### Store Pattern

All stores follow the same Options Store pattern:

```js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useExampleStore = defineStore('example', {
  state: () => ({
    Items: [],
    ItemDetails: {},
  }),
  actions: {
    async GetItems(query) {
      const response = await api.get('/vendor-match/example', { params: query })
      this.Items = response.data.data
    },
  },
})
```

---

## API Integration

### Base Configuration

Defined in `src/boot/axios.js`:

- **Base URL:** `http://127.0.0.1:8000/api/`
- **Credentials:** `withCredentials: true`
- **Default headers:** `Content-Type: application/json`
- **Auth interceptor:** Automatically appends `Authorization: Bearer <token>` from localStorage

### Making API Calls

Always call the API through Pinia store actions — never directly in components. This keeps the component layer thin and state centralized.

```js
// In a store action:
async GetProduct(id) {
  const response = await api.get(`/vendor-match/product/${id}`)
  this.ProductDetails = response.data.data
}
```

### File Uploads

Use `multipart/form-data` for endpoints that accept files:

```js
async InsertProduct(formData) {
  const response = await api.post('/vendor-match/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
```

### Common API Endpoints

| Resource | Method | Endpoint |
|---|---|---|
| Login | POST | `/login` |
| Logout | DELETE | `/logout` |
| Validate token | GET | `/validate-token` |
| Products | GET/POST | `/vendor-match/product` |
| Product detail | GET/DELETE | `/vendor-match/product/:id` |
| RFQs | GET/POST | `/vendor-match/rfq` |
| RFQ responses | GET/POST | `/vendor-match/rfq-response` |
| Inquiries | GET | `/vendor-match/inquiry` |
| Users | GET | `/vendor-match/user` |
| Update user | PUT | `/user-information/:id` |
| Enterprises | GET/POST | `/enterprise` |
| Messages | GET/POST | `/vendor-match/chat` |
| Dashboard stats | GET | `/vendor-match/dashboard/...` |

### Response Format

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional description"
}
```

---

## Component Conventions

### Script Style

Use Vue 3 `<script setup>` (Composition API):

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'

const store = useProductStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await store.GetProducts()
  loading.value = false
})
</script>
```

### Loading States

Use Quasar skeleton loaders while fetching data:

```vue
<template>
  <q-skeleton v-if="loading" height="200px" />
  <ProductCard v-else v-for="p in products" :key="p.id" :product="p" />
</template>
```

### Dialog/Drawer State

UI toggle state (open/close dialogs) lives in the `triggers` store:

```js
import { useTriggersStore } from 'src/stores/triggers'

const triggers = useTriggersStore()
triggers.AddProductDialog = true   // open dialog
triggers.AddProductDialog = false  // close dialog
```

### Shared Components

Place reusable components in `src/components/`. Current shared components:

- `ProductCard.vue` — Product grid card with image, category, price, favorite toggle
- `ViewProductDetails.vue` — Product detail panel
- `RightDrawer.vue` — Togglable right sidebar
- `EssentialLink.vue` — Navigation link wrapper

---

## Styling

### Approach

- **Quasar utility classes** for spacing, layout, and typography (`q-pa-md`, `q-mb-lg`, `text-h6`, etc.)
- **Scoped `<style>` blocks** in `.vue` files for component-specific overrides
- **Global styles** in `src/css/app.scss`

### Common Quasar Layout Classes

```
q-pa-md       padding: 16px
q-mb-lg       margin-bottom: 24px
q-gutter-md   gap: 16px (for flex/grid containers)
text-h5       <h5> typography
text-grey-6   color: grey-6
full-width    width: 100%
```

### Custom Class Conventions

Keep component-specific class names descriptive:

```scss
// In a scoped style block
.product-card { border-radius: 8px; }
.stats-card   { min-height: 120px; }
.login-card   { max-width: 400px; }
```

---

## Internationalization (i18n)

Translations are in `src/i18n/en-US/`.

### Adding a Translation Key

1. Open `src/i18n/en-US/index.js` and add your key:
   ```js
   export default {
     failed: 'Action failed',
     success: 'Action was successful',
     myNewKey: 'My new translated string',
   }
   ```

2. Use it in a template:
   ```vue
   <p>{{ $t('myNewKey') }}</p>
   ```

3. Or in a `<script setup>`:
   ```js
   import { useI18n } from 'vue-i18n'
   const { t } = useI18n()
   console.log(t('myNewKey'))
   ```

---

## Adding New Features

### New Page

1. Create `src/pages/myfeature/MyFeaturePage.vue`
2. Add the route in `src/router/routes.js`:
   ```js
   {
     path: '/my-feature',
     name: 'my-feature',
     component: () => import('pages/myfeature/MyFeaturePage.vue'),
     meta: { requiresAuth: true }
   }
   ```
3. Add a nav link in `src/layouts/MainLayout.vue` if it needs sidebar navigation.

### New Store

Create `src/stores/myfeature.js`:

```js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useMyFeatureStore = defineStore('myfeature', {
  state: () => ({
    Items: [],
  }),
  actions: {
    async GetItems() {
      const res = await api.get('/vendor-match/my-endpoint')
      this.Items = res.data.data
    },
  },
})
```

### New API Endpoint

Add the action to the relevant store. Follow the existing naming convention:
- `Get` → fetch list or single item
- `Insert` → create
- `Update` → modify
- `Delete` → remove

---

## Code Quality

### Linting

```bash
npm run lint       # Check for issues
npm run format     # Auto-fix formatting
```

### ESLint Config

Configured in `eslint.config.js` with Vue 3 rules. Key rules enforced:
- No unused variables
- Vue 3 `<script setup>` best practices
- Consistent component naming

### Prettier Config

Defined in `.prettierrc.json`. Rules are auto-applied on `npm run format`. Configure your editor to format on save for the best experience.

---

## Build & Deployment

### Production Build

```bash
npm run build
```

Output is placed in `dist/spa/`. This is a standard static SPA bundle.

### Server Requirements

Because the router uses **history mode**, the web server must redirect all requests to `index.html`. Example configs:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^ index.html [L]
</IfModule>
```

### Environment-Specific API URLs

Update the base URL in `src/boot/axios.js` before building for a specific environment, or introduce Vite environment variables (see [Configuration](#configuration)).

---

## Troubleshooting

### Blank page after `npm run dev`

- Ensure the backend is running at `http://127.0.0.1:8000`.
- Check browser console for failed API calls or CORS errors.

### Authentication fails / redirects to `/signin` unexpectedly

- Check `localStorage` for a `Bearer` key.
- Verify the backend `/validate-token` endpoint is reachable.
- Inspect `src/boot/validator.js` for route guard logic.

### 404 errors in production

- The server must be configured to serve `index.html` for all routes (see [Deployment](#build--deployment)).

### Tab reloads itself after coming back into focus

- This is intentional. `src/boot/auto-refresh.js` reloads the page if the tab was hidden for more than **5 minutes** to prevent stale data.

### Charts not rendering

- Highcharts is imported per-component. Ensure the chart container `div` is visible and has a non-zero height before Highcharts initializes.

### PDF preview broken

- `public/pdf.worker.js` must be served from the root path. Verify it exists in `public/` and isn't excluded from the build.

---

*For questions or issues, open a ticket in the project repository.*
