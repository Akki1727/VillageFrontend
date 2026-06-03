import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, EventModel, CarouselSettings, StaffModel, ResolutionModel, StatisticModel } from '../../services/event.service';
import { LanguageService } from '../../services/language.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  events: EventModel[] = [];
  staff: StaffModel[] = [];
  resolutions: ResolutionModel[] = [];
  statistics: StatisticModel[] = [];
  activeTab: 'events' | 'staff' | 'resolutions' | 'settings' | 'statistics' | 'home-carousel' = 'events';
  homeCarouselSettings: CarouselSettings = { images: [], interval: 5 };
  newHomeImageUrl: string = '';
  homeSettingsSuccessMessage: string = '';
  homeSettingsErrorMessage: string = '';
  selectedHomeFileName: string = '';
  homeUploadProgresses: { name: string; progress: number }[] = [];
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
  isSavingEvent = false;

  formModel: EventModel = this.getEmptyFormModel();

  // Staff Form State
  isStaffFormOpen = false;
  isEditingStaff = false;
  editingStaffId?: number;
  isSavingStaff = false;
  staffFormModel: StaffModel = this.getEmptyStaffFormModel();
  selectedStaffFileName: string = '';
  staffUploadProgress = 0;

  // Resolutions Form State
  isResFormOpen = false;
  isEditingRes = false;
  editingResId?: number;
  isSavingRes = false;
  resFormModel: ResolutionModel = this.getEmptyResFormModel();

  // Statistics Form State
  isStatsFormOpen = false;
  isEditingStats = false;
  editingStatsId?: number;
  isSavingStats = false;
  statsFormModel: StatisticModel = this.getEmptyStatsFormModel();

  constructor(
    private eventService: EventService,
    private langService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventService.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
      if (state) {
        this.loadEvents();
        this.loadCarouselSettings();
        this.loadStaff();
        this.loadResolutions();
        this.loadStatistics();
        this.loadHomeCarouselSettings();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveTabFromRoute();
    });
    this.updateActiveTabFromRoute();
  }

  updateActiveTabFromRoute() {
    const url = this.router.url;
    if (url.includes('/admin/staff')) {
      this.activeTab = 'staff';
    } else if (url.includes('/admin/resolutions')) {
      this.activeTab = 'resolutions';
    } else if (url.includes('/admin/settings')) {
      this.activeTab = 'settings';
    } else if (url.includes('/admin/statistics')) {
      this.activeTab = 'statistics';
    } else if (url.includes('/admin/home-carousel')) {
      this.activeTab = 'home-carousel';
    } else {
      this.activeTab = 'events';
    }
  }

  navigateToTab(tab: 'events' | 'staff' | 'resolutions' | 'settings' | 'statistics' | 'home-carousel') {
    this.router.navigate(['/admin', tab]);
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

  compressImage(base64Str: string, maxWidth = 1280, maxHeight = 720, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
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
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          this.eventService.showConfirm({
            title: 'File Too Large',
            message: `The file "${file.name}" exceeds the maximum limit of 10MB. Please choose a smaller image.`,
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
          this.compressImage(base64Str, 1600, 900, 0.75).then(compressed => {
            this.carouselSettings.images.push(compressed);
            
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
          });
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
        this.settingsErrorMessage = err.error?.message || 'Failed to save settings! The payload might be too large.';
        setTimeout(() => this.settingsErrorMessage = '', 5000);
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

  convertTo24Hour(timeStr: string): string {
    if (!timeStr) return '08:00';
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
      return timeStr.trim();
    }
    const parts = timeStr.split(' ');
    const time = parts[0];
    const modifier = parts[1];
    let [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    if (hours === 12) {
      hours = 0;
    }
    if (modifier === 'PM') {
      hours = hours + 12;
    }
    return `${String(hours).padStart(2, '0')}:${minutesStr.padStart(2, '0')}`;
  }

  convertTo12Hour(time24: string): string {
    if (!time24) return '08:00 AM';
    if (time24.includes('AM') || time24.includes('PM')) {
      return time24;
    }
    let [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const modifier = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutesStr} ${modifier}`;
  }

  openAddForm() {
    this.formModel = this.getEmptyFormModel();
    this.formModel.event_time = '08:00'; // Standard 24h default for picker
    this.isEditing = false;
    this.isFormOpen = true;
    this.isSavingEvent = false;
  }

  openEditForm(event: EventModel) {
    this.formModel = { ...event };
    this.formModel.event_time = this.convertTo24Hour(event.event_time);
    this.editingId = event.id;
    this.isEditing = true;
    this.isFormOpen = true;
    this.isSavingEvent = false;
  }

  closeForm() {
    this.isFormOpen = false;
    this.isSavingEvent = false;
  }

  saveEvent() {
    this.isSavingEvent = true;
    
    // Revert 24h picker back to 12h format for consistent storage
    this.formModel.event_time = this.convertTo12Hour(this.formModel.event_time);

    // Automatically copy English content to Gujarati and Hindi to keep events dynamic
    this.formModel.title_gu = this.formModel.title_en;
    this.formModel.title_hi = this.formModel.title_en;
    this.formModel.description_gu = this.formModel.description_en;
    this.formModel.description_hi = this.formModel.description_en;
    this.formModel.location_gu = this.formModel.location_en;
    this.formModel.location_hi = this.formModel.location_en;

    if (this.isEditing && this.editingId !== undefined) {
      this.eventService.updateEvent(this.formModel).subscribe({
        next: () => {
          this.loadEvents();
          this.isSavingEvent = false;
          this.closeForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvent = false;
        }
      });
    } else {
      this.eventService.createEvent(this.formModel).subscribe({
        next: () => {
          this.loadEvents();
          this.isSavingEvent = false;
          this.closeForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvent = false;
        }
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

  getcurrentLang() {
    return this.langService.getLanguage();
  }

  // Staff Section Admin Operations
  getEmptyStaffFormModel(): StaffModel {
    return {
      name: '',
      position: '',
      profile_pic: '',
      description: '',
      status: 'active'
    };
  }

  loadStaff() {
    this.eventService.getStaff().subscribe(data => {
      this.staff = data;
    });
  }

  openAddStaffForm() {
    this.staffFormModel = this.getEmptyStaffFormModel();
    this.isEditingStaff = false;
    this.isStaffFormOpen = true;
    this.isSavingStaff = false;
    this.selectedStaffFileName = '';
    this.staffUploadProgress = 0;
  }

  openEditStaffForm(member: StaffModel) {
    this.staffFormModel = { ...member };
    this.editingStaffId = member.id;
    this.isEditingStaff = true;
    this.isStaffFormOpen = true;
    this.isSavingStaff = false;
    this.selectedStaffFileName = '';
    this.staffUploadProgress = 0;
  }

  closeStaffForm() {
    this.isStaffFormOpen = false;
    this.isSavingStaff = false;
  }

  onStaffFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        this.eventService.showConfirm({
          title: 'Unsupported File Type',
          message: 'Only image files are permitted.',
          confirmBtnText: 'OK',
          cancelBtnText: 'none',
          onConfirm: () => {}
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        this.eventService.showConfirm({
          title: 'File Too Large',
          message: 'Profile picture must not exceed 10MB.',
          confirmBtnText: 'OK',
          cancelBtnText: 'none',
          onConfirm: () => {}
        });
        return;
      }
      this.selectedStaffFileName = file.name;
      this.staffUploadProgress = 0;

      const reader = new FileReader();
      reader.onprogress = (e: ProgressEvent<FileReader>) => {
        if (e.lengthComputable) {
          this.staffUploadProgress = Math.round((e.loaded / e.total) * 100);
        }
      };
      reader.onload = (e: any) => {
        const base64Str = e.target.result;
        this.compressImage(base64Str, 400, 400, 0.8).then(compressed => {
          this.staffFormModel.profile_pic = compressed;
          this.staffUploadProgress = 100;
          setTimeout(() => {
            this.selectedStaffFileName = '';
            this.staffUploadProgress = 0;
          }, 1500);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  saveStaff() {
    this.isSavingStaff = true;
    if (this.isEditingStaff && this.editingStaffId !== undefined) {
      this.eventService.updateStaff(this.staffFormModel).subscribe({
        next: () => {
          this.loadStaff();
          this.isSavingStaff = false;
          this.closeStaffForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingStaff = false;
        }
      });
    } else {
      this.eventService.createStaff(this.staffFormModel).subscribe({
        next: () => {
          this.loadStaff();
          this.isSavingStaff = false;
          this.closeStaffForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingStaff = false;
        }
      });
    }
  }

  deleteStaff(id: number | undefined) {
    if (!id) return;
    this.eventService.showConfirm({
      title: 'Delete Staff Member',
      message: 'Are you sure you want to delete this staff member?',
      confirmBtnText: 'Delete',
      onConfirm: () => {
        this.eventService.deleteStaff(id).subscribe(() => {
          this.loadStaff();
        });
      }
    });
  }

  toggleStaffStatus(member: StaffModel) {
    const newStatus = member.status === 'inactive' ? 'active' : 'inactive';
    const updated = { ...member, status: newStatus };
    this.eventService.updateStaff(updated).subscribe(() => {
      this.loadStaff();
    });
  }

  // Resolutions Admin Operations
  getEmptyResFormModel(): ResolutionModel {
    return {
      title: '',
      description: ''
    };
  }

  loadResolutions() {
    this.eventService.getResolutions().subscribe(data => {
      this.resolutions = data;
    });
  }

  openAddResForm() {
    this.resFormModel = this.getEmptyResFormModel();
    this.isEditingRes = false;
    this.isResFormOpen = true;
    this.isSavingRes = false;
  }

  openEditResForm(res: ResolutionModel) {
    this.resFormModel = { ...res };
    this.editingResId = res.id;
    this.isEditingRes = true;
    this.isResFormOpen = true;
    this.isSavingRes = false;
  }

  closeResForm() {
    this.isResFormOpen = false;
    this.isSavingRes = false;
  }

  saveResolution() {
    this.isSavingRes = true;
    if (this.isEditingRes && this.editingResId !== undefined) {
      this.eventService.updateResolution(this.resFormModel).subscribe({
        next: () => {
          this.loadResolutions();
          this.isSavingRes = false;
          this.closeResForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingRes = false;
        }
      });
    } else {
      this.eventService.createResolution(this.resFormModel).subscribe({
        next: () => {
          this.loadResolutions();
          this.isSavingRes = false;
          this.closeResForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingRes = false;
        }
      });
    }
  }

  deleteResolution(id: number | undefined) {
    if (!id) return;
    this.eventService.showConfirm({
      title: 'Delete Resolution',
      message: 'Are you sure you want to delete this resolution?',
      confirmBtnText: 'Delete',
      onConfirm: () => {
        this.eventService.deleteResolution(id).subscribe(() => {
          this.loadResolutions();
        });
      }
    });
  }

  // Statistics Admin Operations
  getEmptyStatsFormModel(): StatisticModel {
    return {
      title: '',
      value: 0
    };
  }

  loadStatistics() {
    this.eventService.getStatistics().subscribe(data => {
      this.statistics = data;
    });
  }

  openAddStatsForm() {
    this.statsFormModel = this.getEmptyStatsFormModel();
    this.isEditingStats = false;
    this.isStatsFormOpen = true;
    this.isSavingStats = false;
  }

  openEditStatsForm(stat: StatisticModel) {
    this.statsFormModel = { ...stat };
    this.editingStatsId = stat.id;
    this.isEditingStats = true;
    this.isStatsFormOpen = true;
    this.isSavingStats = false;
  }

  closeStatsForm() {
    this.isStatsFormOpen = false;
    this.isSavingStats = false;
  }

  saveStatistic() {
    this.isSavingStats = true;
    if (this.isEditingStats && this.editingStatsId !== undefined) {
      this.eventService.updateStatistic(this.statsFormModel).subscribe({
        next: () => {
          this.loadStatistics();
          this.isSavingStats = false;
          this.closeStatsForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingStats = false;
        }
      });
    } else {
      this.eventService.createStatistic(this.statsFormModel).subscribe({
        next: () => {
          this.loadStatistics();
          this.isSavingStats = false;
          this.closeStatsForm();
        },
        error: (err) => {
          console.error(err);
          this.isSavingStats = false;
        }
      });
    }
  }

  deleteStatistic(id: number | undefined) {
    if (!id) return;
    this.eventService.showConfirm({
      title: 'Delete Statistic',
      message: 'Are you sure you want to delete this statistic?',
      confirmBtnText: 'Delete',
      onConfirm: () => {
        this.eventService.deleteStatistic(id).subscribe(() => {
          this.loadStatistics();
        });
      }
    });
  }

  // Home Page Carousel Admin Operations
  loadHomeCarouselSettings() {
    this.eventService.getHomeCarouselSettings().subscribe(settings => {
      this.homeCarouselSettings = { ...settings };
    });
  }

  addHomeCarouselImage() {
    if (!this.newHomeImageUrl) return;
    if (!this.newHomeImageUrl.startsWith('http://') && !this.newHomeImageUrl.startsWith('https://') && !this.newHomeImageUrl.startsWith('/')) {
      this.eventService.showConfirm({
        title: 'Invalid URL',
        message: 'Please enter a valid image URL starting with http://, https:// or /',
        confirmBtnText: 'OK',
        cancelBtnText: 'none',
        onConfirm: () => {}
      });
      return;
    }
    if (!this.homeCarouselSettings.images) {
      this.homeCarouselSettings.images = [];
    }
    this.homeCarouselSettings.images.push(this.newHomeImageUrl);
    this.newHomeImageUrl = '';
  }

  onHomeFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedHomeFileName = files.length === 1 ? files[0].name : `${files.length} files selected`;
      this.homeUploadProgresses = [];
      let loadedCount = 0;
      
      if (!this.homeCarouselSettings.images) {
        this.homeCarouselSettings.images = [];
      }

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
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          this.eventService.showConfirm({
            title: 'File Too Large',
            message: `The file "${file.name}" exceeds the maximum limit of 10MB. Please choose a smaller image.`,
            confirmBtnText: 'OK',
            cancelBtnText: 'none',
            onConfirm: () => {}
          });
          continue;
        }
        validFiles.push(file);
        this.homeUploadProgresses.push({ name: file.name, progress: 0 });
      }

      if (validFiles.length === 0) {
        this.selectedHomeFileName = '';
        return;
      }

      this.selectedHomeFileName = validFiles.length === 1 ? validFiles[0].name : `${validFiles.length} files loading`;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const reader = new FileReader();
        
        reader.onprogress = (e: ProgressEvent<FileReader>) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            const idx = this.homeUploadProgresses.findIndex(p => p.name === file.name);
            if (idx !== -1) {
              this.homeUploadProgresses[idx].progress = pct;
            }
          }
        };

        reader.onload = (e: any) => {
          const base64Str = e.target.result;
          this.compressImage(base64Str, 1920, 1080, 0.75).then(compressed => {
            this.homeCarouselSettings.images.push(compressed);
            
            const idx = this.homeUploadProgresses.findIndex(p => p.name === file.name);
            if (idx !== -1) {
              this.homeUploadProgresses[idx].progress = 100;
            }

            loadedCount++;
            
            if (loadedCount === validFiles.length) {
              this.selectedHomeFileName = '';
              setTimeout(() => {
                this.homeUploadProgresses = [];
              }, 1500);
            }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  deleteHomeCarouselImage(index: number) {
    this.eventService.showConfirm({
      title: 'Remove Image',
      message: 'Are you sure you want to remove this image from the home carousel?',
      confirmBtnText: 'Remove',
      onConfirm: () => {
        this.homeCarouselSettings.images.splice(index, 1);
      }
    });
  }

  saveHomeCarouselSettings() {
    if (this.homeCarouselSettings.interval < 1) {
      this.eventService.showConfirm({
        title: 'Invalid Interval',
        message: 'Interval must be at least 1 second.',
        confirmBtnText: 'OK',
        cancelBtnText: 'none',
        onConfirm: () => {}
      });
      return;
    }
    this.eventService.saveHomeCarouselSettings(this.homeCarouselSettings).subscribe({
      next: () => {
        this.homeSettingsSuccessMessage = 'Home carousel settings saved successfully!';
        setTimeout(() => this.homeSettingsSuccessMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.homeSettingsErrorMessage = err.error?.message || 'Failed to save settings! The payload might be too large.';
        setTimeout(() => this.homeSettingsErrorMessage = '', 5000);
      }
    });
  }
}
