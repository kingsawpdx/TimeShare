//import React, { useEffect, useState } from "react";
import React from 'react';
import NavMenu from './components/NavMenu';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';


function App() {
  return (
    <Router>
      <NavMenu />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/search" element={<EventsPage />} />
      </Routes>
    </Router>
  );

  // const [ flaskHello, setFlaskHello ] = useState("Error!");

  // useEffect( () => {
  //   fetch("/api/hello")
  //     .then( res => res.json() )
  //     .then( jdata => { setFlaskHello( jdata.hello ); });
  //   }, []);

  // return (
  //   <div>
  //     <h1>React App Boilerplate</h1>
  //     <p> Hello! {flaskHello} </p>
  //   </div>
  // );
}

export default App;
