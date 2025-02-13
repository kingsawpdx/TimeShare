import React from 'react';
import { useState,useEffect } from 'react';

export default function CalendarPage() {
  const [flaskHello, setFlaskHello] = useState('Error!');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((jdata) => {
        setFlaskHello(jdata.hello);
      });
  }, []);

  return (
    <div>
      <h1>React App Boilerplate</h1>
      <p> Hello! {flaskHello} </p>
    </div>
  );
}
