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

const Modal = ({
  id,
  trigger,
  latitude,
  longitude,
  location,
}: {
  id: string;
  trigger: string;
  latitude: number;
  longitude: number;
  location: {
    lattitude: number;
    longitude: number;
  };
}) => {
  // let [location, setLocation] = useState({ latittude: 0, longitude: 0 });
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((location) => {
  //     setLocation({
  //       latittude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //   });
  // }, []);
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
              {/* <div className=" w-full h-full"> */}
              {location && (
                <iframe
                  width="100%"
                  height="100%"
                  sandbox="allow-scripts allow-same-origin"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.GOOGLE_API}&origin=${location.lattitude},${location.longitude}&destination=${latitude},${longitude}&avoid=tolls|highways`}
                ></iframe>
              )}
              {/* </div> */}
            </TabsContent>
            <TabsContent value="3d" asChild>
              {/* <div className=" w-full h-full"> */}
              <iframe
                width="100%"
                height="100%"
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.GOOGLE_API}&location=${latitude},${longitude}&heading=210&pitch=10&fov=35`}
              ></iframe>
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
