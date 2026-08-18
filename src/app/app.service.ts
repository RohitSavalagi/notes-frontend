import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class AppService {
  private readonly url = 'http://localhost:3000/';
  private http = inject(HttpClient);

  public readonly getTitle: Observable<HttpResponse<string>> = this.http.get(this.url, {
    observe: 'response',
    responseType: 'text',
  });
}
