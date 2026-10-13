import { OpenRouter } from "@openrouter/sdk";
import "dotenv/config"

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_TOKEN
});

