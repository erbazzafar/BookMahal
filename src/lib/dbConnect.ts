// Purpose: Connect to the database using mongoose.
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect("mongodb+srv://erbaz:BookMahal@bookmahal.c8mjp.mongodb.net/");

    connection.isConnected = db.connections[0].readyState;

    console.log("DATABASE CONNECTED SUCESSFULLY !!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

export default dbConnect;
