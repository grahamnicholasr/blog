import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostDialog } from '../post-dialog/post-dialog';
import { Post } from '../../models/post';
import { BlogPostService } from '../../services/blog-post-service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-blog-post-component',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule],
  templateUrl: './blog-post-component.html',
  styleUrls: ['./blog-post-component.scss'],
})
export class BlogPostComponent {
  readonly dialog = inject(MatDialog);
  posts = signal<Array<Post>>([]);
  searchTitleForm = new FormGroup({
    searchTitle: new FormControl('')
  });

  constructor(private blogPostService: BlogPostService) { }

  ngOnInit() {
    this.getPosts();
  }

  public clearSearch() {
    this.searchTitleForm.reset();
  }

  public searchByTitle() {
    const title = this.searchTitleForm.value?.searchTitle ?? '';
    this.blogPostService.searchByTitle(title).subscribe((posts: Post[]) => {
      this.posts.set(posts);
    });
  }

  public getPosts() {
    this.blogPostService.getPosts().subscribe((posts: Post[]) => {
      this.posts.set(posts);
      this.clearSearch();
    });  
  }

  public openDialog() {
    const dialogRef = this.dialog.open(PostDialog, {
      data: {
        initialValue: this.posts()
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.getPosts()
      }
    });
  }

  public editPost(post: Post) {
      const dialogRef = this.dialog.open(PostDialog, {
      data: {
        initialValue: this.posts(),
        postToEdit: post
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.getPosts()
      }
    });
  }

  public deletePost(postId: number) {
    this.blogPostService.deletePost(postId).subscribe(() => {
      this.posts.set(this.posts().filter(post => post.id !== postId));
    });
  }

  public isContentExpanded(postId: number): boolean {
    if(document.getElementById(`cart-content-${postId}`)?.classList.contains('truncated-content')) {
      return false;
    } else {
      return true;
    }
  }

  public toggleContent(postId: number): void {
    const contentElement = document.getElementById(`cart-content-${postId}`);
    if (contentElement?.classList.contains('truncated-content')) {
      contentElement?.classList.remove('truncated-content');
      contentElement?.classList.add('untruncated-content');
    } else {
      contentElement?.classList.add('truncated-content');
      contentElement?.classList.remove('untruncated-content'); 
    }
  }
}