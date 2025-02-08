use std::{
  io::{BufReader, Read, Write},
  net::TcpStream,
};

use http_scrap::Response;
use native_tls::TlsConnector;
use serde_json::json;

pub async fn zomato(lat:f64,lon:f64,cousine:&str) -> String {
  let stream = TcpStream::connect("api.promptrepo.com:443").unwrap();
  let billionaire = TlsConnector::new().unwrap();
  let mut client = billionaire.connect("api.promptrepo.com", stream).unwrap();
let post = json!([
  {
    "lat":lat,
    "lon":lon,
    "cuisines":cousine
  }
]);
println!("{}",post);
  let post = format!("POST /api/private/coimbatore_hotels_cleaned-coimbatore_hotels_cleaned?suggest=9 HTTP/1.1\r\nHost: api.promptrepo.com\r\nx-api-key: 49dd852841c04e15928b110771ca049f\r\nContent-Type: application/json\r\nUser-Agent: Rust-Client/1.0\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",post.to_string().len(),post.to_string());
  // println!("{}", post);
  client.write_all(post.as_bytes());
  client.flush();

  let mut table = String::new();
  let mut buffer = BufReader::new(&mut client);

  buffer.read_to_string(&mut table);
  let response = Response::new(&table);
  println!("{}", response.content());

  // println!("{}", response.content());
  // table
  String::from(response.content())
}
// curl https://api.promptrepo.com/api/private/oyobanglore-oyobanglorecsv
// -H "Content-Type: application/json"
// -H "x-api-key: 49dd852841c04e15928b110771ca049f"
// -d '[
//     {
//        "location": "B T M Layout, Bangalore",
//    "price": "₹892",
//    "ratings": "(2303 Ratings)"
//     }
// ]'
