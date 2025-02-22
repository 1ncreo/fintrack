import { MongoClient, Db, MongoClientOptions } from "mongodb";

// Ensure the MONGODB_URI environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  retryWrites: true,
  w: "majority", // Explicitly set the type to "majority"
};

// Declare global variable for development mode
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the connection during HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Function to connect to the database
export async function connectToDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db("personal_finance");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}