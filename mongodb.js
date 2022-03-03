const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to database");
    }

    // console.log("connected correctly");
    const db = client.db(databaseName);

    // db.collection("users").insertOne(
    //   {
    //     name: "Tiyush",
    //     age: 22,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert document");
    //     }
    //     // console.log("ok");
    //     console.log(result);
    //   }
    // );

    db.collection("users").insertMany(
      [
        { name: "Aayush", age: 22 },
        { name: "Piyush", age: 21 },
      ],
      (error, result) => {
        if (error) {
          return console.log("unable to insert documents");
        }
        console.log(result);
      }
    );
  }
);
