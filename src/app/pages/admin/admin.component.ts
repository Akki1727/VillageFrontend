import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, EventModel, CarouselSettings } from '../../services/event.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  events: EventModel[] = [];
  activeTab: 'events' | 'settings' = 'events';
  carouselSettings: CarouselSettings = { images: [], interval: 3 };
  newImageUrl: string = '';
  settingsSuccessMessage: string = '';
  settingsErrorMessage: string = '';
  selectedFileName: string = '';
  uploadProgresses: { name: string; progress: number }[] = [];
  
  // Auth State
  isLoggedIn = false;
  loginUsername = '';
  loginPassword = '';
  loginError = '';

  // Form State
  isFormOpen = false;
  isEditing = false;
  editingId?: number;

  formModel: EventModel = this.getEmptyFormModel();

  constructor(
    private eventService: EventService,
    private langService: LanguageService
  ) {}

  ngOnInit() {
    this.eventService.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
      if (state) {
        this.loadEvents();
        this.loadCarouselSettings();
      }
    });
  }

  loadCarouselSettings() {
    this.eventService.getCarouselSettings().subscribe(settings => {
      this.carouselSettings = { ...settings };
    });
  }

  addCarouselImage() {
    if (!this.newImageUrl) return;
    if (!this.newImageUrl.startsWith('http://') && !this.newImageUrl.startsWith('https://')) {
      this.eventService.showConfirm({
        title: 'Invalid URL',
        message: 'Please enter a valid image URL starting with http:// or https://',
        confirmBtnText: 'OK',
        cancelBtnText: 'none',
        onConfirm: () => {}
      });
      return;
    }
    if (!this.carouselSettings.images) {
      this.carouselSettings.images = [];
    }
    this.carouselSettings.images.push(this.newImageUrl);
    this.newImageUrl = '';
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFileName = files.length === 1 ? files[0].name : `${files.length} files selected`;
      
      // Initialize progresses list
      this.uploadProgresses = [];
      let loadedCount = 0;
      
      if (!this.carouselSettings.images) {
        this.carouselSettings.images = [];
      }

      // First pass: Validate files and add them to active progresses list
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.eventService.showConfirm({
            title: 'Unsupported File Type',
            message: `The file "${file.name}" is not a supported image. Only image files are permitted.`,
            confirmBtnText: 'OK',
            cancelBtnText: 'none',
            onConfirm: () => {}
          });
          continue;
        }
        validFiles.push(file);
        this.uploadProgresses.push({ name: file.name, progress: 0 });
      }

      if (validFiles.length === 0) {
        this.selectedFileName = '';
        return;
      }

      this.selectedFileName = validFiles.length === 1 ? validFiles[0].name : `${validFiles.length} files loading`;

      // Second pass: Read files in parallel and track progress
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const reader = new FileReader();
        
        reader.onprogress = (e: ProgressEvent<FileReader>) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            const idx = this.uploadProgresses.findIndex(p => p.name === file.name);
            if (idx !== -1) {
              this.uploadProgresses[idx].progress = pct;
            }
          }
        };

        reader.onload = (e: any) => {
          const base64Str = e.target.result;
          this.carouselSettings.images.push(base64Str);
          
          // Complete progress
          const idx = this.uploadProgresses.findIndex(p => p.name === file.name);
          if (idx !== -1) {
            this.uploadProgresses[idx].progress = 100;
          }

          loadedCount++;
          
          // Reset when all files are complete
          if (loadedCount === validFiles.length) {
            this.selectedFileName = '';
            setTimeout(() => {
              this.uploadProgresses = [];
            }, 1500); // Wait 1.5s so the user sees the completed state
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  deleteCarouselImage(index: number) {
    this.eventService.showConfirm({
      title: 'Remove Image',
      message: 'Are you sure you want to remove this image from the carousel?',
      confirmBtnText: 'Remove',
      onConfirm: () => {
        this.carouselSettings.images.splice(index, 1);
      }
    });
  }

  saveCarouselSettings() {
    if (this.carouselSettings.interval < 1) {
      this.eventService.showConfirm({
        title: 'Invalid Interval',
        message: 'Interval must be at least 1 second.',
        confirmBtnText: 'OK',
        cancelBtnText: 'none',
        onConfirm: () => {}
      });
      return;
    }
    this.eventService.saveCarouselSettings(this.carouselSettings).subscribe({
      next: () => {
        this.settingsSuccessMessage = 'Carousel settings saved successfully!';
        setTimeout(() => this.settingsSuccessMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.settingsErrorMessage = 'Failed to save settings!';
        setTimeout(() => this.settingsErrorMessage = '', 3000);
      }
    });
  }

  login() {
    this.eventService.login({ email: this.loginUsername, password: this.loginPassword }).subscribe({
      next: (res) => {
        this.eventService.setLoginState(true);
        this.loginError = '';
      },
      error: (err) => {
        this.loginError = err.error?.message || 'Invalid email or password!';
        this.loginPassword = '';
      }
    });
  }

  logout() {
    this.eventService.setLoginState(false);
    this.loginUsername = '';
    this.loginPassword = '';
  }

  // Events CRUD Logic
  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  getEmptyFormModel(): EventModel {
    return {
      title_en: '',
      title_gu: '',
      title_hi: '',
      description_en: '',
      description_gu: '',
      description_hi: '',
      location_en: '',
      location_gu: '',
      location_hi: '',
      event_date: '',
      event_time: '',
      status: 'active'
    };
  }

  openAddForm() {
    this.formModel = this.getEmptyFormModel();
    this.isEditing = false;
    this.isFormOpen = true;
  }

  openEditForm(event: EventModel) {
    this.formModel = { ...event };
    this.editingId = event.id;
    this.isEditing = true;
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }

  saveEvent() {
    // Automatically copy English content to Gujarati and Hindi to keep events dynamic
    this.formModel.title_gu = this.formModel.title_en;
    this.formModel.title_hi = this.formModel.title_en;
    this.formModel.description_gu = this.formModel.description_en;
    this.formModel.description_hi = this.formModel.description_en;
    this.formModel.location_gu = this.formModel.location_en;
    this.formModel.location_hi = this.formModel.location_en;

    if (this.isEditing && this.editingId !== undefined) {
      this.eventService.updateEvent(this.formModel).subscribe(() => {
        this.loadEvents();
        this.closeForm();
      });
    } else {
      this.eventService.createEvent(this.formModel).subscribe(() => {
        this.loadEvents();
        this.closeForm();
      });
    }
  }

  deleteEvent(id: number | undefined) {
    if (!id) return;
    this.eventService.showConfirm({
      title: 'Delete Event',
      message: this.t('confirm_delete') || 'Are you sure you want to delete this event?',
      confirmBtnText: 'Delete',
      onConfirm: () => {
        this.eventService.deleteEvent(id).subscribe(() => {
          this.loadEvents();
        });
      }
    });
  }

  toggleStatus(event: EventModel) {
    const newStatus = event.status === 'inactive' ? 'active' : 'inactive';
    const updated = { ...event, status: newStatus };
    this.eventService.updateEvent(updated).subscribe(() => {
      this.loadEvents();
    });
  }

  t(key: string): string {
    return this.langService.t(key);
  }

  get currentLang() {
    return this.langService.getLanguage();
  }
}
