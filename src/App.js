import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TrackingProvider } from "./context/TrackingContext";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Tracking from "./pages/Tracking";
import FavoritesPage from "./pages/FavoritesPage";
import AIChat from "./pages/AIChat";
import CardPage from "./pages/CardPage";
import DailyActivityCharts from "./pages/DailyActivityCharts";
import ProductViewStatistics from "./pages/ProductViewStatistics";
import TimeSpentStatistics from "./pages/TimeSpentStatistics";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { scale: 2, duration: 0.2 });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TrackingProvider>
            <CartProvider>
              <FavoritesProvider>
                <Router>
                  <ErrorBoundary>
                    <div className="app-container">
                      <CustomCursor ref={cursorRef} />
                      <Navbar />
                      <PageTransition>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/chat" element={<AIChat />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/card" element={<CardPage />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/tracking" element={<Tracking />} />
                          <Route path="/favorites" element={<FavoritesPage />} />
                          <Route path="/dailyActivityCharts" element={<DailyActivityCharts />} />
                          <Route path="/productViewStatistics" element={<ProductViewStatistics />} />
                          <Route path="/timeSpentStatistics" element={<TimeSpentStatistics />} />
                        </Routes>
                      </PageTransition>
                      <Footer />
                      <Toaster position="bottom-right" />
                    </div>
                  </ErrorBoundary>
                </Router>
              </FavoritesProvider>
            </CartProvider>
          </TrackingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;