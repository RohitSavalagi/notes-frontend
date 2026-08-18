import { Component, input, output } from '@angular/core';
import { Note } from '../note.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-note-card',
  imports: [MatIconButton, MatIcon],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',
})
export class NoteCardComponent {
  public readonly note = input.required<Note>();

  protected readonly delete = output<number>();

  protected readonly update = output<Note>({});

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onEdit(note: Note): void {
    this.update.emit(note)
  }
}
