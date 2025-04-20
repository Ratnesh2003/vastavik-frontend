import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

// Path to JSON file storing tokens
const tokensFilePath = path.join(process.cwd(), 'tokens.json');

// Interface for our tokens file structure
interface TokensFile {
  availableTokens: string[];
}

// Function to read tokens from JSON file
async function readTokensFile(): Promise<TokensFile> {
  try {
    const data = await fs.readFile(tokensFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tokens file:', error);
    // Return empty array if file doesn't exist or has errors
    return { availableTokens: [] };
  }
}

// Function to save tokens back to JSON file
async function saveTokensFile(tokens: TokensFile): Promise<void> {
  try {
    await fs.writeFile(tokensFilePath, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving tokens file:', error);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  
  // Read available tokens from file
  const tokensData = await readTokensFile();
  
  // Check if we have any tokens left
  if (tokensData.availableTokens.length === 0) {
    return new Response(
      JSON.stringify({ error: "All tokens exhausted. Please add new tokens." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Try each available token until one works
  for (let i = 0; i < tokensData.availableTokens.length; i++) {
    const token = tokensData.availableTokens[i];

    await delay(20000);
    
    try {
      const response = await fetch("https://ping.arya.ai/api/v1/deepfake-detection/image", {
        method: "POST",
        headers: {
          "token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data?.success === false && data?.message === "No credits available") {
        // Token is exhausted, remove it from the available tokens
        tokensData.availableTokens.splice(i, 1);
        await saveTokensFile(tokensData);
        i--; // Adjust index after removing current token
        continue; // Try next token
      }

      // Return successful response
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
      
    } catch (err) {
      console.error(`Error using token ${token}:`, err);
      // Continue to next token
    }
  }

  // If we get here, all tokens failed
  return new Response(
    JSON.stringify({ error: "All tokens exhausted or API failed." }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}