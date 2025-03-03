import React, { useEffect, useState, useMemo, useRef } from "react";

export default function SearchBar({ addLinkedUser, loggedInUser }) {
  const [users, setUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const searchRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setUserInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayUsers = useMemo(() => {
    return users.filter((user) =>
      user?.name?.toLowerCase().includes(userInput.toLowerCase())
    );
  }, [users, userInput]);

  return (
    <div className="searchBar" ref={searchRef}>
      <h3>Search for users: </h3>
      <input
        type="text"
        placeholder="Search users..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <ul className="search-results">
        {userInput
          ? displayUsers.map((user) => (
              <li key={user.userId}>
                <div className="user-info">
                  <img
                    src={user.profileImage}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  className="follow-btn"
                  onClick={() => addLinkedUser(user.userId)}
                >
                  Follow
                </button>
              </li>
            ))
          : ""}
      </ul>
    </div>
  );
}
