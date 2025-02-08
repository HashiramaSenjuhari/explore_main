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
import AttractionsTable, { HotelCard } from "../cards/place";
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
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = "distance" | "rating" | "price";
type SortOrder = "asc" | "desc";

export default function Dynamic() {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  let url = useParams();
  let id = url.id;
  let [msg, setMsg] = useState();
  let [searching, setSearch] = useState<boolean>();
  // let p = useRef<HTMLParagraphElement>(null);

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
      console.log(e.data);
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
      // if (location) {
      //   console.log(location);
      let message = JSON.stringify({
        address: value,
        rating: value,
        final_cost: value,
        id: id,
        input: value,
      });
      console.log(message);
      ws.send(message);
      window.location.reload();
      // }
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
  // useEffect(() => {
  //   let scrollHeight = document.documentElement.scrollHeight;
  //   setHeight(scrollHeight);
  // }, []);
  useEffect(() => {
    const scroll = () => {
      setTimeout(() => {
        let scrollHeight = document.documentElement.scrollHeight;
        let windowHeight = window.innerWidth;
        window.scroll({
          behavior: "smooth",
          top: scrollHeight - windowHeight + 4000,
        });
      }, 60);
    };
    scroll();
  }, [msg]);
  return (
    <div className="h-full w-full pt-4">
      <div className="mapouter">
        {/* <div className="gmap_canvas"> */}
        {/* <iframe
            className="gmap_iframe"
            width="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=11.9139,79.8145&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe> */}

        {/* <a href="https://embed-googlemap.com">embed google maps in website</a>
        </div> */}
        {/* <style>.mapouter{position:relative;text-align:right;width:100%;height:400px;}.gmap_canvas {overflow:hidden;background:none!important;width:100%;height:400px;}.gmap_iframe {height:400px!important;}</style> */}
      </div>
      <main className="flex-1 p-6 pb-24 flex flex-col gap-y-6">
        {msg ? (
          msg?.map((map, index) => {
            console.log(map);
            // let index = map[1];
            let input = map[2].input;
            let response = map[3].output;
            let places = JSON.parse(response)[0];

            // console.log(places);
            // latitude,
            //   longitude,
            //   interest,
            //   city,
            //   popular_destination,
            //   google_rating,
            //   price_fare,
            //   suggested;

            let suggested = places.suggested;
            // console.log(JSON.parse(suggested));

            return (
              <div
                className="max-w-[900px] w-[900px] mx-auto flex flex-col"
                key={index}
              >
                <div className="flex items-center gap-4 mb-8 flex-row-reverse">
                  <div className="p-2 rounded-lg">
                    <User />
                  </div>
                  <p className="text-sm bg-slate-100 h-full p-4 rounded-full">
                    {input}
                  </p>
                </div>

                {/* // let biliionaire_id = map[0].id;
            // let chat_id = map[1].id;
            // let input = map[2].input;
            // let output = map[3].output;
            // console.log(biliionaire_id, chat_id, input, output); */}
                <div className=" flex gap-x-4" key={index}>
                  <div>
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
                  </div>
                  <div className=" w-full h-full flex flex-col gap-y-4">
                    {/* <div className="rounded-lg border bg-card text-card-foreground"> */}
                    {suggested.map((suggest, id) => (
                      <HotelCard attraction={suggest} key={id} />
                    ))}
                    {/* </div> */}
                  </div>
                </div>

                {/* <p ref={value}></p> */}

                <div className="fixed bottom-4 w-[64%] bg-background">
                  <SearchBar loading={searching} values={value} />
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
      </main>
    </div>
  );
}
