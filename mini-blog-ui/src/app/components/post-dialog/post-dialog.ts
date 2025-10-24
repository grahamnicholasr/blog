import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Post } from '../../models/post';
import { NewPost } from '../../models/new-post';
import { BlogPostService } from '../../services/blog-post-service';

@Component({
  selector: 'app-post-dialog',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions],
  templateUrl: './post-dialog.html',
  styleUrl: './post-dialog.scss',
})
export class PostDialog {
  data = inject(MAT_DIALOG_DATA);
  postForm = new FormGroup({
    title: new FormControl(this.data?.postToEdit?.title ?? '', Validators.required),
    content: new FormControl(this.data?.postToEdit?.content ?? '', Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<PostDialog>,
    private blogPostService: BlogPostService
  ) {

  }

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: NewPost = {
        title: this.postForm.value.title,
        content: this.postForm.value.content
      }

      this.blogPostService.createPost(newPost).subscribe(returnedPost => {
        this.dialogRef.close(returnedPost);
      });
    }

  }

  onEdit() {
    if (this.postForm.valid) {
      const postToEdit: Post = this.data?.postToEdit;
      postToEdit.title = this.postForm.value.title;
      postToEdit.content = this.postForm.value.content;

      this.blogPostService.updatePost(postToEdit).subscribe(updated => {
        this.dialogRef.close(updated);
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
