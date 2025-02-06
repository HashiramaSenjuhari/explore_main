// import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

export async function search({
  // search,
  // interest,
  setId,
  type,
}: {
  type: string;
  // search: { lattitude: number; longitude: number };
  // interest: String;
  setId: Dispatch<SetStateAction<string | undefined>>;
}) {
  let ws = new WebSocket("ws://127.0.0.1:7878");
  ws.onopen = () => {
    console.log("Opening the Connection");
    let uuid = JSON.stringify({ model: type });
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
}
// export async function billionaire({
//   billionaire,
// }: {
//   billionaire: Dispatch<SetStateAction<String | undefined>>;
// }) {
//   let ws = new WebSocket("ws://127.0.0.1:7878");
//   ws.onopen = () => {
//     console.log("Opening the Connection");
//   };
//   ws.onmessage = (e) => {
//     // console.log("billionaire");
//     // console.log(e.data);
//     billionaire(e.data);
//   };
//   ws.onclose = () => {
//     console.log("Closing the Connection");
//   };
// }
