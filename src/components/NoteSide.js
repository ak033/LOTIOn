import { useState } from "react";
import uuid from "react-uuid";


import React from 'react'
import NoteMain from "./NotesMain";


function NoteSide({ notes }) {
    return (
      notes.length ? (
        <ul id="notes-list">
          {notes.map((note, index) => (
            <NoteMain note={note} index={index} key={`node-item-${index}`} />
          ))}
        </ul>
      ) : (
        <p id="empty-note">No Note Yet</p>
      )
    );
  }
  
  export default NoteSide;
  