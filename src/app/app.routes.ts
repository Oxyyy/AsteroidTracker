import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodayComponent } from './today/today.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path : 'home', component: HomeComponent },
    { path : 'today', component: TodayComponent },
    { path : 'about', component: AboutComponent },
    // { path : '**', redirectTo: '/home' } // Wildcard route for a 404 page
];
