import React from "react";
import useApiData from "../components/useAPI_fetchHook";

export default function EventsPage() {
  let url = "";
  const { data: result, loading, error } = useApiData(url);

  return (
    <>
      <h2>Welcome to the Events Page!</h2>
    </>
  );
}
