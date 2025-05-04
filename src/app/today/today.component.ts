import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AsteroidInterface } from '../asteroid.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-today',
  imports: [CommonModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.css'
})
export class TodayComponent {
  router = inject(Router)

  elementCount: number = 0;
  asteroids: AsteroidInterface[] = [];

  constructor(private apiService: ApiService) { }

  // faire un tri sur les asteroids
  sortBy(criteria: 'name' | 'distance' | 'velocity' | 'diameter') {
    switch (criteria) {
      case 'name':
        this.asteroids.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'distance':
        this.asteroids.sort((a, b) => a.close_approach.miss_distance.lunar - b.close_approach.miss_distance.lunar);
        break;
      case 'velocity':
        this.asteroids.sort((a, b) => a.close_approach.relative_velocity_km_s - b.close_approach.relative_velocity_km_s);
        break;
      case 'diameter':
        this.asteroids.sort((a, b) => {
          const avgA = (a.estimated_diameter_m.min + a.estimated_diameter_m.max) / 2;
          const avgB = (b.estimated_diameter_m.min + b.estimated_diameter_m.max) / 2;
          return avgA - avgB;
        });
        break;
    }
  }
  

  ngOnInit() {
    this.apiService.getTodayAsteroids().subscribe((data: any) => {
      this.elementCount = data.element_count;

      const today = new Date().toISOString().split('T')[0];
      const asteroidsData = data.near_earth_objects[today] || [];

      // On chope tous les asteroids de la journée
      // On les map pour ne garder que les données qui nous intéressent
      this.asteroids = asteroidsData.map((asteroid: any) => ({
        name: asteroid.name,
        estimated_diameter_m: {
          min: asteroid.estimated_diameter.meters.estimated_diameter_min,
          max: asteroid.estimated_diameter.meters.estimated_diameter_max
        },
        close_approach: {
          date_full: asteroid.close_approach_data[0]?.close_approach_date_full || '',
          relative_velocity_km_s: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0'),
          miss_distance: {
            lunar: parseFloat(asteroid.close_approach_data[0]?.miss_distance.lunar || '0'),
            astronomical: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical || '0')
          },
          orbiting_body: asteroid.close_approach_data[0]?.orbiting_body || ''
        }
      }));
    });
  }
}
