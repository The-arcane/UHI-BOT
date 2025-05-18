// This file contains healthcare sample data for training the chatbot
// We use this data to provide the initial context to the Gemini API

export const healthcareSampleData = [
  {
    prompt: "I have a headache",
    response: `### 🤕 Headache Assessment
- Common causes: stress, dehydration, eye strain
- Take breaks from screens
- Stay hydrated
- Consider over-the-counter pain relievers

**💡 Important:** Seek medical attention if headache is severe, sudden, or accompanied by vision changes.`
  },
  {
    prompt: "What should I do for a fever?",
    response: `### 🌡️ Fever Management
- Rest and stay hydrated
- Take acetaminophen if needed
- Monitor temperature regularly
- Use light clothing and blankets

**💡 Important:** Get emergency care if fever exceeds 103°F (39.4°C) or lasts more than 3 days.`
  },
  {
    prompt: "My throat hurts",
    response: `### 😷 Sore Throat Care
- Gargle with warm salt water
- Drink warm liquids (tea with honey)
- Use throat lozenges
- Rest your voice

**💡 Important:** See a doctor if you have difficulty breathing or swallowing, or if symptoms persist over 1 week.`
  },
  {
    prompt: "I feel dizzy",
    response: `### 😵 Dizziness Guide
- Sit or lie down immediately
- Stay hydrated
- Avoid sudden movements
- Take slow, deep breaths

**💡 Important:** Seek immediate medical care if dizziness is accompanied by chest pain, severe headache, or difficulty speaking.`
  }
];

// Additional health topics that might be valuable
export const additionalHealthTopics = [
  "chest pain", "cough", "fever", "headache", "joint pain", 
  "nausea", "rash", "shortness of breath", "sore throat", 
  "stomachache", "allergies", "cold", "flu", "diabetes", 
  "high blood pressure", "asthma", "diet", "exercise", 
  "sleep", "stress", "mental health", "first aid"
];