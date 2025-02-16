import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./editorpage.css"; 


const socket = io(process.env.REACT_APP_API_URL);

export default function EditorPage() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState("");

  // Fetch document content
  useEffect(() => {
    const fetchDoc = async () => {
       try {
         const res = await axios.get(
           `${process.env.REACT_APP_API_URL}/api/docs/${id}`
         );
         setContent(res.data.content);
         setLoading(false);
       } catch (error) {
         console.error("Error fetching document:", error);
       } finally {
         setLoading(false);
       }
    };

    fetchDoc();
    socket.emit("join-document", id);

    socket.on("received-changes", (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.off("received-changes");
    };
  }, [id]);

  // Handle text changes & emit updates
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit("text-change", { docId: id, content: newContent });
  };

  // Auto-save every 5 seconds
  useEffect(() => {
    const autoSave = setInterval(async () => {
      try {
        axios.patch(`${process.env.REACT_APP_API_URL}/api/docs/${id}`, {
          content,
        });
        setLastSaved(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 5000);

    return () => clearInterval(autoSave);
  }, [content, id]);

  return (
    <div className="editor-container">
      <header className="editor-header">
        <h1 className="doc-title"> Type YOUR thoughts to make Reality !!</h1>
        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          📋 Copy Link
        </button>
      </header>

      <div className="editor-content">
        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner"></span> Loading document...
          </div>
        ) : (
          <textarea
            className="collab-textarea"
            value={content}
            onChange={handleChange}
            placeholder="Start collaborating..."
          />
        )}
      </div>

      <div className="status-bar">
        <span className="text-secondary">
          {lastSaved && `Last saved: ${lastSaved}`}
        </span>
        <span className="connection-status">
          {loading ? "🟡 Connecting..." : "🟢 Live"}
        </span>
      </div>
    </div>
  );
}
