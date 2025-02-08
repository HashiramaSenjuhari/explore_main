"use client";
import { FeatureCard } from "@/components/feature";
import SearchBar from "@/components/input";
import {
  BedDouble,
  BedSingle,
  Headphones,
  Hotel,
  Search,
  Sun,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Food = () => {
  let router = useRouter();
  let [id, setId] = useState<string>();
  // let [value, setValue] = useState<string>();
  let [loading, setLoading] = useState<boolean>(false);
  let [isSumitted, setIsSubmitted] = useState<boolean>(true);

  useEffect(() => {
    if (!isSumitted) {
      return;
    }
    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      console.log("Opening the Connection");
      let uuid = JSON.stringify({ model: "rooms" });
      ws.send(uuid);
    };
    ws.onmessage = (e) => {
      console.log(e.data);
      if (e.data.length > 0 && e.data.startsWith('{"id')) {
        let json = JSON.parse(e.data);
        setId(json.id);
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
  }, [isSumitted]);

  const values = (value: string) => {
    // console.log(id);
    setLoading(true);
    setIsSubmitted(true);
    router.push(`/rooms/${id}`);

    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      // console.log(location);
      console.log("Opening the Connection");
      // console.log(search);
      let b = JSON.stringify({
        address: value,
        rating: value,
        final_cost: value,
        id: id,
        input: value,
      });
      console.log(b);
      ws.send(b);
    };
    setLoading(false);
  };
  return (
    <main className="flex-1 p-9 flex justify-center items-center flex-col w-full h-full">
      <div className="w-full mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Welcome, Davis</h1>
        <p className="text-xl text-gray-500 mb-8">What's on your mind today?</p>

        <div className="relative max-w-xl mx-auto">
          <SearchBar values={values} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={BedDouble}
          title=""
          description="Recommend great hotel to say in mylapore"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
        />
        <FeatureCard
          icon={Hotel}
          title=""
          description="Recommend best hotel with high rating in chennai chepakkam at low cost"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-50"
        />
        <FeatureCard
          icon={BedSingle}
          title=""
          description="Now you can talk to get help"
          iconColor="text-pink-500"
          iconBgColor="bg-pink-50"
        />
      </div>
    </main>
  );
};

export default Food;
