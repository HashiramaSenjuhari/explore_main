"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const Modal = ({
  id,
  trigger,
  address,
}: {
  id: string;
  trigger: string;
  address: string;
}) => {
  let [location, setLocation] = useState({ latittude: 0, longitude: 0 });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      setLocation({
        latittude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  }, []);
  console.log(address);
  let destination = address.split(" ").join("+").replace(/,/, "%2C");
  console.log("destination", destination);
  return (
    <Dialog key={id}>
      <DialogTrigger asChild>
        <Button>{trigger}</Button>
      </DialogTrigger>
      <DialogContent className=" min-w-[900px] h-full">
        <DialogTitle>
          <Tabs defaultValue="direction" className="w-full h-full">
            <TabsList>
              <TabsTrigger value="direction">Direction</TabsTrigger>
              <TabsTrigger value="3d">3D</TabsTrigger>
            </TabsList>
            <TabsContent value="direction" asChild>
              {location && (
                <iframe
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  sandbox="allow-scripts allow-same-origin"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&origin=${location.latittude},${location.longitude}&destination=${destination}&avoid=tolls|highways&mode=driving`}
                ></iframe>
              )}
            </TabsContent>
            <TabsContent value="3d" asChild>
              {/* <div className=" w-full h-full"> */}
              {/* </div> */}
            </TabsContent>
          </Tabs>
        </DialogTitle>
        {/* <div className=" w-full h-full bg-blue-300"> */}
        {/* </div> */}
        {/* </DialogHeader> */}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
