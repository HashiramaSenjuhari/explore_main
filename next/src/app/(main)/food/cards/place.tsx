"use client";

import { useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getDistance } from "geolib";
import Modal from "./modal";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { renderStars } from "@/components/star/rating";
import Link from "next/link";

interface Attraction {
  name: string;
  distance: number;
  rating: number;
  price: number;
  id: string;
  mapUrl: string;
  description: string;
}

const attractions: Attraction[] = [
  {
    name: "Valankulam lake",
    distance: 77.28,
    rating: 4.5,
    price: 0,
    id: "valankulam",
    mapUrl: "/placeholder.svg?height=300&width=600",
    description:
      "A beautiful lake perfect for evening walks and nature photography.",
  },
  {
    name: "Trek to Perumal peak",
    distance: 21.27,
    rating: 4.7,
    price: 0,
    id: "perumal",
    mapUrl: "/placeholder.svg?height=300&width=600",
    description:
      "Exciting trek with breathtaking views of the surrounding landscape.",
  },
];

type SortKey = "distance" | "rating" | "price";
type SortOrder = "asc" | "desc";

export default function AttractionsTable({
  suggest,
  location,
}: {
  suggest: any;
  location: { lattitude: number; longitude: number };
}) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  const sortedAttractions = [...suggest].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    return (a[sortKey] - b[sortKey]) * modifier;
  });

  const handleRating = (attractionId: string, rating: number) => {
    setUserRatings((prev) => ({
      ...prev,
      [attractionId]: rating,
    }));
  };

  // const renderStars = (
  //   rating: number,
  //   attractionId: string,
  //   interactive = false
  // ) => {
  //   const displayRating = userRatings[attractionId] || rating;

  //   return (
  //     <div className="flex items-center gap-1">
  //       <div className="flex">
  //         {[1, 2, 3, 4, 5].map((star) => (
  //           <Star
  //             key={star}
  //             className={`w-4 h-4 ${
  //               star <= displayRating
  //                 ? "fill-primary text-primary"
  //                 : star <= Math.ceil(displayRating) && displayRating % 1 !== 0
  //                 ? "fill-primary/50 text-primary"
  //                 : "fill-muted text-muted-foreground"
  //             } ${interactive ? "cursor-pointer transition-colors" : ""}`}
  //             onClick={
  //               interactive ? () => handleRating(attractionId, star) : undefined
  //             }
  //             onMouseEnter={
  //               interactive ? () => handleRating(attractionId, star) : undefined
  //             }
  //           />
  //         ))}
  //       </div>
  //       <span className="text-sm text-muted-foreground ml-1">{rating}</span>
  //     </div>
  //   );
  // };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <SortAsc className="w-4 h-4 opacity-50" />;
    return sortOrder === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };
  // console.log(key);
  return (
    <>
      {suggest.map((suggest, id) => {
        console.log(suggest);
        let address = suggest.address;
        let cuisines = suggest.cuisines;
        let lat = Number(suggest.lat);
        let lon = Number(suggest.lon);
        let link = suggest.link;
        let name = suggest.name;
        let ratings = Number(suggest.ratings);
        let ratings_delivery = Number(suggest.ratings_delivery);
        let reviews = Number(suggest.reviews);
        let reviews_delivery = Number(suggest.reviews_delivery);

        let distance = getDistance(
          {
            latitude: lat,
            longitude: lon,
          },
          {
            latitude: location.lattitude,
            longitude: location.longitude,
          }
        );
        let dist = (distance / 1000).toFixed(2);
        return (
          // <div>
          <div
            key={id}
            className=" w-full h-full  border p-3 flex flex-col gap-y-3"
          >
            {/* {restraruent()} */}
            <div className=" flex  flex-col items-start gap-y-4">
              <div className=" flex justify-between w-full">
                <div className=" flex items-center w-full flex-wrap gap-x-4">
                  <p className=" text-[24px]">{name}</p>
                  <Badge>{cuisines}</Badge>
                </div>
                <Image
                  src={"/Zomato.png"}
                  alt=""
                  className=" w-[60px] h-[30px]"
                  width={60}
                  height={30}
                />
              </div>
              {dist} km
              <div className=" flex justify-between w-full">
                <div className=" flex items-center gap-x-4">
                  {renderStars(ratings, name, "fill-red-400")} ({reviews})
                </div>
                <div className=" flex items-center gap-x-4">
                  <Link href={link} className=" border px-6 py-2  rounded-full">
                    {"Order"}
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary"
                    onClick={() =>
                      setExpandedRow(expandedRow === id ? null : id)
                    }
                  >
                    {expandedRow === id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {expandedRow === id && (
              <div className="p-4 bg-muted/30">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{address}</p>
                    </div>
                    <p className="text-sm font-bold"></p>
                    <div className="space-y-2 " key={id}>
                      <p className="font-medium">Delivery Rating</p>
                      <div className=" flex gap-x-4">
                        {renderStars(ratings_delivery, id, "fill-red-400")}(
                        {reviews_delivery})
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        {dist} km away
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          // </div>
        );
      })}
    </>
  );
}
