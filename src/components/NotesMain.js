import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { Link} from 'react-router-dom';

import { NavLink } from "react-router-dom";
import NewDate from "./NewDate";


function NotesMain({ note, index }) {
    const getPreview = (preview, maxLength = 130) => {
      if (preview.length > maxLength) {
        return `${preview.substring(0, maxLength)}...`;
      }
      return preview;
    };
  
    const noteId = `my-note_${index}`;
  
    return (
      <div>

        <li className="my-note" key={`my-note-${index}`}>
          <NavLink to={`/notes/${index + 1}`}>
            <h3 className="note-title">{note.title}</h3>
            <NewDate date={note.when} />
            <p
              className="note-preview"
              dangerouslySetInnerHTML={{ __html: getPreview(note.body) }}
            />
          </NavLink>
        </li>
      </div>

    );
  }
  
  export default NotesMain;
  