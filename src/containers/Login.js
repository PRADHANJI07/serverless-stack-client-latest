import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { FacebookLoginButton } from "react-social-login-buttons";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function handleFbLogin() {
    // Perform the Facebook login action here
    // You can customize this function based on your requirements
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label className="custom">Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label className="custom">Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <div className="forgot-password custom">
          <Link to="/login/reset">Forgot password?</Link>
        </div>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
          className="Custom-login-btn"
        >
          Login
        </LoaderButton>
        <hr />
        <a
          href={`https://www.facebook.com/v13.0/dialog/oauth?client_id=1741782039633954&redirect_uri=${encodeURIComponent(
            "https://bhabesh-notes.netlify.app/login/callback"
          )}`}
        >
          <FacebookLoginButton size="small" onClick={handleFbLogin} />
        </a>
      </Form>
    </div>
  );
}
