import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import backgroundImage from '../assets/images/ph2.jpg';

export default function ProfilePage() {

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

  const saveProfileChanges = (user) => {
    try {
      const response = fetch(
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
        const data = response.json();
        console.log("\tUser found:", { data });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

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
        saveProfileChanges(data);
      } else {
        console.log("\tUser not logged in.");
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

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
                  <h3
                    className="text-center"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      color: '#333',
                    }}
                  >
                    Login
                  </h3>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{
                      marginTop: '10px',
                      padding: '1rem',
                      fontSize: '1.2rem',
                    }}
                    onClick={fetchSession}
                  >
                    Login with Google
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </center>
    </div>
  );
}
