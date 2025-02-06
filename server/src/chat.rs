use std::sync::Arc;

use futures_util::{stream::SplitSink, SinkExt};
use rusty_postgres::{create, find_many, Client, Uuid};
use tokio::net::TcpStream;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

pub async fn chats(
    postgres: Arc<rusty_postgres::Client>,
    id: &str,
    mut send: SplitSink<
        WebSocketStream<tokio::net::TcpStream>,
        tokio_tungstenite::tungstenite::Message,
    >,
) {
    let find = find_many! {
        connection => postgres,
        model:"chat",
        match:"id",
        select:{
            "id"
        },
        conditions:{
            and => {
                "id" => id
            }
        },
        inside:{
            "chats" => {
                match:"billionaireId",
                select:{
                    "id","input","output"
                }
            }
        }
    };
    match find {
        Ok(msg) => {
            println!("{:?}", msg);
            let msg = serde_json::to_string(&msg);
            match msg {
                Ok(msg) => {
                    let send = send.send(msg.into()).await;
                    match send {
                        Ok(_) => {
                            println!("{}", "Successfully");
                        }
                        Err(err) => {
                            panic!("{}", err);
                        }
                    }
                }
                Err(err) => {
                    panic!("{}", err);
                }
            }
            // let msg = Message::Text(msg);
        }
        Err(err) => {
            println!("{:?}", err);
        }
    }
}

pub async fn create_msg(
    postgres: &Arc<rusty_postgres::Client>,
    id: &str,
    input: &str,
    output: &str,
    // send: SplitSink<
    //     WebSocketStream<tokio::net::TcpStream>,
    //     tokio_tungstenite::tungstenite::Message,
    // >,
) {
    let uuid = Uuid::parse_str(id).unwrap();
    let create_msg = create! {
        connection => postgres,
        model:"chats",
        data:{
            "input" => input,
            "output" => output,
            "billionaireId" => uuid
        }
    };
    match create_msg {
        Ok(ok) => {
            println!("{:?}", ok);
        }
        Err(err) => {
            panic!("{}", err);
        }
    }
}

pub async fn create_topic(
    postgres: Arc<rusty_postgres::Client>,
    types: &str,
    mut send: SplitSink<
        WebSocketStream<tokio::net::TcpStream>,
        tokio_tungstenite::tungstenite::Message,
    >,
) {
    let create = create! {
      connection => postgres,
      model:"chat",
      data:{
        "type" => types
      },
      select:{
        "id"
      }
    };
    match create {
        Ok(uuid) => {
            let id = uuid[0][0].get("id");
            match id {
                Some(id) => {
                    let id = format!("{{\"id\":\"{}\"}}", id);
                    // let id = serde_json::to_string();
                    println!("{}", id);
                    let send = send.send(Message::text(id)).await;
                    match send {
                        Ok(_) => {
                            println!("{}", "Successfully")
                        }
                        Err(err) => {
                            panic!("{}", err);
                        }
                    }
                }
                None => {
                    println!("{}", "Id Not Found")
                }
            }
        }
        Err(err) => {
            println!("{}", err);
        }
    }
}

// pub async fn msg_stream(
//     postgres: Arc<rusty_postgres::Client>,
//     id: &str,
//     input: &str,
//     output: &str,
//     send: Arc<
//         futures_util::stream::SplitSink<
//             tokio_tungstenite::WebSocketStream<TcpStream>,
//             tokio_tungstenite::tungstenite::Message,
//         >,
//     >,
// ) {
//     let uuid = Uuid::parse_str(id).unwrap();
//     let create_msg = create! {
//         connection => postgres,
//         model:"chats",
//         data:{
//             "input" => input,
//             "output" => output,
//             "billionaireId" => uuid

//         },
//         select:{
//           "input"
//         }
//     };
//     match create_msg {
//         Ok(msg) => {
//             let msg = serde_json::to_string(&msg).unwrap();
//             for chunk in msg.split(" ") {
//                 send.send(chunk.into()).await;
//             }
//         }
//         Err(err) => {
//             panic!("{}", err);
//         }
//     }
// }
