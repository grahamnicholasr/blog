import { Component, OnInit, inject, signal, Signal } from '@angular/core';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

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
    ReactiveFormsModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './blog-post-component.html',
  styleUrls: ['./blog-post-component.scss'],
})
export class BlogPostComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  posts = signal<Array<Post>>([]);
  paginatedPosts = signal<Array<Post>>([]);
  searchTitleForm = new FormGroup({
    searchTitle: new FormControl('')
  });
  pageSize = 5;
  pageIndex = 0;
  isLoggedIn: Signal<boolean>;

  get pageSizeOptions(): number[] {
    return [5, 10, 25, 50, 100];
  }

  constructor(private blogPostService: BlogPostService, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  ngOnInit() {
    this.getPosts();
  }

  public handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedPosts();
  }

  public clearFilterByTitle() {
    this.searchTitleForm.reset();
  }

  public filterByTitle() {
    const title = this.searchTitleForm.value?.searchTitle ?? '';
    this.blogPostService.filterByTitle(title).subscribe((posts: Post[]) => {
      this.posts.set(posts);
      this.pageIndex = 0;
      this.updatePaginatedPosts();
    });
  }

  public getPosts() {
    this.blogPostService.getPosts().subscribe((posts: Post[]) => {
      this.posts.set(posts);
      this.pageIndex = 0;
      this.updatePaginatedPosts();
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
        this.posts.update(posts => {
          const postIndex = posts.findIndex(p => p.id === result.id);
          if (postIndex > -1) {
            posts[postIndex] = result;
          }
          return posts;
        });
        this.updatePaginatedPosts();
      }
    });
  }

  public deletePost(postId: number) {
    this.blogPostService.deletePost(postId).subscribe(() => {
      this.posts.set(this.posts().filter(post => post.id !== postId));
      this.updatePaginatedPosts();
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

  private updatePaginatedPosts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.posts().length) {
      this.pageIndex -= 1;
      this.updatePaginatedPosts();
    } else {
        this.paginatedPosts.set(this.posts().slice(startIndex, endIndex));

    }
  }
}
