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

    // Prepare a summary of the AirTable data
    const dataSummary = prepareDataSummary(records);

    try {
      // Send request to OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a helpful assistant that answers questions about ABC Cleaning bookings. Here's a summary of the current booking data: ${dataSummary}` },
          { role: "assistant", content: "Ensure that you not only answer the user's question but also the implied question. Think through what is being asked of you and given the data provided before any necessary calculations to effectively answer the question." },
          { role: "user", content: query }
        ],
        max_tokens: 150,
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
    const totalBookings = records.length;
    const columnSummaries = {};

    // Get all unique column names
    const allColumns = new Set();
    records.forEach(record => {
      Object.keys(record.fields).forEach(key => allColumns.add(key));
    });

    // Initialize summaries for each column
    allColumns.forEach(column => {
      columnSummaries[column] = {
        type: null,
        uniqueValues: new Set(),
        numericTotal: 0,
        numericCount: 0
      };
    });

    // Process each record
    records.forEach(record => {
      Object.entries(record.fields).forEach(([key, value]) => {
        const summary = columnSummaries[key];
        
        // Determine the type of data in this column
        if (summary.type === null) {
          summary.type = typeof value;
        }

        // Add to unique values
        summary.uniqueValues.add(value);

        // If numeric, add to total
        if (typeof value === 'number') {
          summary.numericTotal += value;
          summary.numericCount++;
        }
      });
    });

    // Generate summary string
    let summaryString = `Total Bookings: ${totalBookings}\n`;

    Object.entries(columnSummaries).forEach(([column, summary]) => {
      summaryString += `${column}:\n`;
      summaryString += `  Unique Values: ${summary.uniqueValues.size}\n`;
      
      if (summary.type === 'number') {
        const average = summary.numericCount > 0 ? summary.numericTotal / summary.numericCount : 0;
        summaryString += `  Average: ${average.toFixed(2)}\n`;
      }

      // If there are fewer than 5 unique values, list them
      if (summary.uniqueValues.size < 5) {
        summaryString += `  Values: ${Array.from(summary.uniqueValues).join(', ')}\n`;
      }
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