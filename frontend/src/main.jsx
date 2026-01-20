  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App.jsx'
  import UserProvider from './contexts/AuthContext.jsx'
  import CartProvider from './contexts/CartContext.jsx'
  import  NotificationProvider  from './contexts/NotificationContext.jsx'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { SnackbarProvider} from 'notistack'

  const queryClient = new QueryClient();

  createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <SnackbarProvider maxSnack={3}>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <NotificationProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </NotificationProvider>
            </UserProvider>
          </QueryClientProvider>
        </SnackbarProvider>
    // </StrictMode>
  )
