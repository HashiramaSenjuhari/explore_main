"use client";
import { Headphones, Search, Sun, Target } from "lucide-react";
import { FeatureCard } from "@/components/feature";
import { useEffect, useState } from "react";
import SearchBar from "@/components/input";
import { useRouter } from "next/navigation";
import { search } from "./websocket";

export default function Explore() {
  let router = useRouter();
  let [id, setId] = useState<string>();
  // let [value, setValue] = useState<string>();
  let [loading, setLoading] = useState<boolean>(false);
  let [isSumitted, setIsSubmitted] = useState<boolean>(true);
  let [location, setLocation] = useState({
    lattitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!isSumitted) {
      return;
    }
    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      console.log("Opening the Connection");
      let uuid = JSON.stringify({ model: "explore" });
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      let lattitude = location.coords.latitude;
      let longitude = location.coords.longitude;
      setLocation({
        lattitude: lattitude,
        longitude: longitude,
      });
    });
  }, []);

  const values = (value: string) => {
    // console.log(id);
    setLoading(true);
    setIsSubmitted(true);
    router.push(`/explore/${id}`);

    let ws = new WebSocket("ws://127.0.0.1:7878");
    ws.onopen = () => {
      // console.log(location);
      console.log("Opening the Connection");
      // console.log(search);
      let b = JSON.stringify({
        lattitude: location.lattitude,
        longitude: location.longitude,
        interest: value,
        id: id,
      });
      console.log(b);
      ws.send(b);
    };
    setLoading(false);
  };
  return (
    <main className="flex-1 p-9 flex justify-center items-center flex-col h-full">
      <div className="w-full mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Welcome, Davis</h1>
        <p className="text-xl text-gray-500 mb-8">
          What's on your mind today for Exploring?
        </p>

        <div className="relative max-w-xl mx-auto">
          <SearchBar values={values} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={Target}
          title="Peaceful"
          description="Search Best place near me make me feel calm"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
        />
        <FeatureCard
          icon={Sun}
          title="For Valentines Day"
          description="Recommend Some Place to go and enjoy with girlfriend in pondicherry"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-50"
        />
        <FeatureCard
          icon={Headphones}
          title="Explore"
          description="Great place to enjoy in palo alto"
          iconColor="text-pink-500"
          iconBgColor="bg-pink-50"
        />
      </div>
    </main>
  );
}
