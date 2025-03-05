import React, { useState } from 'react';
import useApiData from '../components/useAPI_fetchHook';

export default function EventsPage() {

  const [searchTerm, setSearchTerm] = useState('music');
  const [stateCode, setStateCode] = useState('OR');

  const API_KEY = import.meta.env.VITE_API_KEY_EVENTS;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${searchTerm}&countryCode=US&stateCode=${stateCode}`;

  const { data: result, loading, error } = useApiData(url);

  const uniqueEvents = result?._embedded?.events || [];


  const sortedEvents = uniqueEvents.sort((a, b) => {
    const dateA = new Date(a.dates?.start?.localDate);
    const dateB = new Date(b.dates?.start?.localDate);
    return dateA - dateB;
  });

  const addToCalendar = (event) => {
    const eventName = encodeURIComponent(event.name);
    const location = encodeURIComponent(
      `${event._embedded?.venues?.[0]?.name}, ${event._embedded?.venues?.[0]?.city?.name}, ${event._embedded?.venues?.[0]?.state?.name}`
    );
    const details = encodeURIComponent('Event from Ticketmaster');
    const startDate = event.dates?.start?.localDate
      ? event.dates.start.localDate.replace(/-/g, '')
      : '';
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${startDate}/${startDate}&details=${details}&location=${location}&sf=true&output=xml`;
    window.open(calendarUrl, '_blank');
  };

  return (

    <div className="container py-4">
      <h2 className="text-center mb-4">Search for Events</h2>
      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="form-label mb-0">Keyword:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Try 'Music' , 'NBA' or 'comedy'"
          className="form-control form-control-lg"
        />
        <label className="form-label mb-0">State:</label>
        <select
          className="form-select form-select-lg"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
        >
          <option value="AL">Alabama</option>
        	<option value="AK">Alaska</option>
        	<option value="AZ">Arizona</option>
        	<option value="AR">Arkansas</option>
        	<option value="CA">California</option>
        	<option value="CO">Colorado</option>
        	<option value="CT">Connecticut</option>
        	<option value="DE">Delaware</option>
        	<option value="DC">District Of Columbia</option>
        	<option value="FL">Florida</option>
        	<option value="GA">Georgia</option>
        	<option value="HI">Hawaii</option>
        	<option value="ID">Idaho</option>
        	<option value="IL">Illinois</option>
        	<option value="IN">Indiana</option>
        	<option value="IA">Iowa</option>
        	<option value="KS">Kansas</option>
        	<option value="KY">Kentucky</option>
        	<option value="LA">Louisiana</option>
        	<option value="ME">Maine</option>
        	<option value="MD">Maryland</option>
        	<option value="MA">Massachusetts</option>
        	<option value="MI">Michigan</option>
        	<option value="MN">Minnesota</option>
        	<option value="MS">Mississippi</option>
        	<option value="MO">Missouri</option>
        	<option value="MT">Montana</option>
        	<option value="NE">Nebraska</option>
        	<option value="NV">Nevada</option>
        	<option value="NH">New Hampshire</option>
        	<option value="NJ">New Jersey</option>
        	<option value="NM">New Mexico</option>
        	<option value="NY">New York</option>
        	<option value="NC">North Carolina</option>
        	<option value="ND">North Dakota</option>
        	<option value="OH">Ohio</option>
        	<option value="OK">Oklahoma</option>
        	<option value="OR">Oregon</option>
        	<option value="PA">Pennsylvania</option>
        	<option value="RI">Rhode Island</option>
        	<option value="SC">South Carolina</option>
        	<option value="SD">South Dakota</option>
        	<option value="TN">Tennessee</option>
        	<option value="TX">Texas</option>
        	<option value="UT">Utah</option>
        	<option value="VT">Vermont</option>
        	<option value="VA">Virginia</option>
        	<option value="WA">Washington</option>
        	<option value="WV">West Virginia</option>
        	<option value="WI">Wisconsin</option>
        	<option value="WY">Wyoming</option>
      </select>
      </div>

      {loading && <p className="text-center">Loading events...</p>}
      {error && (
        <p className="text-danger text-center">Error fetching events.</p>
      )}

      <div className="row">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="col-12 col-sm-6 col-md-4 mb-4 d-flex align-items-stretch"
          >
            <div className="card shadow-sm w-100 d-flex flex-column">
              <img
                src={
                  event.images?.find((img) => img.width >= 300)?.url ||
                  event.images?.[0]?.url
                }
                alt={event.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">
                  <strong>Location:</strong>{' '}
                  {event._embedded?.venues?.[0]?.name},{' '}
                  {event._embedded?.venues?.[0]?.city?.name},{' '}
                  {event._embedded?.venues?.[0]?.state?.name}
                </p>
                <p className="card-text">
                  <strong>Date:</strong> {event.dates?.start?.localDate}
                </p>
                <p className="card-text text-muted">
                  {event.priceRanges
                    ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
                    : 'Price not available'}
                </p>
                <div className="mt-auto d-flex flex-column">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info mb-2"
                  >
                    View Event
                  </a>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCalendar(event)}
                  >
                    Add to Google Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
