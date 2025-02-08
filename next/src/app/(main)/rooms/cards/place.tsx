"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "./modal";
import clsx from "clsx";

interface HotelCardProps {
  attraction: {
    NAME: string;
    ADDRESS: string;
    AMENITYS: string[];
    BASE_COST: number;
    CATEGORY: string;
    FINAL_COST: number;
    IMAGES: string[];
    ["RATED BY"]: number;
    RATING: string;
    ["ROOM SIZE"]: string;
  };
}

export function HotelCard({ attraction }: HotelCardProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  const [showAmenities, setShowAmenities] = useState(false);

  const name = attraction.NAME;
  const address = attraction.ADDRESS;
  const amenities = attraction.AMENITYS;
  const base = attraction.BASE_COST;
  const category = attraction.CATEGORY;
  const final = attraction.FINAL_COST;
  const images = attraction.IMAGES;
  const rate_by = attraction["RATED BY"];
  const rating = Number(attraction.RATING);
  const size = attraction["ROOM SIZE"];
  console.log(images);
  let imagess = images && JSON.parse(images.toString().replace(/'/g, '"'));
  let amenitiess =
    amenities && JSON.parse(amenities.toString().replace(/'/g, '"'));

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
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Image
                  src={"/oyo.png"}
                  alt=""
                  className=" w-[60px] h-[20px]"
                  width={60}
                  height={40}
                />
                {/* Attraction */}
              </TableHead>
            </TableRow>
            {/* <TableRow>
              <TableHead>Attractions</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("distance")}
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
                  onClick={() => handleSort("rating")}
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
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-2"
                >
                  Base Price
                  {renderSortIcon("price")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow> */}
          </TableHeader>
          <TableBody>
            <TableRow
              key={name}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedRow(expandedRow === name ? null : name)}
            >
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell key={name}>{renderStars(rating, name)}</TableCell>
              <TableCell>{base}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary"
                >
                  {expandedRow === name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
            {expandedRow === name && (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <div className="p-4 bg-muted/30">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <p className="text-sm font-bold">
                          <Modal trigger={name} address={address} id={name}>
                            <p className=" px-4 py-2 cursor-pointer bg-black text-white rounded-full">
                              {name}
                            </p>
                          </Modal>
                        </p>
                        <div className=" flex gap-x-2">
                          <Badge
                            variant={null}
                            className={clsx(
                              category == "Very Good" && "bg-green-400",
                              category == "Fabulous" && "bg-[#FFD700]",
                              category == "Fair" && "bg-[#F5DEB3]",
                              "hover:bg-none"
                            )}
                          >
                            {category}
                          </Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({rate_by} reviews)
                            </span>
                          </div>
                        </div>
                        <div className=" flex flex-col ">
                          {size}
                          <div className="mt-2 space-y-1 space-x-3 items-start">
                            {amenitiess.map((amenity, index) => (
                              <Badge
                                variant={"outline"}
                                key={index}
                                className="text-sm rounded-full"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {/* )} */}
                      </div>
                      <Carousel className="w-full h-full flex flex-col cursor-grab">
                        <CarouselContent>
                          {imagess.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-video">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${name} - Image ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className=" bg-black">
                          <CarouselPrevious />
                          <CarouselNext />
                        </div>
                      </Carousel>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {/* //     </>
            //   );
            // })} */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
{
  /* <div>
            <CardFooter>
              <Button className="w-full">Book Now</Button>
            </CardFooter>
          </div> */
}
{
  /* </div> */
}
{
  /* <Badge variant="secondary">{category}</Badge> */
}
{
  /* <Card className="w-full h-full max-w-2xl mx-auto overflow-hidden flex">
<div className=" flex flex-col">
  <div className=" flex gap-x-4">
    <Carousel className="w-full h-ful flex flex-col cursor-grab">
      <CarouselContent>
        {imagess.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-video">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} - Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className=" bg-black">
        {/* <CarouselPrevious /> */
}
{
  /* <CarouselNext /> */
}
//     </div>
//   </Carousel>

//   <CardHeader>
//     <div className="flex justify-between items-start flex-col gap-y-4">
//       <CardTitle className="text-2xl font-bold">{name}</CardTitle>
//       <p className="text-sm text-muted-foreground">{address}</p>
//     </div>
//   </CardHeader>
// </div>
// <CardContent className=" flex items-center p-0 justify-between">
//   <div className="flex flex-col items-start justify-center h-full gap-y-4 p-4 w-full">
//     <div className=" flex gap-x-2">
//       <Badge variant="secondary">{category}</Badge>
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`w-5 h-5 ${
//               i < Math.floor(rating)
//                 ? "text-yellow-400 fill-current"
//                 : "text-gray-300"
//             }`}
//           />
//         ))}
//         <span className="ml-2 text-sm text-muted-foreground">
//           ({rate_by} reviews)
//         </span>
//       </div>
//     </div>
//     <div className=" flex flex-col">
//       <p className="font-semibold">Starting from {base}</p>
//       <p className="">Final {final}</p>
//     </div>
//   </div>
//   <div className=" w-full flex items-start justify-start h-full p-4 flex-col">
//     <p className="text-sm">{size}</p>
//     <div className="mt-4">
{
  /* <Button
          variant="outline"
          onClick={() => setShowAmenities(!showAmenities)}
          className="w-full flex justify-between items-center"
        >
          <span>Amenities</span>
          {showAmenities ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button> */
}
// {
//       </div>
//     </div>
//   </CardContent>
// </div>
// </Card> */}
