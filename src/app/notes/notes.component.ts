import { Component, inject, Signal, signal } from '@angular/core';
import { Note, NoteCreate } from './note.model';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { NoteCardComponent } from './note-card/note-card.component';
import { NotesEvents, NotesStore } from './notes.store';
import { Dispatcher } from '@ngrx/signals/events';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-notes',
  imports: [
    FormField,
    FormRoot,
    NoteCardComponent,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent {
  private readonly notesStore = inject(NotesStore);
  private readonly dispatcher = inject(Dispatcher);

  protected readonly notesS: Signal<Note[]> = this.notesStore.notesValue;
  protected readonly notesIsLoading: Signal<boolean> = this.notesStore.notesIsLoading;
  protected readonly updateMode = signal(false);
  protected readonly updateId = signal(-1);

  protected readonly noteModel = signal<NoteCreate>({
    title: '',
    context: '',
  });

  protected readonly form = form<NoteCreate>(
    this.noteModel,
    (path) => {
      (required(path.title), minLength(path.title, 3), minLength(path.context, 3));
    },
    {
      submission: {
        action: async () => {
          if (this.updateMode()) {
            this.updateNote();
          } else {
            this.onSubmit();
          }
        },
        onInvalid: (field) => {
          const firstError = field().errorSummary()[0];
          firstError?.fieldTree()?.focusBoundControl();
        },
      },
    },
  );

  protected onSubmit(): void {
    this.dispatcher.dispatch(NotesEvents.createNoteTrigger(this.form().value()));
    this.form().reset({
      context: '',
      title: '',
    });
  }

  handleDelete(id: number): void {
    this.dispatcher.dispatch(NotesEvents.deleteNoteTrigger(id));
  }

  handleUpdate(note: Note): void {
    this.updateId.set(note.id);
    this.form().reset({
      context: note.context,
      title: note.title
    });
    this.updateMode.set(true);
  }

  onUpdateReset(): void {
    this.form().reset({
      context: '',
      title: '',
    });

    this.updateMode.set(false);
  }

  updateNote(): void {
    const updateNote = {
      ...this.form().value(),
      id: this.updateId(),
    }
    this.dispatcher.dispatch(NotesEvents.updateNoteTrigger(updateNote));
    this.form().reset({
      context: '',
      title: '',
    });
    this.updateMode.set(false);
  }
}
