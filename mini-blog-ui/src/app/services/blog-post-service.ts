import { Injectable } from '@angular/core';
import { NewPost } from '../models/new-post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { 'Authorization': string } {
    const token = this.authService.getAuthorizationToken();
    return { 'Authorization': `Bearer ${token}` };
  }

  public createPost(post: NewPost): Observable<Post> {
    const headers = this.getHeaders();
    return this.http.post<Post>(`${this.baseUrl}/createPost`, post, { headers });
  }

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPosts`);
  }

  public filterByTitle(title: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/filterByTitle`, { params: { 'searchString': title } });
  }

  public deletePost(postId: number): Observable<{ ok: boolean }> {
    const headers = this.getHeaders();
    return this.http.delete<{ ok: boolean }>(`${this.baseUrl}/deletePost/${postId}`, { headers });
  }

  public updatePost(post: Post): Observable<Post> {
    const headers = this.getHeaders();
    return this.http.put<Post>(`${this.baseUrl}/updatePost`, post, { headers });
  }
}
