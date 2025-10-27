import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDialog } from './post-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BlogPostService } from '../../services/blog-post-service';
import { Post } from '../../models/post';
import { NewPost } from '../../models/new-post';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockBlogPostService {
  createPost(post: NewPost) {
    const newPost: Post = { id: 3, ...post };
    return of(newPost);
  }
  updatePost(post: Post) {
    return of(post);
  }
}

describe('PostDialog', () => {
  let component: PostDialog;
  let fixture: ComponentFixture<PostDialog>;
  let mockDialogRef: MatDialogRef<PostDialog>;

  describe('Create Mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PostDialog, MatDialogModule, NoopAnimationsModule],
        providers: [
          provideZonelessChangeDetection(),
          { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
          { provide: MAT_DIALOG_DATA, useValue: null },
          provideHttpClient(),
          { provide: BlogPostService, useClass: MockBlogPostService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PostDialog);
      component = fixture.componentInstance;
      mockDialogRef = TestBed.inject(MatDialogRef);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit a new post', () => {
      component.postForm.setValue({ title: 'New Post', content: 'New Content' });
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({ id: 3, title: 'New Post', content: 'New Content' });
    });

    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content' };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PostDialog, MatDialogModule, NoopAnimationsModule],
        providers: [
          provideZonelessChangeDetection(),
          { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
          { provide: MAT_DIALOG_DATA, useValue: { postToEdit: mockPost } },
          provideHttpClient(),
          { provide: BlogPostService, useClass: MockBlogPostService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PostDialog);
      component = fixture.componentInstance;
      mockDialogRef = TestBed.inject(MatDialogRef);
      fixture.detectChanges();
    });

    it('should populate form in edit mode', () => {
      expect(component.postForm.value.title).toEqual(mockPost.title);
      expect(component.postForm.value.content).toEqual(mockPost.content);
    });

    it('should submit an edited post', () => {
      component.postForm.setValue({ title: 'Updated Post', content: 'Updated Content' });
      component.onEdit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({ id: 1, title: 'Updated Post', content: 'Updated Content' });
    });
  });

  it('should close the dialog', () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    TestBed.configureTestingModule({
      imports: [PostDialog, MatDialogModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    const fixture = TestBed.createComponent(PostDialog);
    const component = fixture.componentInstance;
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
