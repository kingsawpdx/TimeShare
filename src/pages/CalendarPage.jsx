import React from "react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddEvent from "../components/AddEvent";
import CustomEvent from "../components/userEvent";

export default function CalendarPage() {
  const [totalEvents, setTotalEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [addEventPopUp, setAddEventPopUp] = useState(false);

  const displayAddEvent = () => setAddEventPopUp(true);
  const hideAddEvent = () => setAddEventPopUp(false);

  const addEvent = (eventData) => {
    addEventPopUp ? hideAddEvent() : 0;
    setCurrentEvents((events) => [...events, eventData]);
  };

  const loadEvents = (id) => {
    setCurrentEvents((pastEvents) => [
      ...pastEvents,
      ...totalEvents.filter((event) => event.userId == id),
    ]);
  };

  const login = (user) => {
    if (totalEvents.length > 0) {
      loadEvents(user.id);

      user["linkedUsers"].forEach((linkedUserId) => loadEvents(linkedUserId));
    }
  };

  //Initial fetch achieves the following:
  // - stores all events in database in: totalEvents
  // - stores all users in: users
  // - simulates loggin in by setting the first user as 'loggedInUser'
  useEffect(() => {
    fetch("../data.json")
      .then((response) => response.json())
      .then((data) => {
        setTotalEvents(data["events"]);
        setUsers(data["users"]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (users.length > 0 && totalEvents.length > 0) {
      login(users[0]);
    }
  }, [totalEvents, users]);

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,dayGridMonth",
        }}
        slotMinTime={"08:00"}
        firstDay={1}
        events={currentEvents.map((event) => ({
          ...event,
          backgroundColor: "whitesmoke",
          borderColor: "transparent",
        }))}
        eventContent={(eventInfo) => (
          <CustomEvent eventInfo={eventInfo} currentUsers={users} />
        )}
      />
      <button
        onClick={displayAddEvent}
        style={{
          zIndex: "2",
          fontFamily: "Helvetica Neue",
          position: "fixed",
          bottom: "16px",
          right: "16px",
          backgroundColor: "var(--fc-button-bg-color)",
          borderColor: "var(--fc-button-border-color)",
          color: "white",
          padding: "10px 16px",
          borderRadius: "0.25em",
        }}
      >
        + Add Event
      </button>

      <AddEvent
        displayed={addEventPopUp}
        onClose={hideAddEvent}
        onSave={addEvent}
      />
    </>
  );
}
