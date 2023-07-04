import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare, BsSearch, BsTrash } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [appDescription, setAppDescription] = useState("A simple note taking app");

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAppDescription("A simple note taking app");
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function loadNotes() {
    return API.get("notes", "/notes");
  }

  function filterNotes() {
    return notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  function handleNoteClick(noteId, ctrlKey) {
    if (!ctrlKey) {
      if (selectedNotes.includes(noteId)) {
        setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
      } else {
        setSelectedNotes([...selectedNotes, noteId]);
      }
    }
  }

  async function handleDeleteNotes() {
    try {
      // Delete the selected notes
      await Promise.all(selectedNotes.map(noteId => API.del("notes", `/notes/${noteId}`)));

      // Reload the notes after deletion
      const updatedNotes = await loadNotes();
      setNotes(updatedNotes);
      setSelectedNotes([]);
    } catch (e) {
      onError(e);
    }
  }

  function handleCheckboxChange(noteId, checked) {
    if (checked) {
      setSelectedNotes([...selectedNotes, noteId]);
    } else {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    }
  }

  function renderSearchBar() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BsSearch size={17} className="search-icon" />
      </div>
    );
  }

  function renderNotesList(notes) {
    const filteredNotes = filterNotes();

    return (
      <>
        {renderSearchBar()}
        <div className="note-actions">
          {selectedNotes.length > 0 && (
            <button className="delete-button" onClick={handleDeleteNotes}>
              <BsTrash size={20} />
            </button>
          )}
          <LinkContainer to="/notes/new">
            <ListGroup.Item
              action
              className="py-3 text-nowrap text-truncate create-note"
            >
              <BsPencilSquare size={17} />
              <span className="ml-2 font-weight-bold">Create a new note</span>
            </ListGroup.Item>
          </LinkContainer>
        </div>
        {filteredNotes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item
              action
              className={`note-item ${
                selectedNotes.includes(noteId) ? "selected" : ""
              }`}
              onClick={(e) => handleNoteClick(noteId, e.ctrlKey)}
            >
              <div className="note-checkbox">
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(noteId)}
                  onChange={(e) => handleCheckboxChange(noteId, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="note-content">
                <span className="font-weight-bold">
                  {content.trim().split("\n")[0]}
                </span>
                <br />
                <span className="text-muted">
                  Created: {new Date(createdAt).toLocaleString()}
                </span>
              </div>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted custom-app-description typewriter">
          {appDescription}
        </p>
        <div className="pt-3">
          <Link
            to="/login"
            className="btn btn-info btn-lg mr-3 custom-login-button"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-success btn-lg custom-signup-button"
          >
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
