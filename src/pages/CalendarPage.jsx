import React from "react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddEvent from "../components/AddEvent";

export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [addEventPopUp, setAddEventPopUp] = useState(false);

  const displayAddEvent = () => setAddEventPopUp(true);
  const hideAddEvent = () => setAddEventPopUp(false);

  const addEvent = (eventData) => {
    addEventPopUp ? hideAddEvent() : 0;
    setCurrentEvents((events) => [...events, eventData]);
  };

  useEffect(() => {
    fetch("../data.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((event) => {
          addEvent(event);
        });
      });
  }, []);

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
        events={currentEvents}
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
