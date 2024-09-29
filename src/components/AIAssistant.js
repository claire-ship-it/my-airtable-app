import React, { useState } from 'react';
import { Input } from 'antd';
import { PulsatingButton } from '../ui/PulsatingButton';
import OpenAI from "openai";

const { TextArea } = Input;

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
});

const AIAssistant = ({ businessData, allBookings }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const createContext = () => {
    const bookingsContext = allBookings.map(booking => {
      const bookingFields = Object.entries(booking.fields)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n        ');

      return `
        Booking ID: ${booking.id}
        ${bookingFields}
      `;
    }).join('\n\n');

    return `
      Here's some context about the business:
      - Total Revenue: $${businessData.revenue}
      - Total Profit: $${businessData.profit}
      - Gross Margin: ${businessData.grossMargin}%
      - Total Rating: ${businessData.totalRating}/5
      - Recurring Customers: ${businessData.recurringCustomers}
      - Total Bookings: ${businessData.totalBookings}
      
      The business offers various cleaning services including Deep Clean, Standard Clean, and Move In/Out Clean.
      Bookings can be One-Time, Weekly, Bi-weekly, or Monthly.

      Here's a detailed list of all bookings with all available fields:
      ${bookingsContext}
    `;
  };

  const handleSubmit = async () => {
    console.log('Submitted question:', question);
    setLoading(true);

    const context = createContext();

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a business consultant AI. Provide direct, concise answers to questions about the business. Lead with the answer, then briefly mention key factors. Only provide detailed analysis or calculations if the user specifically asks 'how' or 'why'. Your responses should be clear and actionable for business improvement."
          },
          { role: "user", content: context },
          { role: "user", content: question }
        ],
        max_tokens: 150,
      });
      
      const aiResponse = completion.choices[0].message.content.trim();
      console.log('Received response:', aiResponse);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <h2>Make Sense of Your Data</h2>
      <TextArea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the business..."
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
      <PulsatingButton
        onClick={handleSubmit}
        pulseColor="0, 9, 68" // Darkest logo color
        backgroundColor="147, 220, 245" // Lightest logo color
        duration="2s"
        className="ask-button"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask Me!'}
      </PulsatingButton>
      {response && (
        <div className="ai-response">
          <h3>AI Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;