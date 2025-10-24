import { Injectable } from '@angular/core';
import { NewPost } from '../models/new-post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  createPost(post: NewPost): Observable<any> {
    return this.http.post(`${this.baseUrl}/createPost`, post);
  }
}
