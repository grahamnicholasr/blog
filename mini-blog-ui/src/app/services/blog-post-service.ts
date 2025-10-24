import { Injectable } from '@angular/core';
import { NewPost } from '../models/new-post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  public createPost(post: NewPost): Observable<any> {
    return this.http.post(`${this.baseUrl}/createPost`, post);
  }

  public getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getPosts`);
  }

  public deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletePost/${postId}`);
  }

  public updatePost(post: Post): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatePost`, post);
  }
}
