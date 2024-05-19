import { Nav, NavLink } from "@/components/Nav";
import dynamic from "next/dynamic";

const CubeScene = dynamic(() => import("@/components/explosion/cube-scene"), {
  ssr: false,
});
export default function Home() {
  return (
    <main className="flex flex-col w-full h-screen">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/scroll">Scroll</NavLink>
      </Nav>
      <CubeScene />
    </main>
  );
}
