import { EVENT_TYPE } from "@enums/piano";
import {
  GLOBAL_HEADER_HEIGHT,
  PIANO_HEIGHT,
  TRACK_PLAYING_SPEED
} from "@config/piano";
import { INote } from "@typings/midi";

export type NoteWithIdAndEvent = INote & {
  event: EVENT_TYPE;
  id: Symbol;
};

export function getNotesWithNoteEndEvent(notes: INote[]): NoteWithIdAndEvent[] {
  let _notes: NoteWithIdAndEvent[] = [];

  notes.forEach(note => {
    const id = Symbol(note.name);
    const time = note.time + note.duration;
    _notes.push(
      {
        ...note,
        time: note.time,
        event: EVENT_TYPE.NOTE_START,
        id
      },
      {
        ...note,
        time,
        event: EVENT_TYPE.NOTE_STOP,
        id
      }
    );
  });

  _notes.sort((a, b) => b.time - a.time);

  _notes.find(note => note.event === EVENT_TYPE.NOTE_STOP).event =
    EVENT_TYPE.PLAYING_COMPLETE;

  return _notes;
}

export function getDelay(offset = 0) {
  return (
    (window.innerHeight - PIANO_HEIGHT - GLOBAL_HEADER_HEIGHT) /
      TRACK_PLAYING_SPEED +
    offset
  );
}
