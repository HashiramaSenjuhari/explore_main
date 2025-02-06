import { Headphones, Search, Sun, Target } from "lucide-react";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { FeatureCard } from "@/components/feature";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className=" w-full min-h-screen">{children}</div>
    </div>
  );
}
