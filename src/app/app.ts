import { Component, inject } from '@angular/core';
import { AppService } from './app.service';
import { AsyncPipe } from '@angular/common';
import { NotesComponent } from "./notes/notes.component";
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    AsyncPipe,
    NotesComponent,
  ],
})
export class App {
  protected readonly appService = inject(AppService);

  protected readonly title$ = this.appService.getTitle;
}
