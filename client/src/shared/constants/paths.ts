/* ----------------------------------------------------
  Paths Builders Utility Functions
---------------------------------------------------- */

const buildAuthPath = (subPath: string) =>
  `/auth${subPath ? `/${subPath}` : ''}`;

/* ----------------------------------------------------
   Application Paths
---------------------------------------------------- */

export const APP_PATHS = {
  /** Base path of the application */
  BASE: '/',
  EXAMPLE: '/example',
  CONTACT: '/contact',

  /** Main application pages */
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  TRANSACTIONS: '/transactions',
  SETTINGS: '/settings',

  /** Authentication-related routes */
  AUTH: {
    BASE: buildAuthPath(''),
    LOGIN: buildAuthPath('login'),
    REGISTER: buildAuthPath('register'),
    FORGOT_PASSWORD: buildAuthPath('forgot-password'),
  },
} as const;
