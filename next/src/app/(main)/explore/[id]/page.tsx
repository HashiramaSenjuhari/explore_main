"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import SearchBar from "@/components/input";
import { revalidatePath } from "next/cache";

export default function Dynamic() {
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
      let lattitude = location.lattitude;
      let longitude = location.longitude;
      let message = JSON.stringify({
        lattitude: lattitude,
        longitude: longitude,
        id: id,
        interest: value,
      });
      //
      //
      console.log(message);
      //
      ws.send(message);
      //
      //
      let reload = window.location.reload();
      window.onload = () => {
        window.scrollTo({
          behavior: "smooth",
          top: document.documentElement.scrollWidth + 4000,
        });
      };
      revalidatePath(`/explore/${id}`);
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.onclose = () => {
      console.log("Closing");
    };
  };

  let [height, setHeight] = useState<number>();
  useEffect(() => {
    let scrollHeight = document.documentElement.scrollHeight;
    setHeight(scrollHeight);
  }, []);
  useEffect(() => {
    window.onload = () => {
      let windowHeight = window.innerWidth;
      window.scroll({
        behavior: "smooth",
        top: height - windowHeight + 4000,
      });
    };
  }, [height]);
  return (
    <div className="h-full w-full pt-4">
      <main className="flex-1 p-6 pb-24">
        {msg ? (
          msg?.map((map, index) => {
            let output = JSON.parse(map[3].output);
            return (
              <div
                className="max-w-[900px] w-[900px] mx-auto flex flex-col"
                key={index}
              >
                <div className="flex items-center gap-4 mb-8 flex-row-reverse">
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
                  <p className="text-sm">{map[2].input}</p>
                </div>

                {/* // let biliionaire_id = map[0].id;
            // let chat_id = map[1].id;
            // let input = map[2].input;
            // let output = map[3].output;
            // console.log(biliionaire_id, chat_id, input, output); */}
                <div className=" flex " key={map[1].id}>
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
                  <CardContent className=" flex justify-center items-center">
                    {/* <div className=""> */}
                    {/* <div className=""> */}
                    {/* <Image
                    src=""
                    alt="SS Hydrabad Biriyani"
                    fill
                    className="object-cover rounded-l-lg"
                  /> */}
                    {/* </div> */}
                    {/* <div className=""> */}
                    {/* <pre className="text-sm font-semibold"> */}
                    {Object.entries(output).map(([output, value]) => {
                      let state = value?.state;
                      let city = value?.city;
                      let rating = value?.google_rating;
                      let place = value?.popular_destination;
                      let fare = value?.price_fare;

                      // popular_destination: "Tidel Park Coimbatore";
                      // price_fare: "0";
                      console.log(output, value);
                      return (
                        <div key={output}>
                          <p>{state}</p>
                          <p key={output}>{city}</p>
                          <p>{rating}</p>
                          <p>{place}</p>
                          <p>{fare}</p>
                        </div>
                      );
                    })}
                    {/* </pre> */}
                    {/* {map[3].output[0]} */}
                    {/* <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">Rating 9.0</span>
                        <div className="flex ml-2">
                          {[...Array(4)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    </div> */}
                    {/* <p className="mb-2">Price 400</p>
                    <p className="text-sm text-gray-600 mb-4">Near by 4 km</p>
                    <Button>Order Now</Button> */}
                    {/* </div> */}
                    {/* </div> */}
                  </CardContent>
                </div>

                {/* <p ref={value}></p> */}

                <div className="fixed bottom-4 w-[64%] bg-background">
                  <SearchBar loading={searching} values={value} />
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </main>
    </div>
  );
}
