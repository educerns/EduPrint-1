
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductDetailPage from "@/components/ProductDetailPage";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import TemplatesPage from "./pages/TemplatesPage";
import Contact from "./components/Contact";
import TermsOfService from "./components/ui/termsOfService";
import PrivacyPolicy from "./components/ui/privacyPolicy";
import ReturnRefund from "./components/ui/returnRefund";
import CookiePolicy from "./components/ui/cookiePolicy";
import PaidPomotion from "./components/PaidPomotion";
import VideoGallery from "./components/VideoGallery";
import VideoEditor from "./components/VideoEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,   // ✅ Add this
            }}
          >

            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="contact" element={<Contact />} />
                <Route path="/paid-promotion" element={<PaidPomotion />} />
                <Route path="/free-videos" element={<VideoGallery />} />
                <Route path="/video-editor" element={<VideoEditor />} />


                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/returns" element={<ReturnRefund />} />
                <Route path="/cookies" element={<CookiePolicy />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
