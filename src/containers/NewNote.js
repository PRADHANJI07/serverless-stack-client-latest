import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewNote() {
  const fileRefs = useRef([]);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState([]);

  function validateForm() {
    return notes.length > 0 && notes.every((note) => note.content.length > 0);
  }

  async function handleFileChange(event, index) {
    const files = Array.from(event.target.files);
    fileRefs.current[index] = files;

    const urls = [];
    for (const file of files) {
      urls.push(URL.createObjectURL(file));
    }
    setAttachmentUrls((prevUrls) => [...prevUrls, ...urls]);
  }

  function handleContentChange(index, value) {
    setNotes((prevNotes) =>
      prevNotes.map((note, i) => (i === index ? { ...note, content: value } : note))
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newNotes = [];
      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const attachments = [];
        if (fileRefs.current[i]) {
          for (let j = 0; j < fileRefs.current[i].length; j++) {
            const file = fileRefs.current[i][j];
            if (file.size > config.MAX_ATTACHMENT_SIZE) {
              alert(
                `Please pick a file smaller than ${
                  config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
              );
              setIsLoading(false);
              return;
            }
            const attachment = await s3Upload(file);
            attachments.push(attachment);
          }
        }
        const createdNote = await createNote({ content: note.content, attachments });
        newNotes.push(createdNote);
      }
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  function addNote() {
    setNotes((prevNotes) => [...prevNotes, { content: "" }]);
    fileRefs.current.push([]);
  }

  function removeNote(index) {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
    fileRefs.current.splice(index, 1);
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        {notes.map((note, index) => (
          <div key={index}>
            <Form.Group controlId={`content-${index}`}>
              <Form.Control
                value={note.content}
                as="textarea"
                onChange={(e) => handleContentChange(index, e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId={`file-${index}`}>
              <Form.Label className="custom">Attachments</Form.Label>
              <Form.Control
                onChange={(e) => handleFileChange(e, index)}
                type="file"
                multiple
              />
              {attachmentUrls[index] && (
                <div className="attachment-image">
                  <img src={attachmentUrls[index]} alt="Attachment" />
                </div>
              )}
            </Form.Group>
            {index !== 0 && (
              <button type="button" onClick={() => removeNote(index)}>
                Remove Note
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addNote}>
          Add Note
        </button>
        <LoaderButton
          className="create-btn"
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
