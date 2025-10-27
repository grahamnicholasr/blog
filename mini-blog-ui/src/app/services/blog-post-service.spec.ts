import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BlogPostService } from './blog-post-service';
import { Post } from '../models/post';
import { NewPost } from '../models/new-post';

describe('BlogPostService', () => {
  let service: BlogPostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlogPostService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BlogPostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a post', () => {
    const newPost: NewPost = { title: 'Test Post', content: 'Test Content' };
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content' };

    service.createPost(newPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('http://localhost:8000/createPost');
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('should get posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Test Post 1', content: 'Test Content 1' },
      { id: 2, title: 'Test Post 2', content: 'Test Content 2' }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8000/getPosts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should filter posts by title', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Post', content: 'Test Content' }];
    const searchString = 'Test';

    service.filterByTitle(searchString).subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`http://localhost:8000/filterByTitle?searchString=${searchString}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should delete a post', () => {
    const postId = 1;

    service.deletePost(postId).subscribe(response => {
      expect(response.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`http://localhost:8000/deletePost/${postId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true });
  });

  it('should update a post', () => {
    const updatedPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content' };

    service.updatePost(updatedPost).subscribe(post => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne('http://localhost:8000/updatePost');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
  });
});
