"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  let p = useRef<HTMLParagraphElement>();
  // let [chat,setChat] = useState<HTMLParagraphElement>()
  useEffect(() => {
    console.log("billionaire");
    let stream = new WebSocket("ws://127.0.0.1:7878/place");
    stream.addEventListener("open", (e) => {
      console.log("opened bi bidirectional");
      stream.send("billionaireharigreatgreatest");
    });
    stream.onmessage = (e) => {
      console.log(e.data);
      if (e.data) {
        p.current.innerText += e.data;
      } else {
        p.current.innerText = "loading";
      }
    };
    stream.addEventListener("error", (e) => {
      console.log(e);
    });
    stream.addEventListener("close", () => {
      console.log("closing");
    });
    return () => {
      if (stream.readyState == WebSocket.OPEN) {
        stream.close();
      }
    };
  }, []);
  return (
    <div>
      <div></div>
    </div>
  );
}

// export async function place() {
//   console.log("billionaire")
//   let stream = new WebSocket("ws://127.0.0.1:7878/place");
//   stream.addEventListener("open", e => {
//     console.log("opened bi bidirectional")
//   })
//   stream.addEventListener("message", e => {
//     let data = e.data;
//     console.log(data)
//   })
//   stream.send = () => {
//     stream.send("billionaire")
//   }
//   stream.addEventListener("error", e => {
//     console.log(e)
//   })
//   stream.addEventListener("close", () => {
//     console.log("closing")
//   })
// } export async function swiggy() {
//   let stream = new WebSocket("ws://127.0.0.1/swiggy");
//   stream.addEventListener("open", e => {
//     console.log("opened bi bidirectional")
//   })
//   stream.addEventListener("message", e => {
//     let data = e.data;
//     console.log(data)
//   })
//   stream.addEventListener("error", e => {
//     console.log(e)
//   })
//   stream.addEventListener("close", () => {
//     console.log("closing")
//   })
// }
// export async function room() {
//   let stream = new WebSocket("ws://127.0.0.1/room");
//   stream.addEventListener("open", e => {
//     console.log("opened bi bidirectional")
//   })
//   stream.addEventListener("message", e => {
//     let data = e.data;
//     console.log(data)
//   })
//   stream.addEventListener("error", e => {
//     console.log(e)
//   })
//   stream.addEventListener("close", () => {
//     console.log("closing")
//   })
// }
