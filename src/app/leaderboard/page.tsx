"use client";
import { useRouter } from "next/navigation";
import LeaderboardScreen from "@/components/screens/LeaderboardScreen";

export default function LeaderboardPage() {
  const router = useRouter();

  return <LeaderboardScreen onBack={() => router.push("/")} />;
}
