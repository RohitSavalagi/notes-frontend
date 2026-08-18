export interface Note {
  id: number;
  title: string;
  context: string;
  createdAt: Date;
  updateAt: Date;
}

export type NoteCreate = Pick<Note, 'title' | 'context'>;
export type NoteUpdate = Pick<Note, 'title' | 'context' | 'id'>;
