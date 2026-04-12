"use client";
import { useRouter } from "next/navigation";
import MainMenu from "@/components/screens/MainMenu";

export default function Home() {
  const router = useRouter();

  return (
    <MainMenu
      onPlay={() => router.push("/play")}
      onLeaderboard={() => router.push("/leaderboard")}
    />
  );
}
