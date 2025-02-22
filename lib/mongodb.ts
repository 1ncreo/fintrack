import { MongoClient, Db, MongoClientOptions } from "mongodb";

// Ensure the MONGODB_URI environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  retryWrites: true,
  w: "majority",
};

// Declare global variable type for development mode
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export async function connectToDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db("personal_finance");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}