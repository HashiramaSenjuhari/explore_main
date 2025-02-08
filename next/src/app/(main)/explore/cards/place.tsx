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
  id,
}: {
  suggest: any;
  location: { lattitude: number; longitude: number };
  id: string;
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

  const renderStars = (
    rating: number,
    attractionId: string,
    interactive = false
  ) => {
    const displayRating = userRatings[attractionId] || rating;

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= displayRating
                  ? "fill-primary text-primary"
                  : star <= Math.ceil(displayRating) && displayRating % 1 !== 0
                  ? "fill-primary/50 text-primary"
                  : "fill-muted text-muted-foreground"
              } ${interactive ? "cursor-pointer transition-colors" : ""}`}
              onClick={
                interactive ? () => handleRating(attractionId, star) : undefined
              }
              onMouseEnter={
                interactive ? () => handleRating(attractionId, star) : undefined
              }
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

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
    <Card key={id}>
      <CardContent className="p-1">
        <Table id={id}>
          <TableHeader>
            <TableRow>
              <TableHead>Attractions</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => handleSort("distance")}
                  className="flex items-center gap-2"
                >
                  Distance
                  {renderSortIcon("distance")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => handleSort("rating")}
                  className="flex items-center gap-2"
                >
                  Rating
                  {renderSortIcon("rating")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => handleSort("price")}
                  className="flex items-center gap-2"
                >
                  Price Fare
                  {renderSortIcon("price")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          {sortedAttractions.map((attraction, id) => {
            console.log(attraction);
            let city = attraction.city;
            let rating = Number(attraction.google_rating);
            let latitude = attraction.latitude;
            let longitude = attraction.longitude;
            let price = attraction.price_fare;
            let popular_destination = attraction.popular_destination;
            let state = attraction.state;

            let distance = getDistance(
              { latitude: latitude, longitude: longitude },
              { latitude: location.lattitude, longitude: location.longitude }
            );
            let b = (distance / 1000).toFixed(2);

            // city: "Coimbatore";
            // google_rating: "4.5";
            // interest: "Sightseeing & Exploration";
            // latitude: "10.4059862";
            // longitude: "77.0324697";
            // popular_destination: "Valankulam lake";
            // price_fare: "0";
            // score: 0.8271272257988612;
            // state: "Tamil Nadu";
            return (
              <TableBody key={id}>
                <TableRow
                  key={id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setExpandedRow(
                      expandedRow === popular_destination
                        ? null
                        : popular_destination
                    )
                  }
                >
                  <TableCell className="font-medium">
                    {popular_destination}
                  </TableCell>
                  <TableCell>{b} km</TableCell>
                  <TableCell key={popular_destination}>
                    {renderStars(rating, popular_destination)}
                  </TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary"
                    >
                      {expandedRow === popular_destination ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === popular_destination && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="p-4 bg-muted/30">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                {state}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {city}
                              </p>
                            </div>
                            <p className="text-sm font-bold">
                              <Modal
                                trigger={popular_destination}
                                latitude={latitude}
                                longitude={longitude}
                                location={location}
                                id={popular_destination}
                              >
                                <p className=" px-4 py-2 cursor-pointer bg-black text-white rounded-full">
                                  {" "}
                                  {popular_destination}
                                </p>
                              </Modal>
                            </p>
                            <div
                              className="space-y-2"
                              key={popular_destination}
                            >
                              <p className="font-medium">Your Rating</p>
                              {renderStars(rating, popular_destination, true)}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm text-muted-foreground">
                                {b} km away
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg overflow-hidden border">
                            <iframe
                              width="100%"
                              height="100%"
                              sandbox="allow-scripts allow-same-origin"
                              referrerPolicy="no-referrer-when-downgrade"
                              loading="lazy"
                              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&origin=${location.lattitude},${location.longitude}&destination=${latitude},${longitude}&avoid=tolls|highways`}
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {/* </div> */}
              </TableBody>
            );
          })}
        </Table>
      </CardContent>
    </Card>
  );
}
