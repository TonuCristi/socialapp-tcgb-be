import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_PASS: process.env.SUPABASE_PASS,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
};

export default config;
