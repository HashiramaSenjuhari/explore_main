"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  let search = useSearchParams();
  let type = search.get("type");
  let [current, setCurrent] = useState<string>("food");
  let [History, setHistory] = useState();

  useEffect(() => {
    setCurrent(type);
  }, [type]);

  useEffect(() => {
    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      console.log("Opening the Connection");
      let uuid = JSON.stringify({ types: current });
      ws.send(uuid);
    };
    ws.onmessage = (e) => {
      // console.log(e.data);
      if (e.data.length > 0 && e.data.startsWith("")) {
        let json = JSON.parse(e.data);
        setHistory(json);
        // console.log(json);
      }
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.close = () => {
      console.log("closing the stream");
    };
    return () => {
      ws.close();
    };
  }, [current]);
  let router = useRouter();
  return (
    <div className=" h-full w-full">
      <Tabs defaultValue="food" className="w-full h-full p-6">
        <TabsList className=" w-full flex items-center">
          <TabsTrigger
            value="food"
            onClick={() => router.push("/history?type=food")}
          >
            Food
          </TabsTrigger>
          <TabsTrigger
            value="explore"
            onClick={() => router.push("/history?type=explore")}
          >
            Explore
          </TabsTrigger>
          <TabsTrigger
            value="rooms"
            onClick={() => router.push("/history?type=rooms")}
          >
            Rooms
          </TabsTrigger>
        </TabsList>
        {History
          ? History?.map((history) => {
              console.log(history);
              let id = history[0].id;
              let type = history[1].type;
              let timestamp = history[2].timestanp;
              console.log(id);
              console.log(type);
              console.log(timestamp);
              let link = `${type}/${id}`;
              return (
                <TabsContent value={type} className=" p-4 border" key={id}>
                  <Link href={link} className=" flex gap-x-6">
                    <div className=" flex gap-x-6">
                      <Badge>{type}</Badge>
                      <p>{id}</p>
                    </div>
                    <p>{timestamp}</p>
                  </Link>
                </TabsContent>
              );
            })
          : ""}
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
