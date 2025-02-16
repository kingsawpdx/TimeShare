import React from "react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    fetch("../data.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((event) => {
          setCurrentEvents((events) => [...events, event]);
        });
      });
  }, []);

  return (
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
  );
}
