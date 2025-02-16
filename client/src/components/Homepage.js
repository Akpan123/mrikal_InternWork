import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./HomePage.css";

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  // }, [theme]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/docs`
        );
        setDocuments(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const createNewDoc = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/docs`
        );
        navigate(`/docs/${res.data._id}`);
      } catch (error) {
        console.error("Error creating document:", error);
      }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">CollabDocs</h1>
        <button className="create-btn" onClick={createNewDoc}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
          >
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New Document
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="document-card"
              onClick={() => navigate(`/docs/${doc._id}`)}
            >
              <h3 className="doc-id">{doc._id}</h3>
              <p className="doc-date">
                Created: {format(new Date(doc.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
              <div className="doc-content-preview">
                {doc.content.substring(0, 100) || "Empty document..."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
