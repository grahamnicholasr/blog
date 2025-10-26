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

  public createPost(post: NewPost): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/createPost`, post);
  }

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPosts`);
  }

  public filterByTitle(title: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/filterByTitle`, { params: { 'searchString': title } });
  }

  public deletePost(postId: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.baseUrl}/deletePost/${postId}`);
  }

  public updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/updatePost`, post);
  }
}
