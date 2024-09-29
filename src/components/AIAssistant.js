import React, { useState } from 'react';
import { Input, Button } from 'antd';

const { TextArea } = Input;

const AIAssistant = () => {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    // Implement the submit logic here
    console.log('Submitted question:', question);
    // Clear the input after submission
    setQuestion('');
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
      <Button type="primary" onClick={handleSubmit}>
        Ask
      </Button>
    </div>
  );
};

export default AIAssistant;