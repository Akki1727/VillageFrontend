import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { EventsComponent } from './pages/events/events.component';
import { PoliticsComponent } from './pages/politics/politics.component';
import { AdminComponent } from './pages/admin/admin.component';
import { VideosComponent } from './pages/videos/videos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventsComponent },
  { path: 'politics', component: PoliticsComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'admin', redirectTo: 'admin/events', pathMatch: 'full' },
  { path: 'admin/events', component: AdminComponent },
  { path: 'admin/staff', component: AdminComponent },
  { path: 'admin/resolutions', component: AdminComponent },
  { path: 'admin/settings', component: AdminComponent },
  { path: 'admin/statistics', component: AdminComponent },
  { path: 'admin/home-carousel', component: AdminComponent },
  { path: 'admin/videos', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
