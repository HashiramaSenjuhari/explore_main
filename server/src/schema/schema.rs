// use rusty_postgres::{
//     container,
//     method::types::{id::UUID, ID, UNIQUE},
//     model, Client, NoTls,
// };

// pub fn schema() {
//     let mut postgres = Client::connect("", NoTls).unwrap();

//     let model = model! {
//       "billionaire" => {
//         "id" => {
//           ID(UUID),UNIQUE
//         }
//       }
//     };
//     container! {
//       client => postgres,
//       models => {
//         model
//       }
//     }
// }
