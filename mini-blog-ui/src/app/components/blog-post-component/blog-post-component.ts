import { Component, inject, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PostDialog } from '../post-dialog/post-dialog';
import { Post } from '../../models/post';

@Component({
  selector: 'app-blog-post-component',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule,  MatIconModule, MatButtonModule],
  templateUrl: './blog-post-component.html',
  styleUrls: ['./blog-post-component.scss'],
})
export class BlogPostComponent {
  readonly dialog = inject(MatDialog);
  posts = signal<Array<Post>>([]);

  constructor() { }

  ngOnInit() {
    this.fetchPosts();
  }


  private fetchPosts() {
    // Simulate fetching posts from a service
    const dummyPosts: Array<Post> = [
      { id: 2, title: 'Second Post', content: 'This is the content of the second post.' },
      { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
    ];
    this.posts.set(dummyPosts);
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
        this.posts.set([result, ...this.posts()]);
      }
    });
  }

  public editPost(post: Post) {
    // Implement edit functionality here
      const dialogRef = this.dialog.open(PostDialog, {
      data: {
        initialValue: this.posts(),
        postToEdit: post
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.posts.set(result);
      }
    });
  }

  public deletePost(postId: number) {
    this.posts.set(this.posts().filter(post => post.id !== postId));
  }

}

