# Tax Assistant Chatbot 🚀 - Richard Huang

A web-based chatbot that acts as a tax assistant. This application lets users ask tax-related questions and upload files (like PDFs or images) to support their queries. It uses the Vercel AI SDK for conversational AI, offering a responsive and interactive chat interface built with Next.js and styled with Tailwind CSS.

## Features ✨

- **Conversational Interface:**  
  Uses the Vercel AI SDK’s `useChat` hook to create a chat UI that displays messages in styled chat bubbles.

- **File Upload Capability:**  
  Drag-and-drop or click-to-select file uploads. The app extracts file names and prepends them to the user’s message input.

- **Quick Follow-Up Suggestions:**  
  Generates natural follow-up questions based on AI responses to keep the conversation flowing.

- **Responsive Design:**  
  Built with Tailwind CSS for a clean, user-friendly interface across devices.

## Tech Stack 🛠️

- **Frontend:** [Next.js](https://nextjs.org/) (React framework)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)

## Getting Started 🏁
**Check out the website here!** [Link](https://richard-huang-taxbot.vercel.app/)


**How to run this program locally:**
    - **1.** create a `.env.local` and inside add `OPENAI_API_KEY=XXXXXX` and replace XXXXXX with your open ai api key
    - **2.** run: `npm i`
    - **3.** run: `npm run dev`