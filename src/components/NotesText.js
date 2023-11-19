import { useEffect, useState } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import NoteEmpty from "./NoteEmpty";
import NewDate from "./NewDate";
import "react-quill/dist/quill.snow.css";

function NoteText({ edit }) {
  let { noteId } = useParams();


  const currentDate = () => {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toJSON()
      .substring(0, 19);
  };

  
  noteId -= 1;
  const [notes, updateNote, deleteNote] = useOutletContext();
  let currentNote = { title: "", body: "", when: "" };
  if (noteId >= 0 && notes.length > noteId) {
    currentNote = notes[noteId];
  }
  const [noteBody, setNoteBody] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteWhen, setNoteWhen] = useState();
  const [id, setId] = useState("");

  useEffect(() => {
    setNoteBody(currentNote.body);
    setNoteTitle(currentNote.title);
    if (currentNote.when) {
      setNoteWhen(currentNote.when);
    } else {
      setNoteWhen(currentDate());
    }
    setId(currentNote.id);
  }, [currentNote]);

  const save = () => {
    updateNote(
      {
        body: noteBody,
        title: noteTitle,
        when: noteWhen,
        id: id,
      },
      noteId
    );
  };

  const tryDelete = () => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      deleteNote(noteId);
    }
  };

  return id ? (
    <>
      <div id="text-header">

      <div id="note-description">
        {edit ? (
            <>

            <input
                className="main-title"
                value={noteTitle}
                onChange={(event) => setNoteTitle(event.target.value)}
                autoFocus
            />

            <input
                type="main-date"
                value={noteWhen ? noteWhen : currentDate()}
                onChange={(event) => setNoteWhen(event.target.value)}
            />

            </>
        ) : (
            <>
            <h2 className="main-title">{noteTitle}</h2>
            <NewDate date={noteWhen} />
            </>
        )}
     </div>


        <div id="note-buttons">
          {!edit ? (
            <>
              <Link
                className="button"
                id="edit-button"
                to={`/notes/${noteId + 1}/edit`}
              >
                Edit
              </Link>
              <Link
                className="button"
                id="delete-button"
                to=""
                onClick={tryDelete}
              >
                Delete
              </Link>
            </>
          ) : (
            <>
              <Link className="button" id="save-button" to="" onClick={save}>
                Save
              </Link>
              <Link
                className="button"
                id="delete-button"
                to=""
                onClick={tryDelete}
              >
                Delete
              </Link>
            </>
          )}
        </div>
      </div>



      {!edit ? (
        <div id="notes-main" dangerouslySetInnerHTML={{ __html: noteBody }} />
      ) : (
        <ReactQuill
          placeholder="Type Notes Here"
          theme="snow"
          value={noteBody}
          onChange={setNoteBody}
        />
      )}
    </>
  ) : (
    <NoteEmpty />
  );
}

export default NoteText;
