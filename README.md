# NGuard - N-Device Authentication System

A professional Next.js application with Auth0 authentication implementing N-device concurrent login limits, session management, and device tracking.

🔗 **Live Demo**: [https://nextjs-auth0-n-device-limit.vercel.app/](https://nextjs-auth0-n-device-limit.vercel.app/)

---

## 📋 Project Overview

This application demonstrates advanced authentication and session management capabilities with a focus on limiting concurrent device access per user account. Built with modern web technologies, it provides a polished user experience while maintaining robust security features.

### Key Features

- **N-Device Limit**: Users can be logged in on a maximum of 3 devices simultaneously
- **Force Logout Mechanism**: When attempting to log in on the 4th device, users can force logout from one of the existing sessions
- **Graceful Session Revocation**: Users on logged-out devices receive a professional notification explaining the force logout
- **Phone Number Management**: Collect and manage user phone numbers with validation
- **Session Management**: View and manage all active sessions with device information
- **Public & Private Pages**: Public landing page at `/` and authenticated dashboard at `/private`
- **Device Detection**: Automatic browser, OS, and device type identification
- **Admin API Endpoints**: Backend API routes for administrative operations
- **Professional UI**: Clean, modern interface with smooth animations and responsive design

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.2.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

### Authentication & Security
- **Auth0** - Authentication provider via `@auth0/nextjs-auth0`
- Custom session management with device tracking
- Layout-based route protection for authenticated pages
- Auth0 Management API integration for admin operations

### Database & ORM
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle ORM 0.44.7** - Type-safe database operations
- **Drizzle Kit** - Database migrations and schema management

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- Custom animations with Tailwind

### Additional Libraries
- **SWR** - Data fetching and caching
- **Axios** - HTTP client
- **UAParser.js** - User agent parsing for device detection

---

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth-required)/      # Layout-protected routes
│   │   │   ├── phone-number/     # Phone number management
│   │   │   └── sessions/         # Session management
│   │   ├── private/              # Private dashboard page (self-protected)
│   │   ├── api/                  # API routes
│   │   │   ├── admin/            # Admin endpoints
│   │   │   ├── auth/             # Auth endpoints
│   │   │   ├── sessions/         # Session management
│   │   │   └── user/             # User endpoints
│   │   ├── page.tsx              # Public homepage
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication components
│   │   └── pages/                # Page-specific components
│   ├── db/                       # Database layer
│   │   ├── schema/               # Database schemas
│   │   └── index.ts              # Database connection
│   ├── lib/                      # Business logic
│   │   ├── api/                  # API clients
│   │   ├── auth/                 # Auth utilities
│   │   └── db/                   # Database services
│   ├── helpers/                  # Utility functions
│   └── middleware.ts             # Auth0 middleware + device ID tracking
├── drizzle/                      # Database migrations
└── public/                       # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- npm package manager
- Auth0 account
- Neon PostgreSQL database

### Navigate to Project Directory

Before proceeding with any installation or setup steps, navigate to the frontend project directory:

```bash
cd frontend-nexjs
```

All commands below should be executed from within the `frontend-nexjs` directory.

### Environment Variables

Create a `.env.local` file in the `frontend-nexjs` directory with the following required variables:

```env
# Auth0 Configuration
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=
AUTH0_ISSUER_BASE_URL=

# Database
DATABASE_URL=

# Auth0 Management API (for admin operations)
MGMT_CLIENT_ID=
MGMT_CLIENT_SECRET=
MGMT_AUDIENCE=
```

### Installation

```bash
# Install dependencies
npm install

# Generate database schema
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The application will be available at `http://localhost:3623`

### Database Commands

