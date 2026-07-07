import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorOutletComponent } from './core/errors/error-outlet/error-outlet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorOutletComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('VirtualCinema-FE');
}
