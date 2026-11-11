import { Navbar } from "@/components/ui/Navbar";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { FightRecord } from "@/components/sections/FightRecord";
import { Team } from "@/components/sections/Team";
import { NamesBand } from "@/components/sections/NamesBand";
import { SponsorCall } from "@/components/sections/SponsorCall";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CinematicReveal />
        <FightRecord />
        <Team />
        <NamesBand />
        <SponsorCall />
      </main>
      <Footer />
      <ScrollCue />
    </>
  );
}
