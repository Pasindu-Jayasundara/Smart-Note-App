import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "../context/NoteContext";
import {format} from "date-fns"

function ViewNote() {

  const { noteId } = useParams();
  const { noteList, setNoteList } = useNotes();

  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {

    setLoading(true);

    const note = noteList.find((note) => note._id === noteId);
    if (!note) {
      navigate('/');
    }

    setNote(note);
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setDeleting(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNoteList(noteList.filter(note => note.id != noteId))
      
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-gray-500">Note not found.</div>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete Note"}
        </button>
      </div>

      {/* Note content */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-purple-950 mb-4 flex justify-between">
          {note.title}  <span className="text-gray-400 text-sm font-bold mb-6">{format(new Date(note.date),"yyyy-MM-dd HH:mm")}</span>
        </h1>

        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {note.note}
        </div>
      </div>
    </div>
  );
}

export default ViewNote;
