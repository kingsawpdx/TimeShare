import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import backgroundImage from '../assets/images/ph2.jpg';

export default function ProfilePage() {

  const [userId, setUserId] = useState([]);
  const [userName, setUserName] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState([]);
  const [userEmail, setUserEmail] = useState([]);
  const [userEventColor, setUserEventColor] = useState([]);

  const [newUserName, setNewUserName] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState([]);
  const [newUserEventColor, setNewUserEventColor] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /*
  const loginWithGoogle = (e) => {
    e.preventDefault();
    try {
      window.location.href = 'http://localhost:8000/login';
    } catch (error) {
      console.error('Login redirection failed:', error);
      alert('Failed to redirect to Google login. Please try again.');
    }
  };
  */

  const fetchUser = async (user) => {
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
        return data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  const fetchSessionUser = async () => {
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
        return await fetchUser(data);
      } else {
        console.log("\tUser not logged in.");
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  const fetchUserDetails = async () => {
    const user = await fetchSessionUser();
    setUserId(user.user.userId);
    setUserName(user.user.name);
    setUserProfileImage(user.user.profileImage);
    setUserEmail(user.user.email);
    setUserEventColor(user.user.eventColor);

    setNewUserName(user.user.name);
    setNewUserEmail(user.user.email);
    setNewUserEventColor(user.user.eventColor);
  }

  const handleSubmit = async (event) => {
    const response = await fetch(
      `http://localhost:8000/users/?userId=${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify(
          {
            "userId": userId,
            "name": newUserName,
            "email": newUserEmail,
            "linkedUsers": "{}",
            "eventColor" : newUserEventColor,
            "profileImage": userProfileImage
          }
        )
      }
    );
  }

  return (
    <div
      style={{
        background: ` url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        padding: '0 10px',
      }}
    >
      <center>
        <Container>
          <Row>
            <Col>
              <Card
                style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  background: 'rgba(255, 255, 255,0.6)',
                }}
              >
                <Card.Body>
                  <Container>
                    <Row>
                      <Col>
                        <h3>Profile:</h3>
                        <Form>
                          <Form.Group className="mb-3" controlId="userData.name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" onChange={(e) => {setNewUserName(e.target.value)}} defaultValue={userName}/>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="userData.email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" onChange={(e) => {setNewUserEmail(e.target.value)}} defaultValue={userEmail} />
                          </Form.Group>

                          <Form.Select padding="sm" aria-label="Default select example" onChange={(e) => {setNewUserEventColor(e.target.value)}}>
                            <option value={userEventColor}>Event Color</option>
                            <option value="DarkOrange">Dark Orange</option>
                            <option value="Crimson">Crimson</option>
                            <option value="ForestGreen">Forest Green</option>
                            <option value="SkyBlue">Sky Blue</option>
                            <option value="Teal">Teal</option>
                            <option value="Tomato">Tomato</option>
                            <option value="Violet">Violet</option>
                          </Form.Select>

                          <Button variant="primary" onClick={handleSubmit}>
                            Save Changes
                          </Button>
                        </Form>
                      </Col>
                      <Col>
                        <img src={userProfileImage}></img>
                      </Col>
                  </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </center>
    </div>
  );
}