```bash
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

---

## 💡 How It Works

### N-Device Limit Flow

The system enforces a limit (N=3) on concurrent device sessions per user.

1. **User Login**: When a user logs in, the system records:
   - Device information (browser, OS, device type)
   - Session metadata (login time, last active)
   - Unique session identifier

2. **Device Count Check**: Before creating a new session:
   - System retrieves max devices from `appSettings` table (default: 3)
   - Counts active sessions for the user
   - If count < 3, session is created normally
   - If count ≥ 3, user is redirected to sessions page with device limit error

3. **Force Logout**: User can choose to:
   - Cancel login (stay logged out)
   - Force logout an existing device (select from list)
   - View details of all active sessions

4. **Graceful Revocation**: When a session is revoked:
   - Database marks session as revoked
   - Middleware detects revocation on next request
   - User sees professional notification page
   - Cleanup happens automatically

### Session Management

Sessions are tracked in the `userSessions` database table with the following structure:
- `id`: Unique session UUID
- `userId`: Reference to user
- `deviceId`: Unique device identifier (cookie-based)
- `auth0Sid`: Auth0 session ID
- `status`: Session status ('active' or 'revoked')
- Device information: `browserName`, `browserVersion`, `osName`, `osVersion`, `deviceType`
- Revocation tracking: `revokedReason`, `revokedByDeviceId`, `revokedAt`
- Timestamps: `lastSeen`, `createdAt`

### Middleware & Device Tracking

Global middleware (`src/middleware.ts`) runs on every request:
- Executes Auth0 authentication middleware
- Generates and sets a unique `device_id` cookie for device tracking
- Cookie persists for 7 days with httpOnly and sameSite protection

### Route Protection

**Auth-Required Layout Protection** (`/phone-number`, `/sessions`):
- Routes under `(auth-required)` group are protected by `src/app/(auth-required)/layout.tsx`
- Verifies Auth0 session before rendering
- Checks for session revocation status
- Redirects unauthenticated users to login

**Private Page Protection** (`/private`):
- Self-protected with its own authentication logic in `src/app/private/page.tsx`
- Verifies Auth0 session and device ID
- Checks for session revocation and displays revocation message
- Enforces device limits and redirects if exceeded
- Requires phone number to be set

---

## 📱 Features in Detail

### Public Page (`/`)
- Clean landing page with authentication options
- Accessible to all users without authentication
- Responsive design with smooth animations
- Login/Signup buttons with Auth0 integration

### Private Page (`/private`)
- Displays user's full name
- Shows registered phone number
- Protected by authentication layout
- Graceful error handling
- Requires phone number to be set

### Phone Number Management (`/phone-number`)
- Phone number collection form
- Validation and formatting
- Update capability
- Required for full account access
- Protected by auth-required layout

### Session Management (`/sessions`)
- View all active sessions for current user
- See device information (browser, OS, device type)
- Revoke individual sessions
- Last active timestamps
- Protected by auth-required layout

### Device Limit Exceeded Flow
- When limit is exceeded, user is redirected to sessions page with error
- Professional UI showing current active sessions
- Device details with icons
- Login time and last active info
- User can revoke an existing session to continue

### Revoked Session Page
- Displayed when accessing `/private` with a revoked session
- Clear explanation of force logout
- Shows revocation details (time, device that revoked it)
- Call-to-action to log back in
- Professional messaging

---

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Animations**: Smooth transitions and hover effects
- **Toast Notifications**: Real-time feedback using Sonner
- **Icon System**: Consistent iconography with Lucide React
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: User-friendly error messages

---

## 🔐 Security Features

- **Auth0 Integration**: Industry-standard authentication with Management API
- **Secure Session Management**: Token-based session tracking with device fingerprinting
- **Route Protection**: Layout-based access control for protected routes
- **Environment Variables**: Sensitive data secured in `.env.local`
- **Database Security**: Parameterized queries via Drizzle ORM
- **Session Revocation**: Immediate force logout capability with database-level tracking
- **HTTPS**: Secure communication in production

---

## 📊 Database Schema

### users
- `id`: Primary key (UUID)
- `auth0Id`: Auth0 user ID (unique)
- `displayName`: Display name from Auth0
- `email`: User email address
- `emailVerified`: Email verification status
- `pictureUrl`: Profile picture URL
- `fullName`: User's full name
- `phone`: Phone number
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### userSessions
- `id`: Primary key (UUID)
- `userId`: Foreign key to users
- `deviceId`: Unique device identifier (from cookie)
- `auth0Sid`: Auth0 session ID
- `status`: 'active' or 'revoked'
- `browserName`, `browserVersion`: Browser information
- `osName`, `osVersion`: Operating system information
- `deviceType`: Device type (desktop, mobile, tablet)
- `isBot`: Boolean flag for bot detection
- `ipAddress`: User IP address
- `revokedReason`: Reason for revocation
- `revokedByDeviceId`: Device that triggered revocation
- `revokedAt`: Revocation timestamp
- `lastSeen`: Last activity timestamp
- `createdAt`: Session creation timestamp

### appSettings
- `id`: Primary key
- `maxDevices`: Maximum concurrent devices per user (integer, default: 3)
- `inactivityDays`: Days of inactivity before session cleanup (integer, default: 7)
- `createdAt`: Settings creation timestamp
- `updatedAt`: Last update timestamp

**Default Configuration**:
- `maxDevices`: 3 (maximum number of concurrent device logins)
- `inactivityDays`: 7 (days before inactive session cleanup)

Settings are loaded from database with fallback to defaults if not configured.

---

## 🧪 Development Notes

### Port Configuration
The application runs on port **3623** (both development and production) to avoid conflicts with other Next.js applications.

### Type Safety
- Full TypeScript coverage
- Strict mode enabled
- No `any` types used
- Comprehensive interface definitions

### Code Quality
- ESLint with Next.js recommended rules
- Consistent code formatting
- Modular component structure
- Clear separation of concerns

---

## 📝 Developer Note

**Important**: This project was developed primarily through manual coding by reading official documentation and implementing features step-by-step. **AI assistance was only used for**:
- Generating documentation
- Writing code comments
- Creating small helper functions

**All core functionality, architecture, authentication flows, database design, session management logic, and UI/UX implementation was developed manually** to demonstrate:
- Strong documentation reading and comprehension skills
- Ability to integrate complex services (Auth0, Neon, Drizzle)
- Understanding of authentication and session management concepts
- TypeScript and Next.js proficiency
- Problem-solving capabilities without relying on code generation tools

This approach ensures the code represents genuine development skills and architectural understanding rather than AI-generated solutions.

---

## 🌐 Deployment

### Vercel Deployment

The application is deployed on Vercel with:
- Automatic deployments from Git
- Environment variables configured in Vercel dashboard
- Production database (Neon PostgreSQL)
- Custom domain support

**Live URL**: [https://nextjs-auth0-n-device-limit.vercel.app/](https://nextjs-auth0-n-device-limit.vercel.app/)

### Environment Setup (Vercel)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

---

## 📚 API Documentation

### Public Endpoints
- `GET /` - Homepage
- `GET /api/auth/login` - Auth0 login redirect
- `GET /api/auth/logout` - Auth0 logout

### Protected Page Routes
- `GET /private` - Private dashboard page (displays user info)
- `GET /phone-number` - Phone number management page
- `GET /sessions` - Session management page

### User API Endpoints (Protected)
- `POST /api/user/phone` - Update user phone number
- `POST /api/sessions/revoke` - Revoke a specific session
- `POST /api/auth/logout-with-cleanup` - Logout with database session cleanup

### Admin API Endpoints (Protected)
- `GET /api/admin/current-user` - Get current authenticated user details
- `GET /api/admin/users/[userId]/sessions` - Get all sessions for a specific user
- `POST /api/admin/sessions/revoke` - Revoke a specific session (admin)
- `POST /api/admin/users/[userId]/revoke-all` - Revoke all sessions for a user

---

## 🤝 Contributing

This is a demonstration project for an assignment. For production use, consider:
- Adding rate limiting
- Implementing refresh token rotation
- Adding email notifications for force logouts
- Building an admin dashboard UI
- Implementing dynamic app settings configuration
- Adding user activity logs
- Implementing two-factor authentication

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 👤 Author

Developed as part of the NGuard technical assignment, showcasing:
- Full-stack development capabilities
- Authentication system design
- Modern React/Next.js patterns
- Database design and management
- Professional UI/UX implementation
- Documentation skills

---

## 🙏 Acknowledgments

- **Next.js** - The React Framework
- **Auth0** - Authentication Platform
- **Neon** - Serverless PostgreSQL
- **Vercel** - Deployment Platform
- **Drizzle** - TypeScript ORM
