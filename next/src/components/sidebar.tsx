"use client";
import clsx from "clsx";
import {
  History,
  LayoutGrid,
  PlusCircle,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Sidebar() {
  let [history, setHistory] = useState();
  let current_link = usePathname();
  const current = ({ path }: { path: string }) => {
    if (current_link.startsWith(path)) {
      return true;
    } else {
      return false;
    }
  };
  console.log(current_link);
  useEffect(() => {
    let stream = new WebSocket("ws://127.0.0.1:7878");
    stream.onopen = () => {
      console.log("Opening");
      stream.send('{"request":"history4"}');
    };
    stream.onmessage = (e) => {
      // console.log(e.data);
      setHistory(e.data);
    };
    stream.onclose = () => {
      console.log("Closing");
    };
  });
  let link = [
    {
      href: "/explore",
      title: "Explore",
      icon: <Search className="w-5 h-5" />,
    },
    {
      href: "/food",
      title: "Foods",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      href: "/rooms",
      title: "Rooms",
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      href: "/history",
      title: "History",
      icon: <History className="w-5 h-5" />,
    },
  ];
  let historys = history && JSON.parse(history);
  return (
    <div className="w-[280px] border-r h-screen p-4 flex flex-col sticky top-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 rounded-lg">
          <Image
            src={"/icon.png"}
            alt=""
            width={40}
            height={40}
            className=" w-[32px] h-[30px]"
          />
        </div>
        <span className="font-medium text-slate-600">Explore</span>
      </div>

      {/* <button className="flex items-center gap-2 w-full rounded-full border p-3 text-gray-600 hover:bg-gray-50 transition-colors mb-6">
        <PlusCircle className="w-5 h-5" />
        <span>New chat</span>
      </button> */}

      <nav className="space-y-2 pt-6">
        {link.map((link) => (
          <Link
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg",
              current({ path: link.href }) ? "bg-green-300" : "hover:bg-gray-50"
            )}
            key={link.title}
          >
            {link.icon}
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
