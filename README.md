# Smart Nyuki - Beekeeping Management App

Smart Nyuki is a comprehensive beekeeping management application that helps beekeepers monitor and manage their apiaries and hives with real-time data.

## Authentication Features

The app now includes a complete authentication system powered by Supabase. Users can:

- **Sign Up**: Create a new account with email and password
- **Sign In**: Authenticate with existing credentials
- **Password Reset**: Request a password reset email
- **Profile Management**: View account details and sign out
- **Protected Routes**: Secure app routes requiring authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npx expo start
   ```

## Authentication Flow

The authentication flow utilizes Supabase's authentication services:

1. **Sign Up**:
   - User creates an account with email and password
   - Email verification is sent to confirm the account
   - After verification, user can sign in

2. **Sign In**:
   - User provides email and password
   - On successful authentication, they're redirected to the main app
   - Authentication state is maintained across app sessions

3. **Password Reset**:
   - User requests a password reset by providing their email
   - A reset link is sent to their email
   - User follows the link to set a new password

4. **Protected Routes**:
   - Routes in the main app are protected
   - Unauthenticated users are redirected to the sign-in screen
   - Authentication state is managed via the AuthContext

## Project Structure

- `context/AuthContext.tsx`: Manages authentication state and methods
- `app/(auth)/`: Contains authentication-related screens
  - `sign-in.tsx`: Sign-in screen
  - `sign-up.tsx`: Sign-up screen
  - `forgot-password.tsx`: Password reset screen
- `app/(tabs)/profile.tsx`: Profile management screen

## Supabase Integration

The app uses Supabase for:

- User authentication and management
- Real-time database for hive and apiary data
- Data syncing across devices

## Customizing Authentication

To customize the authentication experience:

1. Update the UI in the authentication screens
2. Modify validation rules in the sign-up and sign-in handlers
3. Add additional fields to the user profile in Supabase
4. Implement social login providers (Google, Apple, etc.) via Supabase

## Security Best Practices

- Credentials are securely managed by Supabase
- JWT tokens are used for session management
- Password requirements enforce strong security
- Email verification prevents unauthorized sign-ups

## Next Steps

Planned enhancements for the authentication system:

1. Social login integration (Google, Apple)
2. Multi-factor authentication
3. Enhanced user profile with customization options
4. Role-based access control for team management
