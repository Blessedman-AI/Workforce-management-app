'use client';

import { useState, useEffect } from 'react';

const Greeting = ({ name }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <h1
      className="text-subheading-1 flex justify-start 
    items-center"
    >{`${greeting} ${name}`}</h1>
  );
};

export default Greeting;
