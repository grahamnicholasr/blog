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
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Post } from '../../models/post';

@Component({
  selector: 'app-post-dialog',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './post-dialog.html',
  styleUrl: './post-dialog.scss',
})
export class PostDialog {
  data = inject(MAT_DIALOG_DATA);
  postForm = new FormGroup({
    title: new FormControl(this.data?.postToEdit?.title ?? ''),
    content: new FormControl(this.data?.postToEdit?.content ?? ''),
  });

  constructor(public dialogRef: MatDialogRef<PostDialog>) {

  }

  onSubmit() {
    const newPost: Post = {
      id: Date.now(),
      title: this.postForm.value.title,
      content: this.postForm.value.content
    }


    this.dialogRef.close(newPost);
  }

  onEdit() {
    const editedTitle = this.postForm.value.title ?? '';
    const editedContent = this.postForm.value.content ?? '';
    const postToEdit: Post | undefined = this.data?.postToEdit;

    if (!postToEdit) {
      this.dialogRef.close(this.data.initialValue);
      return;
    }

    const updated = (this.data.initialValue || []).map((p: Post) =>
      p.id === postToEdit.id ? { ...p, title: editedTitle, content: editedContent } : p
    );

    this.data.initialValue = updated;
    this.dialogRef.close(updated);
  }

  onClose() {
    this.dialogRef.close();
  }

}
