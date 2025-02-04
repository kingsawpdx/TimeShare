import React, { useEffect, useState } from "react";

const App = () => {
  const [ flaskHello, setFlaskHello ] = useState("Error!");

  useEffect( () => { 
    fetch("/api/hello")
      .then( res => res.json() )
      .then( jdata => { setFlaskHello( jdata.hello ); }); 
    }, []);

  return (
    <div>
      <h1>React App Boilerplate</h1>
      <p> Hello! {flaskHello} </p>
    </div>
  );
};

export default App;
