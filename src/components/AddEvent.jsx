import React, { useState } from "react";
import Switch from "react-switch";

const addEvent = ({ displayed, onClose, onSave }) => {
  const [allDayEvent, setAllDayEvent] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    userId: "1",
  });

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("Please fill in all fields!");
      return;
    }
    onSave(eventData);
    setEventData({ title: "", start: "", end: "" });
  };

  const handleCancel = () => {
    setEventData({
      title: "",
      start: "",
      end: "",
    });
    onClose();
  };

  const changeDayType = () => {
    setAllDayEvent(!allDayEvent);
  };

  if (!displayed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          width: "320px",
        }}
      >
        <h2 style={{ fontWeight: "bold", marginBottom: "16px" }}>Add Event</h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            paddingBottom: "8px",
          }}
        >
          <label
            style={{
              fontSize: "18px",
            }}
            for="switch"
          >
            All day event?
          </label>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Switch
              id="switch"
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              offHandleColor="#2c3e50"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              onChange={changeDayType}
              checked={allDayEvent}
            />
          </div>
        </div>

        {allDayEvent ? (
          <>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventData.title}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="date"
              name="start"
              value={eventData.start}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="date"
              name="end"
              value={eventData.end}
              onChange={handleChange}
              style={inputStyle}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventData.title}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="datetime-local"
              name="start"
              value={eventData.start}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="datetime-local"
              name="end"
              value={eventData.end}
              onChange={handleChange}
              style={inputStyle}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#2c3e50",
              color: "white",
              padding: "8px 16px",
              marginRight: "8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#2c3e50",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default addEvent;
