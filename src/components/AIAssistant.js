import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import '../styles/AIAssistant.css';

function AIAssistant({ records }) {
  // State for user query, AI response, loading state, and OpenAI instance
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openai, setOpenai] = useState(null);

  useEffect(() => {
    // Initialize OpenAI instance if API key is available
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      setOpenai(new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: This is not recommended for production
      }));
    } else {
      console.error('OpenAI API key is missing');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!openai) {
      setResponse('Error: OpenAI client is not initialized');
      return;
    }
    setIsLoading(true);

    // Prepare a summary of the AirTable data if available
    const dataSummary = records ? prepareDataSummary(records) : 'No booking data available';

    try {
      // Send request to OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI assistant for ABC Cleaning, a cleaning service company. You have access to their booking data. Analyze the data to answer questions accurately. Here's a summary of the current booking data: ${dataSummary}` },
          { role: "system", content: "When answering questions, perform any necessary calculations or analysis based on the provided data. Be specific and provide numerical answers when appropriate." },
          { role: "user", content: query }
        ],
        max_tokens: 750,
      });

      setResponse(completion.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, I encountered an error while processing your request.');
    }

    setIsLoading(false);
  };

  // Function to prepare a summary of the AirTable data
  const prepareDataSummary = (records) => {
    if (!records || records.length === 0) {
      return 'No booking data available';
    }

    const totalBookings = records.length;
    let summaryString = `Total Bookings: ${totalBookings}\n\nBooking Data:\n`;

    records.forEach((record, index) => {
      summaryString += `Booking ${index + 1}:\n`;
      Object.entries(record.fields).forEach(([key, value]) => {
        summaryString += `  ${key}: ${value}\n`;
      });
      summaryString += '\n';
    });

    return summaryString;
  };

  return (
    <div className="ai-assistant">
      <h2>Make Sense of Your Data</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about the business..."
          rows="4"
        />
        <button type="submit" disabled={isLoading || !openai}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {response && (
        <div className="response">
          <strong>Answer:</strong> {response}
        </div>
      )}
    </div>
  );
}

export default AIAssistant;