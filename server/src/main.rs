use std::{
    io::{self, Write},
    sync::Arc,
    time::{Duration, Instant},
};

use futures_util::{SinkExt, StreamExt};
use http_scrap::Response;
use promptrepo::{
    chat::{chats, create_msg, create_topic,history},
    models::place::{self, place},
};
use rusty_format::cors::Cors;
use rusty_postgres::{
    container, create, delete_table, find_many,
    method::types::{id::UUID, DateTime, ID, INDEX, NOW, PRIMARY, STRING, UNIQUE},
    model, AsyncNoTls, Client, NoTls, TokioClient, Uuid,
};
use serde::{Deserialize, Serialize};
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpListener, TcpStream},
    spawn,
    time::sleep,
};
use tokio_tungstenite::accept_async;
use promptrepo::models::room::room;
use promptrepo::models::zomato::zomato;

#[derive(Debug, Deserialize)]
struct Input {
    id: String,
    lattitude: f32,
    longitude: f32,
    interest: String,
}
#[derive(Debug, Deserialize)]
struct Room {
    id: String,
    input:String,
    address: String,
    rating: String,
    final_cost: String,
}
#[derive(Debug, Deserialize)]
struct Zomato {
    id: String,
    lat:f64,
    lon: f64,
    cousine: String
}
#[derive(Debug, Deserialize)]
struct Topic {
    model: String
}
#[derive(Debug, Deserialize)]
struct BTopic {
    cid: String,
}
#[derive(Debug, Deserialize)]
struct BInput {
    id: String,
    lattitude: f32,
    longitude: f32,
    new_message: String,
}

