import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogPostComponent } from './components/blog-post-component/blog-post-component';

@Component({
  selector: 'app-root',
  imports: [BlogPostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
