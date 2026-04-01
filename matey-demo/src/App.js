import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const notesData = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setNotes(notesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (newNote.trim() === "") return;
    await addDoc(collection(db, "notes"), {
      text: newNote,
      createdAt: serverTimestamp(),
    });
    setNewNote("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addNote();
  };

  const colors = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #43e97b, #38f9d7)",
    "linear-gradient(135deg, #fa709a, #fee140)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "0 0 60px 0",
    }}>

      {/* NAVBAR */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>📝</div>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "1.2rem" }}>NoteVault</span>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "6px 16px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.8rem",
        }}>
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "50px 20px 40px" }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          borderRadius: "50px",
          padding: "6px 18px",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: "600",
          letterSpacing: "1px",
          marginBottom: "16px",
          textTransform: "uppercase",
        }}>
          ✨ Your Personal Space
        </div>
        <h1 style={{
          background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "3rem",
          fontWeight: "800",
          margin: "0 0 12px",
          lineHeight: 1.2,
        }}>
          My Notes
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "1rem",
          margin: 0,
        }}>
          Capture your thoughts, ideas, and everything in between.
        </p>
      </div>

      {/* INPUT CARD */}
      <div style={{
        maxWidth: "680px",
        margin: "0 auto 50px",
        padding: "0 20px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "20px" }}>✏️</span>
          <input
            type="text"
            placeholder="Write something amazing..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "1rem",
              caretColor: "#a78bfa",
            }}
          />
          <button
            onClick={addNote}
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            + Add Note
          </button>
        </div>
      </div>

      {/* NOTES GRID */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "1.1rem" }}>No notes yet. Start writing!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {notes.map((note, index) => (
              <div
                key={note.id}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  transition: "transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* COLOR BAR */}
                <div style={{
                  height: "4px",
                  borderRadius: "4px",
                  background: colors[index % colors.length],
                }} />

                {/* NOTE TEXT */}
                <p style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: "500",
                  lineHeight: "1.6",
                  margin: 0,
                  wordBreak: "break-word",
                }}>
                  {note.text}
                </p>

                {/* FOOTER */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}>
                  <span style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.75rem",
                  }}>
                    🕒 {note.createdAt?.toDate().toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "8px",
                      padding: "5px 14px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.3)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;