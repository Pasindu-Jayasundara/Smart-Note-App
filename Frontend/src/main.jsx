import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./screens/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import NewNote from "./screens/NewNote";
import ViewNote from "./screens/ViewNote";
import { NoteProvider } from "./context/NoteContext";

createRoot(document.getElementById("root")).render(
  
  <NoteProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="new-note" element={<NewNote />} />
        <Route path="view-note/:noteId" element={<ViewNote />} />
      </Routes>
    </BrowserRouter>
  </NoteProvider>
);
