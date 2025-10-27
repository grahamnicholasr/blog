import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostComponent } from './blog-post-component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { BlogPostService } from '../../services/blog-post-service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Post } from '../../models/post';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockBlogPostService {
  getPosts() {
    const posts: Post[] = [
      { id: 1, title: 'Test Post 1', content: 'Test Content 1' },
      { id: 2, title: 'Test Post 2', content: 'Test Content 2' },
    ];
    return of(posts);
  }

  filterByTitle(title: string) {
    const posts: Post[] = [{ id: 1, title: 'Test Post 1', content: 'Test Content 1' }];
    return of(posts);
  }

  deletePost(postId: number) {
    return of({ ok: true });
  }
}

class MockAuthService {
  isLoggedIn = signal(true);
  getAuthorizationToken() {
    return 'test-token';
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComponent, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: BlogPostService, useClass: MockBlogPostService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get posts on init', () => {
    expect(component.posts().length).toBe(2);
    expect(component.paginatedPosts().length).toBe(2);
  });

  it('should handle page events', () => {
    component.pageSize = 1;
    component.handlePageEvent({ pageIndex: 1, pageSize: 1, length: 2 });
    fixture.detectChanges();

    expect(component.pageIndex).toBe(1);
    expect(component.paginatedPosts().length).toBe(1);
    expect(component.paginatedPosts()[0].id).toBe(2);
  });

  it('should filter posts by title', () => {
    component.searchTitleForm.setValue({ searchTitle: 'Test' });
    component.filterByTitle();
    fixture.detectChanges();

    expect(component.posts().length).toBe(1);
  });

  it('should clear filter by title', () => {
    component.searchTitleForm.setValue({ searchTitle: 'Test' });
    component.clearFilterByTitle();
    expect(component.searchTitleForm.value.searchTitle).toBeNull();
  });

  it('should open dialog to create a post', () => {
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.openDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should open dialog to edit a post', () => {
    const post: Post = { id: 1, title: 'Test Post 1', content: 'Test Content 1' };
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.editPost(post);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should delete a post', () => {
    component.deletePost(1);
    fixture.detectChanges();
    expect(component.posts().length).toBe(1);
  });
});
