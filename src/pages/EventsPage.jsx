import React from 'react';
import useApiData from '../components/useAPI_fetchHook';

export default function EventsPage() {
  let url =
    'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=4Tg48UlLIBDincgEA1HZmvynXAH2ITOg';
  const { data: result, loading, error } = useApiData(url);
  console.log('Result: ', result);

  return (
<>
      <h2>Welcome to the Events Page!</h2>
      </>
    
  );
}