#[derive(Debug, Deserialize)]
struct T {
    types: String,
}
#[tokio::main]
async fn main() {
    let mut postgres = TokioClient::connect("host=127.0.0.1 port=5432 dbname=t user=postgres password=hariclash123 connect_timeout=10 sslmode=prefer", AsyncNoTls).await.unwrap();
    let postgres =  Arc::new(TokioClient::connect("host=127.0.0.1 port=5432 dbname=t user=postgres password=hariclash123 connect_timeout=10 sslmode=prefer", AsyncNoTls).await.unwrap());

    // delete_table! {
    //     connection => postgres,
    //     model=>"chat",
    //     cascade
    // }
    // .unwrap();
    // delete_table! {
    //     connection => postgres,
    //     model=>"chats",
    //     cascade
    // }
    // .unwrap();
    let chat = model!(
        "chat" => {
            "id" => {
                ID(UUID),PRIMARY,INDEX
            },
            "type" => {
                STRING
            },
            "title" => {
                STRING
            },
            "timestanp" => {
                DateTime(NOW)
            }
        }
    );
    let billionaire = model!(
        "chats" => {
            "id" => {
                ID(UUID),PRIMARY,INDEX
            },
            "input" => {
                STRING
            },
            "output" => {
                STRING
            },
            "timestanp" => {
                DateTime(NOW)
            },
            "billionaireId" => {
                OneToMany{
                    table:"chat",
                    table_field:"id"
                }
            }
        }
    );
    // container! {
    //     client => postgres,
    //     models => {
    //         chat,
    //         billionaire
    //     }
    // };
    // let b = place(0.0,0.0,"delhi").await;
    // println!("{:?}",b);
    // let chat = wrap::path("ws").and(wrap::path("chat")).and(wrap::ws()).map(|ws| ws.on_upgrade(handle_chat));
    // let title = wrap::path("ws").and(wrap::path("chat")).and(wrap::ws()).map(|ws| ws.on_upgrade(handle_chat));
    // let route = chat.or(title);
    // wrap::serve(route).run([127,0,0,1],7878).await;
    let listener = TcpListener::bind("127.0.0.1:7878").await.unwrap();
    while let Ok((stream, _address)) = listener.accept().await {
        // println!("{}", address.to_string());
        Arc::clone(&postgres);
        handle_connection(stream, postgres.clone()).await;
    }
    // let place = room(
    //     &"",
    //     &"",
    //     &"",
    // )
    // .await;
    // println!("{}",place);
    // let place = place(
    //     11.1008812,
    //     77.0217849,
    //     &"temple",
    // )
    // .await;
    // println!("{:?}",place);
}
async fn handle_connection(mut stream: TcpStream, postgres: Arc<Client>) {
    // let mut buffer = [0; 1024];
    // match stream.read(&mut buffer).await {
    //     Ok(_) => {}
    //     Err(err) => {
    //         println!("{}", err)
    //     }
    // }
    // let response = String::from_utf8_lossy(&buffer);
    // println!("{}",response);
    // println!("{}", string);

    // println!("{}", id);
    // println!("{:?}", create);
    // println!("{:?}", create);
    let ws_stream = accept_async(stream).await.unwrap();

    let (send, mut recv) = ws_stream.split();

    spawn(async move {
        if let Some(recv) = recv.next().await {
            let message = recv;
            match message {
                Ok(msg) => {
                    let msg = msg.into_text().unwrap();
                    if msg.contains("longitude")
                        && msg.contains("lattitude")
                        && msg.contains("interest")
                        && msg.contains("id")
                    {
                        println!("{:?}",msg);
                        let current_location = serde_json::from_str::<Input>(&msg).unwrap();
                        println!("{:?}",current_location);
                        let place = place(
                            current_location.lattitude,
                            current_location.longitude,
                            &current_location.interest,
                        )
                        .await;
                        create_msg(
                            &postgres,
                            &current_location.id,
                            &current_location.interest,
                            &place,
                        )
                        .await;
                    } else if msg.contains("model") {
                        // println!("{}", msg);
                        let uuid = serde_json::from_str::<Topic>(&msg).unwrap();
                        create_topic(postgres, &uuid.model, send).await;
                    } else if msg.contains("cid") {
                        // println!("{}", msg);
                        let uuid = serde_json::from_str::<BTopic>(&msg).unwrap();
                        chats(postgres, &uuid.cid, send).await;
                    }
                     else if msg.contains("longitude")
                        && msg.contains("lattitude")
                        && msg.contains("new_message")
                        && msg.contains("id")
                    {
                        let current_location = serde_json::from_str::<Input>(&msg).unwrap();
                        println!("{:?}",current_location);
                        let place = place(
                            current_location.lattitude,
                            current_location.longitude,
                            &current_location.interest,
                        )
                        .await;
                        // let send = Arc::new(send);
                        // let send = Arc::clone(&send);
                        create_msg(
                            &postgres,
                            &current_location.id,
                            &current_location.interest,
                            &place,
                        )
                        .await;
                        chats(postgres, &current_location.id, send).await;
                    }
                    else if msg.contains("address")
                        && msg.contains("rating")
                        && msg.contains("final_cost")
                        && msg.contains("id")
                    {
                        println!("{:?}",msg);
                        let current_location = serde_json::from_str::<Room>(&msg).unwrap();
                        println!("{:?}",current_location);
                        let place = room(
                            &current_location.address,
                            &current_location.rating,
                            &current_location.final_cost,
                        )
                        .await;
                        create_msg(
                            &postgres,
                            &current_location.id,
                            &current_location.input,
                            &place,
                        )
                        .await;
                    }
                    else if msg.contains("lat")
                    && msg.contains("lon")
                    && msg.contains("cousine")
                    && msg.contains("id")
                {
                    println!("{:?}",msg);
                    let current_location = serde_json::from_str::<Zomato>(&msg).unwrap();
                    println!("{:?}",current_location);
                    let place = zomato(
                        current_location.lat,
                        current_location.lon,
                        &current_location.cousine,
                    )
                    .await;
                    create_msg(
                        &postgres,
                        &current_location.id,
                        &current_location.cousine,
                        &place,
                    )
                    .await;
                }
                else if msg.contains("type")
            {
                println!("{:?}",msg);
                let current_location = serde_json::from_str::<T>(&msg).unwrap();
                println!("{:?}",current_location);
                let place = history(
                    &current_location.types,
                    postgres,
                    send
                )
                .await;
            }
                }
                Err(err) => {
                    println!("{}", err)
                }
            };
        }
    });
}
