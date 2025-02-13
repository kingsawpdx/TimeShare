import React from "react";
import { useState, useEffect } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";

export default function CalendarPage() {
  let today = new Date().toISOString().slice(0, 10);

  const calendar = useCalendarApp({
    calendars: {
      personal: {
        colorName: "personal",
        lightColors: {
          main: "#f9d71c",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
      work: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
    },

    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: "1",
        title: "Software Engineering",
        start: "2025-02-11 16:40",
        end: "2025-02-11 18:30",
      },
      {
        id: "2",
        title: "Software Engineering",
        start: "2025-02-13 16:40",
        end: "2025-02-13 18:30",
      },
      {
        id: "3",
        title: "Sprint check-in",
        start: "2025-02-13 16:00",
        end: "2025-02-13 16:40",
        calendarId: "personal",
      },
      {
        id: "4",
        title: "Quiz 10: Managing Complexity 2",
        start: "2025-02-13",
        end: "2025-02-13",
        calendarId: "work",
      },
      {
        id: "5",
        title: "Assignment 5: Managing Complexity",
        start: "2025-02-13",
        end: "2025-02-13",
        calendarId: "work",
      },
    ],
    selectedDate: today,
    firstDayOfWeek: 1,
    dayBoundaries: {
      start: "08:00",
      end: "24:00",
    },
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
