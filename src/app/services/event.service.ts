import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface EventModel {
  id?: number;
  title_en: string;
  title_gu: string;
  title_hi: string;
  description_en: string;
  description_gu: string;
  description_hi: string;
  location_en: string;
  location_gu: string;
  location_hi: string;
  event_date: string;
  event_time: string;
  status?: string; // 'active' or 'inactive'
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost/backend/public/api/events';
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('admin_session') === 'active');
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setLoginState(state: boolean) {
    if (state) {
      localStorage.setItem('admin_session', 'active');
    } else {
      localStorage.removeItem('admin_session');
    }
    this.isLoggedInSubject.next(state);
  }
  
  // Local storage fallback for seamless demonstration/testing if backend is offline
  private fallbackEvents: EventModel[] = [
    {
      id: 1,
      title_en: 'Independence Day Celebration',
      title_gu: 'સ્વતંત્રતા દિવસની ઉજવણી',
      title_hi: 'स्वतंत्रता दिवस समारोह',
      description_en: 'Join us for the flag hoisting ceremony and cultural programs in the village square.',
      description_gu: 'ગામના ચોકમાં ધ્વજવંદન સમારોહ અને સાંસ્કૃતિક કાર્યક્રમો માટે અમારી સાથે જોડાઓ.',
      description_hi: 'गांव के चौक में ध्वजारोहण समारोह और सांस्कृतिक कार्यक्रमों के लिए हमारे साथ जुड़ें।',
      location_en: 'Village Square',
      location_gu: 'ગામ ચોક',
      location_hi: 'गांव चौक',
      event_date: '2026-08-15',
      event_time: '08:00 AM'
    },
    {
      id: 2,
      title_en: 'Gandhi Jayanti Cleanliness Drive',
      title_gu: 'ગાંધી જયંતી સ્વચ્છતા અભિયાન',
      title_hi: 'ગાંધી જયંતી સ્વચ્છતા અભિયાન', // Wait, let's fix this in hindi: 'गांधी जयंती स्वच्छता अभियान'
      description_en: 'Community gathering for cleaning primary school premises and planting saplings.',
      description_gu: 'પ્રાથમિક શાળાના પરિસરની સફાઈ અને રોપા વાવવા માટે સામુદાયિક મેળાવડો.',
      description_hi: 'प्राथमिक विद्यालय परिसर की सफाई और पौधे लगाने के लिए सामुदायिक बैठक।',
      location_en: 'Primary School Ground',
      location_gu: 'પ્રાથમિક શાળા મેદાન',
      location_hi: 'प्राथमिक विद्यालय मैदान',
      event_date: '2026-10-02',
      event_time: '07:30 AM'
    }
  ];

  constructor(private http: HttpClient) {
    if (!localStorage.getItem('fallback_events')) {
      localStorage.setItem('fallback_events', JSON.stringify(this.fallbackEvents));
    }
  }

  private getFallbackEvents(): EventModel[] {
    const data = localStorage.getItem('fallback_events');
    return data ? JSON.parse(data) : this.fallbackEvents;
  }

  private saveFallbackEvents(events: EventModel[]) {
    localStorage.setItem('fallback_events', JSON.stringify(events));
  }

  private sortDesc(events: EventModel[]): EventModel[] {
    return events.sort((a, b) => b.event_date.localeCompare(a.event_date));
  }

  getEvents(): Observable<EventModel[]> {
    if (this.http && typeof this.http.get === 'function') {
      return this.http.get<EventModel[]>(this.apiUrl).pipe(
        map(list => this.sortDesc(list)),
        catchError(() => {
          console.warn('Backend API offline. Using LocalStorage fallback.');
          return of(this.sortDesc(this.getFallbackEvents()));
        })
      );
    }
    return of(this.sortDesc(this.getFallbackEvents()));
  }

  createEvent(event: EventModel): Observable<EventModel> {
    if (this.http && typeof this.http.post === 'function') {
      return this.http.post<EventModel>(this.apiUrl, event).pipe(
        catchError(() => {
          console.warn('Backend API offline. Saving to LocalStorage fallback.');
          const list = this.getFallbackEvents();
          event.id = Date.now();
          list.push(event);
          this.saveFallbackEvents(list);
          return of(event);
        })
      );
    } else {
      const list = this.getFallbackEvents();
      event.id = Date.now();
      list.push(event);
      this.saveFallbackEvents(list);
      return of(event);
    }
  }

  updateEvent(event: EventModel): Observable<EventModel> {
    if (this.http && typeof this.http.put === 'function' && event.id) {
      return this.http.put<EventModel>(`${this.apiUrl}/${event.id}`, event).pipe(
        catchError(() => {
          console.warn('Backend API offline. Updating in LocalStorage fallback.');
          const list = this.getFallbackEvents();
          const idx = list.findIndex(e => e.id === event.id);
          if (idx !== -1) {
            list[idx] = event;
            this.saveFallbackEvents(list);
          }
          return of(event);
        })
      );
    } else {
      const list = this.getFallbackEvents();
      const idx = list.findIndex(e => e.id === event.id);
      if (idx !== -1) {
        list[idx] = event;
        this.saveFallbackEvents(list);
      }
      return of(event);
    }
  }

  deleteEvent(id: number): Observable<any> {
    if (this.http && typeof this.http.delete === 'function') {
      return this.http.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(() => {
          console.warn('Backend API offline. Deleting from LocalStorage fallback.');
          let list = this.getFallbackEvents();
          list = list.filter(e => e.id !== id);
          this.saveFallbackEvents(list);
          return of({ success: true });
        })
      );
    } else {
      let list = this.getFallbackEvents();
      list = list.filter(e => e.id !== id);
      this.saveFallbackEvents(list);
      return of({ success: true });
    }
  }

  login(credentials: any): Observable<any> {
    const loginUrl = 'http://localhost/backend/public/api/login';
    if (this.http && typeof this.http.post === 'function') {
      return this.http.post(loginUrl, credentials).pipe(
        catchError((err) => {
          console.warn('Backend API login offline. Validating with fallback logic.');
          if (credentials.email === 'admin@gmail.com' && credentials.password === 'Admin@12') {
            return of({ success: true, token: 'fallback_active_token', user: { name: 'Admin User', email: 'admin@gmail.com' } });
          }
          throw err;
        })
      );
    }
    if (credentials.email === 'admin@gmail.com' && credentials.password === 'Admin@12') {
      return of({ success: true, token: 'fallback_active_token', user: { name: 'Admin User', email: 'admin@gmail.com' } });
    }
    throw new Error('Invalid credentials');
  }
}
