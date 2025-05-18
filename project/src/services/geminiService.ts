import { Message } from '../types';

// Function to send a message to the Gemini API
export const sendMessageToGemini = async (
  message: string, 
  previousMessages: Message[]
): Promise<string> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Format previous messages for context
  const conversation = previousMessages.map(msg => ({
    role: msg.isBot ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Add the current message
  conversation.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const requestBody = {
    contents: conversation,
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    
    // Extract the response text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return processHealthResponse(text);
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

const processHealthResponse = (text: string): string => {
  let formatted = text;

  // Headings
  formatted = formatted.replace(/^### (.+)$/gm, (_, title) => {
    return `<h3 class="text-lg font-semibold text-blue-700 mb-2">${title}</h3>`;
  });

  // Notes
  formatted = formatted.replace(/(?:\*\*|)(💡\s*Important:)(?:\*\*|)\s*(.+)/gi, (_, label, msg) => {
    return `
      <div class="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md shadow-sm">
        <strong>${label}</strong> ${msg}
      </div>`;
  });

  // Bold + Italic
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // ✅ NEW: Split any "* Word:" patterns into real list items
  formatted = formatted.replace(/(?:^|\n)(?=[^*\n]*\*\s*\w+?:)/g, '\n'); // force line breaks
  formatted = formatted.replace(/(?:\*\s*(\w[\w\s]{1,30}):\s*([^*\n]+))/g, (_, label, desc) => {
    return `<li><strong>${label.trim()}:</strong> ${desc.trim()}</li>`;
  });

  // ✅ Wrap lists (if there are any <li>)
  formatted = formatted.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul class="my-3 list-disc pl-5">$1</ul>');

  // Paragraphs
  formatted = formatted.replace(/\n{2,}/g, '</p><p>');
  formatted = `<p>${formatted}</p>`;

  // Clean <p><ul> overlaps
  formatted = formatted.replace(/<\/p>\s*<ul/g, '<ul');
  formatted = formatted.replace(/<\/ul>\s*<p>/g, '</ul>');

  return `
    <div class="bg-blue-50 p-4 rounded-xl shadow-sm leading-relaxed text-gray-800">
      ${formatted.trim()}
    </div>
  `;
};

// import { Message } from '../types';

// // Sample list of doctors
// const doctors = [
//   {
//     name: 'Dr. Aisha Patel',
//     specialty: 'Cardiology',
//     location: 'City Hospital, Mumbai',
//     rating: '4.8 / 5.0',
//   },
//   {
//     name: 'Dr. Rajesh Kumar',
//     specialty: 'Orthopedics',
//     location: 'Central Medical Center, Delhi',
//     rating: '4.9 / 5.0',
//   },
//   {
//     name: 'Dr. Michael Chang',
//     specialty: 'Cardiology',
//     location: 'Heart Institute, Mumbai',
//     rating: '4.7 / 5.0',
//   },
//   {
//     name: 'Dr. William Parker',
//     specialty: 'Cardiology',
//     location: 'Heart & Vascular Institute, Delhi',
//     rating: '4.8 / 5.0',
//   },
// ];

// export const sendMessageToGemini = async (
//   message: string,
//   previousMessages: Message[]
// ): Promise<string> => {
//   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

//   if (!API_KEY) {
//     throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
//   }

//   // Detect specialty keyword manually for override
//   const specialty = detectSpecialty(message);

//   // Prepare conversation history
//   const conversation = previousMessages.map(msg => ({
//     role: msg.isBot ? 'model' : 'user',
//     parts: [{ text: msg.text }]
//   }));

//   // Inject instruction and doctor list for Gemini
//   conversation.unshift({
//     role: 'user',
//     parts: [{
//       text: `When the user mentions symptoms or asks for a doctor (e.g., "Can you suggest a cardiologist?"), recommend one or more doctors from the list below. Always include their specialty, rating, and location. Avoid saying you can't help.

// List of available doctors:
// ${doctors.map(d => `${d.name}, ${d.specialty}, ${d.location}, Rating: ${d.rating}`).join('\n')}`
//     }]
//   });

//   // Add the user's message
//   conversation.push({
//     role: 'user',
//     parts: [{ text: message }]
//   });

//   const requestBody = {
//     contents: conversation,
//     generationConfig: {
//       temperature: 0.2,
//       topK: 40,
//       topP: 0.8,
//       maxOutputTokens: 1024,
//     },
//     safetySettings: [
//       {
//         category: 'HARM_CATEGORY_HARASSMENT',
//         threshold: 'BLOCK_MEDIUM_AND_ABOVE'
//       },
//       {
//         category: 'HARM_CATEGORY_HATE_SPEECH',
//         threshold: 'BLOCK_MEDIUM_AND_ABOVE'
//       },
//       {
//         category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
//         threshold: 'BLOCK_MEDIUM_AND_ABOVE'
//       },
//       {
//         category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
//         threshold: 'BLOCK_MEDIUM_AND_ABOVE'
//       }
//     ]
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Gemini API error: ${response.status} ${response.statusText}\n${errorText}`);
//     }

//     const data = await response.json();
//     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (text) {
//       return processHealthResponse(text);
//     } else {
//       throw new Error('Unexpected API response structure');
//     }
//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     throw error;
//   }
// };

// const detectSpecialty = (input: string): string | null => {
//   const lower = input.toLowerCase();
//   if (lower.includes('heart') || lower.includes('cardiologist')) return 'Cardiology';
//   if (lower.includes('bone') || lower.includes('orthopedic')) return 'Orthopedics';
//   return null;
// };

// const processHealthResponse = (text: string): string => {
//   let formatted = text;

//   formatted = formatted.replace(/^### (.+)$/gm, (_, title) => {
//     return `<h3 class=\"text-lg font-semibold text-blue-700 mb-2\">${title}</h3>`;
//   });

//   formatted = formatted.replace(/(?:\*\*|)(💡\s*Important:)(?:\*\*|)\s*(.+)/gi, (_, label, msg) => {
//     return `
//       <div class=\"mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md shadow-sm\">
//         <strong>${label}</strong> ${msg}
//       </div>`;
//   });

//   formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
//   formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

//   formatted = formatted.replace(/(?:^|\n)(?=[^*\n]*\*\s*\w+?:)/g, '\n');
//   formatted = formatted.replace(/(?:\*\s*(\w[\w\s]{1,30}):\s*([^*\n]+))/g, (_, label, desc) => {
//     return `<li><strong>${label.trim()}:</strong> ${desc.trim()}</li>`;
//   });

//   formatted = formatted.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul class=\"my-3 list-disc pl-5\">$1</ul>');

//   formatted = formatted.replace(/\n{2,}/g, '</p><p>');
//   formatted = `<p>${formatted}</p>`;

//   formatted = formatted.replace(/<\/p>\s*<ul/g, '<ul');
//   formatted = formatted.replace(/<\/ul>\s*<p>/g, '</ul>');

//   return `
//     <div class=\"bg-blue-50 p-4 rounded-xl shadow-sm leading-relaxed text-gray-800\">
//       ${formatted.trim()}
//     </div>
//   `;
// };