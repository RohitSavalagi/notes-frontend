import { signalStore, type, withMethods, withProps, withState } from "@ngrx/signals";
import { withDevtools, withResource } from "@angular-architects/ngrx-toolkit";
import { NotesService } from "./notes.service";
import { inject } from "@angular/core";
import { Note, NoteCreate, NoteUpdate } from "./note.model";
import { eventGroup, withReducer, on, withEventHandlers, Events } from "@ngrx/signals/events";
import { switchMap } from "rxjs";
import { mapResponse } from '@ngrx/operators';

export interface NoteState {
  notes: Note[],
  isLoading: boolean,
  error: null | string,
}

export const NotesEvents = eventGroup({
  source: 'Notes Store',
  events: {
    createNoteTrigger: type<NoteCreate>(),
    createNoteSuccessful: type<Partial<NoteState>>(),
    createNoteFailed: type<{ error: string }>(),
    updateNoteTrigger: type<NoteUpdate>(),
    updateNoteSuccessful: type<Partial<NoteState>>(),
    updateNoteFailed: type<{ error: string }>(),
    deleteNoteTrigger: type<number>(),
    deleteNoteSuccessful: type<{ notes: Note[] }>(),
    deleteNoteFail: type<{ error: string }>(),
  }
});

export const NotesStore = signalStore(
  { providedIn: 'root' },

  withDevtools('Notes Store'),

  withState<NoteState>({
    notes: [],
    isLoading: false,
    error: null as string | null
  }),

  withProps(() => ({
    _notesService: inject(NotesService),
    _events: inject(Events)
  })),

  withResource((store) => ({
    notes: store._notesService.getNotes(),
  }), { errorHandling: 'previous value' }),

  withReducer(
    on(NotesEvents.createNoteTrigger, () => ({
      isLoading: true,
      error: null,
    })),
    on(NotesEvents.createNoteSuccessful, ({ payload }) => ({
      notesValue: payload.notes,
      isLoading: false,
    })),
    on(NotesEvents.createNoteFailed, ({ payload }) => ({
      isLoading: false,
      error: payload.error
    })),
    on(NotesEvents.updateNoteTrigger, () => ({
      isLoading: true,
      error: null,
    })),
    on(NotesEvents.updateNoteSuccessful, ({ payload }) => ({
      isLoading: false,
      notesValue: payload.notes,
    })),
    on(NotesEvents.updateNoteFailed, ({ payload }) => ({
      isLoading: false,
      error: payload.error
    })),

    on(NotesEvents.deleteNoteTrigger, () => ({
      isLoading: true,
      error: null,
    })),
    on(NotesEvents.deleteNoteSuccessful, ({ payload }) => ({
      isLoading: false,
      notesValue: payload.notes,
    })),
    on(NotesEvents.deleteNoteFail, ({ payload }) => ({
      isLoading: false,
      error: payload.error
    }))
  ),

  // Event Handlers
  withEventHandlers((store) => ({
    createNote$: store._events.on(NotesEvents.createNoteTrigger).pipe(
      switchMap(({ payload }) =>
        store._notesService.createNote(payload).pipe(
          mapResponse({
            next: (note: Note) => NotesEvents.createNoteSuccessful({ notes: [...store.notesValue(), note] }),
            error: (error: unknown) => NotesEvents.createNoteFailed({ error: String(error) }),
          })
        )
    )),

    updateNote$: store._events.on(NotesEvents.updateNoteTrigger).pipe(
      switchMap(({ payload }) =>
        store._notesService.updateNote(payload).pipe(
          mapResponse({
            next: (note: Note) => {
              const updatedNote = note;
              const updatedNotes = store.notesValue().map(i => {
                if (note.id === i.id) return note;
                return i;
              });
              console.log(updatedNotes);
              return NotesEvents.updateNoteSuccessful({ notes: updatedNotes })
            },
            error: (error: unknown) => NotesEvents.createNoteFailed({ error: String(error) }),
          })
        )
    )),

    deleteNote$: store._events.on(NotesEvents.deleteNoteTrigger).pipe(
      switchMap(({ payload }) =>
        store._notesService.deleteNote(payload).pipe(
          mapResponse({
            next: () => {
              const notesValue = [...store.notesValue().filter((note) => note.id !== payload)];
              return NotesEvents.deleteNoteSuccessful({ notes: notesValue });
            },
            error: (error: unknown) => NotesEvents.deleteNoteFail({ error: String(error) }),
          })
        )
    )),
  })),
);
