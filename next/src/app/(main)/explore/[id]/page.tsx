"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchBar from "@/components/input";
import AttractionsTable from "../cards/place";
import { Loader, User } from "lucide-react";

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
    navigator.geolocation.getCurrentPosition((location) => {
      setLocation({
        lattitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  }, [msg]);
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
          lattitude: lattitude,
          longitude: longitude,
          id: id,
          interest: value,
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
      <div className="mapouter"></div>
      <main className="flex-1 p-6 pb-24 flex flex-col gap-y-6">
        {msg ? (
          msg?.map((map, id) => {
            // let id = map[1];
            let input = map[2].input;
            let response = map[3].output;
            let places = JSON.parse(response)[0];

            // latitude,
            //   longitude,
            //   interest,
            //   city,
            //   popular_destination,
            //   google_rating,
            //   price_fare,
            //   suggested;

            let suggested = places.suggested;

            return (
              <div
                className="max-w-[900px] w-[900px] mx-auto flex flex-col"
                key={id}
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
                <div className=" flex gap-x-4" key={id}>
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
                  <div className=" w-full h-full">
                    {/* <div className="rounded-lg border bg-card text-card-foreground"> */}
                    <AttractionsTable
                      suggest={suggested}
                      location={location}
                      id={input}
                    />
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
