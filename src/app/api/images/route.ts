import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, theme } = await req.json(); // Receive the user's message and theme

  // Create a prompt that incorporates the user's message and the theme
  const initialPrompt = `${message} with the theme of ${theme}`;

  // Send the prompt to the OpenAI text completion API to get an enhanced description
  const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are going to be given a short image description and a theme. Please enhance it to make it more detailed and engineer a prompt for the DAL E image generation model. The answer you give will be directly fed to DAL E so you cannot interact with the user further e.g. asking questions."
        },
        {
          role: "user",
          content: initialPrompt
        }
      ]
    })
  });

  const completionData = await completionResponse.json();

  // Use the enhanced description as the prompt for the DAL E image generation API
  const enhancedPrompt = completionData['choices'][0]['message']['content'];

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "dall-e-2",
      prompt: enhancedPrompt.substring(0, Math.min(enhancedPrompt.length, 1000)),
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
      n: 1,
    }),
  });

  const responseData = await response.json();

  console.log(responseData); // Log the entire responseData object

  // Check if responseData.data is defined before trying to access its properties
  if (responseData.data && responseData.data[0]) {
    // Return both the image and the enhanced description
    return new Response(JSON.stringify({
      image: responseData.data[0].b64_json,
      description: enhancedPrompt,
    }));
  } else {
    // Handle the error case
    return new Response(JSON.stringify({
      error: 'The DAL E image generation API did not return the expected data.',
      responseData: responseData, // Include the responseData in the error response for debugging
    }), { status: 500 });
  }
}
