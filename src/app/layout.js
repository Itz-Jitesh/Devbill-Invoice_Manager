import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/notifications/ToastContainer';

export const metadata = {
  title: 'DevBill – Freelance Invoice Manager',
  description: 'Manage your invoices, clients, and cash flow like a pro.',
};

/**
 * Root layout for the entire application.
 * AuthProvider is placed here so both auth pages and dashboard pages
 * can access authentication state via useAuth().
 * DataProvider provides global access to invoices and clients data.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased font-body">
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <DataProvider>
                {children}
                <ToastContainer />
              </DataProvider>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
