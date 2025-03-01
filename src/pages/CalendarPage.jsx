import React from "react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddEvent from "../components/AddEvent";
import CustomEvent from "../components/userEvent";
import SearchBar from "../components/SearchBar";

export default function CalendarPage({ onLogin, isLoggedIn }) {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [addEventPopUp, setAddEventPopUp] = useState(false);

  const displayAddEvent = () => setAddEventPopUp(true);
  const hideAddEvent = () => setAddEventPopUp(false);

  const addEvent = (eventData) => {
    addEventPopUp ? hideAddEvent() : 0;
    setCurrentEvents((events) => [...events, eventData]);
  };

  const formatDateTime = (isoString) => {
    if (isoString == undefined) return;
    if (!isoString.includes("T")) return isoString;

    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const fetchUser = async (user) => {
    console.log("Checking database for user...");
    try {
      const response = await fetch(
        `http://localhost:8000/users/?userId=${user.userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("\tUser found:", { data });

        setUsers((users = []) => [
          ...users,
          {
            userId: data.user.userId,
            name: data.user.name,
            eventColor: data.user.eventColor,
            profileImage: data.user.picture,
            linkedUsers: data.user.linkedUsers,
            email: data.user.email,
          },
        ]);
        setLoggedInUser({
          userId: data.user.userId,
          name: data.user.name,
          eventColor: data.user.eventColor,
          profileImage: data.user.picture,
          linkedUsers: data.user.linkedUsers,
          email: data.user.email,
        });
        fetchCalendarsAndMerge(user.userId, data.user.linkedUsers);
      } else if (response.status === 404) {
        console.log("\tUser not found, adding the user to the database...");
        const addUser = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          picture: user.picture,
        };

        const createResponse = await fetch(`http://localhost:8000/users/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addUser),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create user");
        }

        const newUser = await createResponse.json();
        console.log("\tUser added to database:", { newUser });
        console.log(newUser.userId);

        setUsers((users = []) => [
          ...users,
          {
            userId: newUser.userId,
            name: newUser.name,
            eventColor: newUser.eventColor,
            profileImage: newUser.picture,
            linkedUsers: newUser.linkedUsers,
            email: newUser.email,
          },
        ]);
        setLoggedInUser({
          userId: newUser.user.userId,
          name: newUser.user.name,
          eventColor: newUser.user.eventColor,
          profileImage: newUser.user.picture,
          linkedUsers: newUser.user.linkedUsers,
          email: newUser.user.email,
        });
        fetchCalendarsAndMerge(user.userId, newUser.user.linkedUsers);
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching or creating user:", error);
    }
  };

  const fetchUsers = async () => {
    console.log("Fetching all users...");
    try {
      const response = await fetch(`http://localhost:8000/users/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("\tUsers in database:", data.users);
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  //Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const addLinkedUser = async (userId) => {
    console.log(loggedInUser);
    if (!userId || !loggedInUser) {
      throw new Error(
        "Couldnt link users: userId or loggedInUser not provided"
      );
    }
    console.log("\tUpdating linked users...");
    const updatedLinkedUsers = loggedInUser.linkedUsers
      ? [...loggedInUser.linkedUsers, userId]
      : [userId];

    const updateUser = {
      userId: loggedInUser.userId,
      name: loggedInUser.name,
      email: loggedInUser.email,
      eventColor: loggedInUser.eventColor,
      linkedUsers: updatedLinkedUsers,
      profileImage: loggedInUser.profileImage,
    };

    const response = await fetch(
      `http://localhost:8000/users/?userId=${loggedInUser.userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUser),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create user");
    } else {
      const newLinkedUserEvents = await fetchSupaBaseEvents(userId);
      setCurrentEvents((pastEvents) => [
        ...pastEvents,
        ...(Array.isArray(newLinkedUserEvents)
          ? newLinkedUserEvents
          : [newLinkedUserEvents]),
      ]);
      console.log(currentEvents);
    }
  };

  const eventsNotInSupabase = (googleEvents, supaBaseEvents) => {
    console.log("Comparing Google events vs SupaBase events");
    const newEvents = [
      ...googleEvents.filter(
        (event1) =>
          !supaBaseEvents.some(
            (event2) =>
              event1.title == event2.title &&
              event1.start == event2.start &&
              event1.end == event2.end
          )
      ),
    ];
    console.log("\tEvents found in Google but not in SupaBase", { newEvents });
    return newEvents;
  };

  const addEventsToSupabase = async (events) => {
    console.log("Adding events to SupaBase...", { events });
    try {
      const response = await fetch("http://localhost:8000/events/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(events),
      });

      const data = await response.json();
      console.log("\tSuccessfully added to SupaBase:", { data });
    } catch (error) {
      console.error("Error sending events:", error);
    }
  };

  const fetchGoogleEvents = async (userId) => {
    console.log("\tFetching events from Google...");
    const googleEvents = [];
    try {
      const response = await fetch(`http://localhost:8000/googleEvents`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log("\t\tGoogle events:", { data });

      for (const event of data) {
        if (event["start"]["dateTime"]) {
          googleEvents.push({
            title: event["summary"],
            start: formatDateTime(event["start"]["dateTime"]),
            end: formatDateTime(event["end"]["dateTime"]),
            userId: userId,
          });
        } else {
          googleEvents.push({
            title: event["summary"],
            start: event["start"]["date"],
            end: event["end"]["date"],
            userId: userId,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
    return googleEvents;
  };

  const fetchSupaBaseEvents = async (userId) => {
    console.log("\tFetching events from SupaBase...");
    const supaBaseEvents = [];

    try {
      const response = await fetch(
        `http://localhost:8000/events/?userId=${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      for (const event of data) {
        supaBaseEvents.push(event);
      }
      console.log("\t\tSupaBase events:", { data });
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }

    return supaBaseEvents;
  };

  const fetchCalendarsAndMerge = async (userId, linkedUsers) => {
    console.log("Fetching events from user...");
    const googleEvents = await fetchGoogleEvents(userId);
    const supaBaseEvents = await fetchSupaBaseEvents(userId);

    for (const user in linkedUsers) {
      const linkedEvents = await fetchSupaBaseEvents(linkedUsers[user]);

      setCurrentEvents((pastEvents) => [
        ...pastEvents,
        ...(Array.isArray(linkedEvents) ? linkedEvents : [linkedEvents]),
      ]);
    }

    const notInSupabase = eventsNotInSupabase(googleEvents, supaBaseEvents);

    setCurrentEvents((pastEvents) => [...pastEvents, ...supaBaseEvents]);
    setCurrentEvents((pastEvents) => [...pastEvents, ...notInSupabase]);

    notInSupabase.length ? addEventsToSupabase(notInSupabase) : 0;
  };

  const fetchSession = async () => {
    console.log("Checking if user is logged in...");
    try {
      const response = await fetch("http://localhost:8000/session", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then()
        .catch((error) => console.log(error));

      const data = await response.json();
      if (data.logged_in == true) {
        console.log("\tUser is logged in", { data });
        onLogin();
        fetchUser(data);
      } else {
        console.log("\tUser not logged in.");
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <>
      <SearchBar addLinkedUser={addLinkedUser} loggedInUser={loggedInUser} />
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
