import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoDbConnection } from "./MongoDb/MongoDbConnection.js";
import taskRouter from "./Apis/ApiMethod.js";
import authRouter from "./Apis/AuthMethod.js"; // Importing the new auth router

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter); // Auth routes (Signup, Login)
app.use('/api', taskRouter); // Protected Task routes

app.get('/', (req, res) => {
  console.log("Backend is live!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n Backend is live!`);
  console.log(`🌍 Server: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/tasks\n`);
  
  // Database Connection
  MongoDbConnection(process.env.MONGODB_URI);
});
