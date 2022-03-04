// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const { MongoClient, ObjectID } = require("mongodb");

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

    db.collection("users").findOne({ name: "Piyush" }, (error, user) => {
      if (error) {
        return console.log("unable to fetch");
      }
      console.log(user);
    });

    db.collection("users").findOne(
      { _id: new ObjectID("62227887ccd1eeb5276d658c") },
      (error, user) => {
        if (error) {
          return console.log("unable to fetch");
        }
        console.log(user);
      }
    );

    db.collection("users")
      .find({})
      .toArray((error, users) => {
        if (error) {
          return console.log("can't fetch docs");
        }
        console.log(users);
      });

    db.collection("users")
      .find({})
      .count((error, count) => {
        if (error) {
          return console.log("can't fetch docs");
        }
        console.log(count);
      });
  }
);
