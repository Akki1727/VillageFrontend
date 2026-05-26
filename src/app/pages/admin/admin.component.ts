import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, EventModel } from '../../services/event.service';
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
    if (confirm(this.t('confirm_delete') || 'Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
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
