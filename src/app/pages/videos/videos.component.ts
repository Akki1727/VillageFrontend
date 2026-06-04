import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService, VideoModel } from '../../services/event.service';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent implements OnInit {
  videos: VideoModel[] = [];
  isLoading = true;
  errorMessage = '';

  selectedVideo: VideoModel | null = null;

  constructor(
    private eventService: EventService,
    private langService: LanguageService
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.isLoading = true;
    this.eventService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching videos:', err);
        this.errorMessage = 'Could not load videos. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  openVideoModal(video: VideoModel) {
    this.selectedVideo = video;
    this.eventService.toggleBodyScroll(true);
  }

  closeVideoModal() {
    this.selectedVideo = null;
    this.eventService.toggleBodyScroll(false);
  }

  getFullUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Convert relative path '/uploads/...' using environment apiUrl
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
