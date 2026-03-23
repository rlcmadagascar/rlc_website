import { LangProvider } from "./context/LangContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import About from "./components/About";
import ImpactStories from "./components/ImpactStories";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function App() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <Hero />
        <Programs />
        <About />
        <ImpactStories />
        <Partners />
      </main>
      <Footer />
    </LangProvider>
  );
}
