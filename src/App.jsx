import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
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
import AccessibilityWidget from "./components/AccessibilityWidget";

function Home() {
  return (
    <>
      <Navbar />
      <main>
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/alumni/:index" element={<InitiativePage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
        <AccessibilityWidget />
      </BrowserRouter>
    </LangProvider>
  );
}
