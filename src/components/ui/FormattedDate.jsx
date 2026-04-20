'use client';

import { useState, useEffect } from 'react';

/**
 * FormattedDate Component
 * @description Prevents hydration mismatch by only rendering the date on the client.
 */
export default function FormattedDate({ date, options = {} }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">Loading...</span>;
  }

  try {
    const d = new Date(date);
    return <span>{d.toLocaleDateString(undefined, options)}</span>;
  } catch (e) {
    return <span>Invalid Date</span>;
  }
}
