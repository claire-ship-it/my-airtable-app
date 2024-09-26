// API service functions
// fetchBookings: Fetches booking data from Airtable
// askAIAssistant: Placeholder for AI assistant API call


import { config } from '../config';

export const fetchBookings = async () => {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${config.airtableBaseId}/Bookings`, {
      headers: {
        'Authorization': `Bearer ${config.airtablePersonalAccessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const askAIAssistant = async (question) => {
  // Implement OpenAI API call for the AI Assistant
  // Return the AI's response
};

// Add other API-related functions here