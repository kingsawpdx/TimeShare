import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import backgroundImage from '../assets/images/ph2.jpg';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    if (!email || !password) {
      setError('Please fill out both fields.');
    } else {
      setError('');
      alert('Logged in successfully!');
      // You can redirect or make an API call for authentication here
    }
  };

  const loginWithGoogle = (e) => {
    e.preventDefault();
    try {
      window.location.href = 'http://localhost:8000/login';
    } catch (error) {
      console.error('Login redirection failed:', error);
      alert('Failed to redirect to Google login. Please try again.');
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
      <Container>
        <Row>
          <Col md={5}>
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
                <Form>
                  {/* Email field */}
                  <Form.Group
                    controlId="formBasicEmail"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ fontSize: '1.1rem', padding: '1rem' }}
                    />
                  </Form.Group>

                  {/* Password field */}
                  <Form.Group
                    controlId="formBasicPassword"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ fontSize: '1.1rem', padding: '1rem' }}
                    />
                  </Form.Group>

                  {/* Error message */}
                  {error && (
                    <p
                      className="text-danger"
                      style={{ fontSize: '1rem', marginBottom: '1rem' }}
                    >
                      {error}
                    </p>
                  )}

                  {/* Login button */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{ padding: '1rem', fontSize: '1.2rem' }}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{
                      marginTop: '10px',
                      padding: '1rem',
                      fontSize: '1.2rem',
                    }}
                    onClick={loginWithGoogle}
                  >
                    Login with Google
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
