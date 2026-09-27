import type { Metadata } from "next";
import LandingNav from "./components/landing/LandingNav";
import Hero from "./components/landing/Hero";
import Marquee from "./components/landing/Marquee";
import FeatureGrid from "./components/landing/FeatureGrid";
import GearShowcase from "./components/landing/GearShowcase";
import StatsBand from "./components/landing/StatsBand";
import MembershipCTA from "./components/landing/MembershipCTA";
import VenuesStrip from "./components/landing/VenuesStrip";
import LandingFooter from "./components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "L.A Basketball — Own the Court",
  description:
    "Book courts, join weekly runs and shop gear at L.A Basketball. Los Angeles' home for hoops — courts, games and gear under one roof.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <Hero />
        <Marquee />
        <FeatureGrid />
        <GearShowcase />
        <StatsBand />
        <MembershipCTA />
        <VenuesStrip />
      </main>
      <LandingFooter />
    </div>
  );
}
