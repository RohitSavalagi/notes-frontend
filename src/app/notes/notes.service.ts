import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Note, NoteCreate, NoteUpdate } from './note.model';

@Service()
export class NotesService {
  private readonly url = 'http://localhost:3000/notes';
  private readonly http = inject(HttpClient);

  public getNotes(): HttpResourceRef<Note[]> {
    return httpResource(() => ({
      url: this.url,
      method: 'GET',
    }), { defaultValue: [] });
  }

  public createNote(note: NoteCreate): Observable<Note> {
    return this.http.post<Note>(this.url, note);
  }

  public updateNote(note: NoteUpdate): Observable<Note> {
    return this.http.put<Note>(`${this.url}/${note.id}`, note);
  }

  public deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
