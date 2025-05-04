import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , HeaderComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AsteroidTracker';
  apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getTodayAsteroids().subscribe(data => {
      console.log(data);
    });
  }
}
