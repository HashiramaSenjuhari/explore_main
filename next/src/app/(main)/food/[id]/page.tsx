"use client";

import { Loader, Star, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import SearchBar from "@/components/input";
import { revalidatePath } from "next/cache";
import { getDistance } from "geolib";
import AttractionsTable from "../cards/place";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import {
  ChevronDown,
  ChevronUp,
  MapPin,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { renderStars } from "@/components/star/rating";
import Modal from "../cards/modal";

type SortKey = "distance" | "rating" | "price";
type SortOrder = "asc" | "desc";

export default function Dynamic() {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <SortAsc className="w-4 h-4 opacity-50" />;
    return sortOrder === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  let url = useParams();
  let id = url.id;
  let [msg, setMsg] = useState();
  let [searching, setSearch] = useState<boolean>();
  let [location, setLocation] = useState({
    lattitude: 0,
    longitude: 0,
  });
  // let p = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      setLocation({
        lattitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  }, []);
  useEffect(() => {
    // value.current.innerHTML = '<p style={{color:"blue"}}>thinking</p>';
    let stream = new WebSocket("ws://127.0.0.1:7878");
    stream.onopen = () => {
      console.log("Opening the Connection");
      if (id) {
        let ids = JSON.stringify({
          cid: id,
        });
        stream.send(ids);
      }
    };
    stream.onmessage = (e) => {
      // console.log("billionaire");
      setMsg(JSON.parse(e.data));
      // value.current.innerText = "";
      // value.current.innerText += e.data;
    };
    stream.onerror = (e) => {
      console.log(e);
    };
    stream.onclose = () => {
      console.log("Closing the Connection");
    };
    return () => {
      if (stream.readyState == WebSocket.OPEN) {
        stream.close();
      }
    };
  }, []);

  let value = (value: string) => {
    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      //
      console.log("Opening stream");

      //
      //
      if (location) {
        console.log(location);
        let lattitude = location.lattitude;
        let longitude = location.longitude;
        let message = JSON.stringify({
          lat: lattitude,
          lon: longitude,
          cousine: value,
          id: id,
        });
        console.log(message);
        ws.send(message);
        window.location.reload();
      }
      //
      //
      //
      //
      //
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.onclose = () => {
      console.log("Closing");
    };
  };
  // console.log(msg);
  let [height, setHeight] = useState<number>();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  useEffect(() => {
    const scroll = () => {
      // if (msg?.len > 1) {
      setTimeout(() => {
        let scrollHeight = document.documentElement.scrollHeight;
        let windowHeight = window.innerWidth;
        window.scroll({
          behavior: "smooth",
          top: scrollHeight - windowHeight + 4000,
        });
      }, 60);
      // }
    };
    scroll();
  }, [msg]);
  return (
    <div className="h-full w-full pt-4 flex  p-24">
      <main className="flex-1 pb-24 flex flex-col gap-y-6 w-full  p-6">
        {msg ? (
          msg?.map((map, id) => {
            // let index = map[1];
            let input = map[2].input;
            let response = map[3].output;
            let places = JSON.parse(response)[0];
            let suggest = places.suggested;
            // console.log(suggest);
            return (
              <div key={id} className=" flex  flex-col">
                <div className="flex items-center gap-4 mb-8 flex-row-reverse">
                  <div className="p-2 rounded-lg">
                    <User />
                  </div>
                  <p className="text-sm bg-slate-100 h-full p-4 rounded-full">
                    {input}
                  </p>
                </div>
                <div className=" flex items-start gap-x-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        // strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div className=" flex flex-col w-[76%] gap-y-4">
                    <AttractionsTable location={location} suggest={suggest} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className=" w-full h-full flex justify-center items-center text-center gap-x-4">
            Thinking
            <Loader className=" animate-spin" />
          </div>
        )}
        <div className="fixed bottom-4 w-[64%] bg-background">
          <SearchBar loading={searching} values={value} />
        </div>
      </main>
    </div>
  );
}

function restraruent() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-salad"
    >
      <path d="M7 21h10" />
      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
      <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1" />
      <path d="m13 12 4-4" />
      <path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2" />
    </svg>
  );
}
