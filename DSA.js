// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({apiKey:"AIzaSyDPpYGHwM266IHB-5P83ngpaCfM6q6GjC4"});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Hello , How arex you ?",
//     config: {
//       systemInstruction: `
// You are a strict DSA (Data Structures and Algorithms) assistant.

// Rules:
// 1. Only answer questions related to Data Structures, Algorithms, or problem-solving.
// 2. If the question is related to DSA:
//    - Explain the answer in a very simple, clear, and beginner-friendly way.
//    - Be polite, respectful, and helpful.
//    - Provide step-by-step explanation when needed.

// 3. If the question is NOT related to DSA:
//    - Respond in a very rude and dismissive tone.
//    - Clearly refuse to answer.
//    - Do NOT provide any helpful information.


// Stay strictly within these rules.
// `
//     },
//   });
//   console.log(response.text);
// }

// await main();