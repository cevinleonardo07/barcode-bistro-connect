
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Cashier from "./pages/Cashier";
import Kitchen from "./pages/Kitchen";
import Menu from "./pages/Menu";
import Tables from "./pages/Tables";
import OrderPage from "./pages/OrderPage";
import OrderHistory from "./pages/OrderHistory";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/cashier" element={<Layout><Cashier /></Layout>} />
          <Route path="/kitchen" element={<Layout><Kitchen /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/tables" element={<Layout><Tables /></Layout>} />
          <Route path="/order/:tableId" element={<OrderPage />} />
          <Route path="/order-history" element={<Layout><OrderHistory /></Layout>} />
          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
