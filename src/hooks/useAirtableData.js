import { useState, useEffect } from 'react';
import Airtable from 'airtable';
import { config, validateConfig } from '../config';

export function useAirtableData() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      validateConfig();
      // ... (existing Airtable connection and fetching logic)
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { records, error };
}