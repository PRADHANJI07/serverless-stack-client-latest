/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "../libs/errorLib";
import config from "../config";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Settings.css";


export default function Settings() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    function billUser(details) {
        return API.post("notes", "/billing", {
            body: details
        });
    }
    return (
        <div className="Settings">
            <LinkContainer to="/settings/email">
                <LoaderButton block bsSize="large" className="customEmail">
                    Change Email
                </LoaderButton>
            </LinkContainer>
            <LinkContainer to="/settings/password">
                <LoaderButton block bsSize="large" className="customPassword">
                    Change Password
                </LoaderButton>
            </LinkContainer>
            <hr />
            
        </div>
    );
}
