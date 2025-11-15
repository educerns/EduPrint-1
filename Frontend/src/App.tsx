import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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
import MyVideoGallery from "./components/MyVideoGallery";
import Editor from "./editor/editor";
import VideoGallery from "./pages/VideoGallery";
import VideoEditorPage from "./pages/VideoEditorPage";

const queryClient = new QueryClient();

// Scroll to Top Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Main pages */}
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="contact" element={<Contact />} />

                {/* Special pages */}
                <Route path="paid-promotion" element={<PaidPomotion />} />
                <Route path="free-videos" element={<VideoGallery />} />
                <Route path="video-editor" element={<VideoEditorPage />} />
                <Route path="my-videos" element={<MyVideoGallery />} />

                {/* Legal pages */}
                <Route path="terms" element={<TermsOfService />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="returns" element={<ReturnRefund />} />
                <Route path="cookies" element={<CookiePolicy />} />

                {/* Editor page */}
                <Route path="editor/:id" element={<Editor />} />

                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
