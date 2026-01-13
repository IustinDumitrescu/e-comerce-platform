  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App.jsx'
  import UserProvider from './contexts/AuthContext.jsx'
  import CartProvider from './contexts/CartContext.jsx'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

  const queryClient = new QueryClient();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
         <QueryClientProvider client={queryClient}>
          <UserProvider>
            <CartProvider>
               <App />
            </CartProvider>
          </UserProvider>
        </QueryClientProvider>
    </StrictMode>,
  )
