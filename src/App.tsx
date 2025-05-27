import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import { TransactionsProvider } from '@/context/TransactionsContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TransactionsProvider>
        <Layout />
        <Toaster />
      </TransactionsProvider>
    </ThemeProvider>
  );
}

export default App;