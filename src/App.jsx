import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SEOHead from "./components/SEOHead";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import About from "./components/About";
import Chapter from "./components/Chapter";
import ImpactStories from "./components/ImpactStories";
import Partners from "./components/Partners";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ApplyPage from "./pages/ApplyPage";
import DirectoryPage from "./pages/DirectoryPage";
import AlumniPage from "./pages/AlumniPage";
import InitiativePage from "./pages/InitiativePage";
import TeamPage from "./pages/TeamPage";
import InitiativesNewsPage from "./pages/InitiativesNewsPage";
import InitiativeArticlePage from "./pages/InitiativeArticlePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AccessibilityWidget from "./components/AccessibilityWidget";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RLC Madagascar Chapter",
  url: "https://rlcmadagascar.org",
  logo: "https://rlcmadagascar.org/logo_rlc.png",
  description:
    "Réseau de +600 alumni YALI Regional Leadership Center présents dans les 21 régions de Madagascar. Leadership, entrepreneuriat, gouvernance et engagement civique.",
  foundingLocation: {
    "@type": "Place",
    name: "Madagascar",
  },
  sameAs: [
    "https://www.facebook.com/yalirlcmg",
    "https://www.linkedin.com/company/yalirlcmg",
  ],
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function Home() {
  return (
    <>
      <SEOHead
        description="RLC Madagascar Chapter — réseau de +600 alumni YALI Regional Leadership Center présents dans les 21 régions de Madagascar. Leadership, entrepreneuriat, gouvernance et engagement civique."
        url="/"
        jsonLd={ORGANIZATION_JSON_LD}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Programs />
        <About />
        <Chapter />
        <ImpactStories />
        <Partners />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <a href="#main-content" className="skip-to-content">
            Aller au contenu principal
          </a>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/alumni/:index" element={<InitiativePage />} />
            <Route path="/initiatives/spotlight" element={<InitiativesNewsPage category="spotlight" />} />
            <Route path="/initiatives/fireside" element={<InitiativesNewsPage category="fireside" />} />
            <Route path="/initiatives/autres" element={<InitiativesNewsPage category="autres" />} />
            <Route path="/initiatives/article/:id" element={<InitiativeArticlePage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
          <AccessibilityWidget />
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}
