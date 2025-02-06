"use client";
import clsx from "clsx";
import {
  History,
  LayoutGrid,
  PlusCircle,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  let current_link = usePathname();
  const current = ({ path }: { path: string }) => {
    if (current_link.startsWith(path)) {
      return true;
    } else {
      return false;
    }
  };
  console.log(current_link);
  let recent = [
    {
      href: "string",
      title: "billionairee great hari",
    },
  ];
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
  return (
    <div className="w-[280px] border-r h-screen p-4 flex flex-col sticky top-0">
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="p-1 rounded-lg bg-gray-100">
          <Search className="w-5 h-5 text-gray-600" />
        </div>
        <span className="font-medium">Explore</span>
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

      <div className="mt-8">
        <h3 className="text-sm text-gray-500 px-3 mb-2">Recent Chats</h3>
        <div className="space-y-1">
          {recent.map((b) => (
            <Link
              href={b.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              key={b.title}
            >
              <div className="w-5 h-5 flex items-center">≡</div>
              <span>{b.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
