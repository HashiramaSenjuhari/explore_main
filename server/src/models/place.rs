use std::{
    io::{BufReader, Read, Write},
    net::TcpStream,
};

use http_scrap::Response;
use native_tls::TlsConnector;
use serde_json::json;

pub async fn place(lattitude: f32, longitude: f32, interest: &str) -> String {
    let stream = TcpStream::connect("api.promptrepo.com:443").unwrap();
    let billionaire = TlsConnector::new().unwrap();
    let mut client = billionaire.connect("api.promptrepo.com", stream).unwrap();

    //     curl https://api.promptrepo.com/api/private/places-placescsv
    // -H "Content-Type: application/json"
    // -H "x-api-key: 49dd852841c04e15928b110771ca049f"
    // -d '[
    //     {
    //        "latitude": "Delhi",
    //    "longitude": "Delhi",
    //    "interest": "India Gate"
    //     }
    // ]'
    let post = json!([
      {
        "latitude":lattitude,
        "longitude":longitude,
        "interest":interest
      }
    ]);
    println!("{}", post);
    let post = format!("POST /api/private/place-place HTTP/1.1\r\nHost: api.promptrepo.com\r\nx-api-key: 49dd852841c04e15928b110771ca049f\r\nContent-Type: application/json\r\nUser-Agent: Rust-Client/1.0\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",post.to_string().len(),post.to_string());
    // println!("{}", post);
    client.write_all(post.as_bytes());
    client.flush();

    let mut table = String::new();
    let mut buffer = BufReader::new(&mut client);

    buffer.read_to_string(&mut table);
    let response = Response::new(&table);
    // println!("{}", response.content());
    // table
    String::from(response.content())
}

// curl https://api.promptrepo.com/api/private/place-place
// -H "Content-Type: application/json"
// -H "x-api-key: 49dd852841c04e15928b110771ca049f"
// -d '[
//     {
//        "latitude": "28.612912",
//    "longitude": "77.2295097",
//    "interest": "Cultural & Heritage Sites"
//     }
// ]'
