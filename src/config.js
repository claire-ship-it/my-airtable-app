// Configuration file
// Defines environment variables and feature flags
// Includes a function to validate required configuration

export const config = {
  airtableBaseId: process.env.REACT_APP_AIRTABLE_BASE_ID,
  airtablePersonalAccessToken: process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN, // Updated name
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  features: {
    aiAssistant: true,
    bookingsTable: true,
    bookingsPieChart: true,
    bookingsBarChart: true,
  },
  // Add other configuration variables here
};

export function validateConfig() {
  const requiredVars = ['airtableBaseId', 'airtablePersonalAccessToken']; // Updated name
  const missingVars = requiredVars.filter(varName => !config[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Call validateConfig immediately
validateConfig();