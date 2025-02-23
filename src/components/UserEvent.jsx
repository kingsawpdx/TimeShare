import React from "react";

const CustomEvent = (props) => {
  const users = props.currentUsers;
  const eventInfo = props.eventInfo;

  const getUserColorId = (eventData) => {
    for (const user of users) {
      if (eventData.event.extendedProps.userId == user.id) {
        return user.eventColor;
      }
    }
    return "#999999";
  };

  return (
    <div
      className="customEvent"
      style={{
        backgroundColor: getUserColorId(eventInfo),
        height: "100%",
        border: "none",
        borderRadius: "5px",
        outline: "none",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        backgroundClip: "padding-box",
        overflow: "hidden",
      }}
    >
      <div
        className="innerDiv"
        style={{
          height: "100%",
          width: "6px",
          backgroundColor: getUserColorId(eventInfo),
          borderRadius: "5px 1px 1px 5px",
          marginLeft: "-1px",
          marginRight: "5px",
          filter: "contrast(900%)",
        }}
      />

      <span>{eventInfo.event.title}</span>
    </div>
  );
};

export default CustomEvent;
