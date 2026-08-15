import { HouseHall } from "@/components/house-hall";
import { PortfolioExperience } from "@/components/portfolio-experience";
import { RoomNavigation } from "@/components/room-navigation";
import { WorldExpansion } from "@/components/world-expansion";

export default function Home() {
  return (
    <>
      <PortfolioExperience />
      <HouseHall />
      <RoomNavigation />
      <WorldExpansion />
    </>
  );
}
