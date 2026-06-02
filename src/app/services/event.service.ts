import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

export interface CarouselSettings {
  images: string[];
  interval: number; // in seconds
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl + '/events';
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    typeof localStorage !== 'undefined' ? localStorage.getItem('admin_session') === 'active' : false
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setLoginState(state: boolean) {
    if (typeof localStorage !== 'undefined') {
      if (state) {
        localStorage.setItem('admin_session', 'active');
        localStorage.setItem('admin_login_timestamp', Date.now().toString());
      } else {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_login_timestamp');
      }
    }
    this.isLoggedInSubject.next(state);
  }

  private checkSessionValidity(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const session = localStorage.getItem('admin_session');
    if (session !== 'active') {
      return false;
    }

    const loginTimeStr = localStorage.getItem('admin_login_timestamp');
    if (!loginTimeStr) {
      // Set timestamp now to avoid abrupt logout for existing active session
      localStorage.setItem('admin_login_timestamp', Date.now().toString());
      return true;
    }

    const loginTime = parseInt(loginTimeStr, 10);
    const currentTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (currentTime - loginTime >= twentyFourHours) {
      this.setLoginState(false);
      return false;
    }
    return true;
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
      title_hi: 'गांधी जयंती स्वच्छता अभियान',
      description_en: 'Community gathering for cleaning primary school premises and planting saplings.',
      description_gu: 'પ્રાથમિક શાળાના પરિસરની સફાઈ અને રોપા વાવવા માટે સામુદાયિક મેળાવડો.',
      description_hi: 'प्राथमिक विद्यालय परिसर की सफाई और पौधे लगाने के लिए सामुदायिक बैठक।',
      location_en: 'Primary School Ground',
      location_gu: 'પ્રાથમિક શાળા મેદાન',
      location_hi: 'प्राथमिक विद्यालय मैदान',
      event_date: '2026-10-02',
      event_time: '07:30 AM'
    },
    {
      id: 3,
      title_en: 'Republic Day Celebration',
      title_gu: 'પ્રજાસત્તાક દિનની ઉજવણી',
      title_hi: 'गणतंत्र दिवस समारोह',
      description_en: 'Flag hoisting ceremony followed by patriotic songs and a sports meet for youth.',
      description_gu: 'ધ્વજવંદન સમારોહ અને ત્યારબાદ દેશભક્તિના ગીતો અને યુવાનો માટે રમતગમત મહોત્સવ.',
      description_hi: 'ध्वजारोहण समारोह के बाद देशभक्ति गीत और युवाओं के लिए खेल प्रतियोगिता।',
      location_en: 'Gram Panchayat Compound',
      location_gu: 'ગ્રામ પંચાયત કમ્પાઉન્ડ',
      location_hi: 'ग्राम पंचायत परिसर',
      event_date: '2026-01-26',
      event_time: '08:30 AM'
    },
    {
      id: 4,
      title_en: 'Annual Medical Camp',
      title_gu: 'વાર્ષિક તબીબી કેમ્પ',
      title_hi: 'वार्षिक चिकित्सा शिविर',
      description_en: 'Free health checkup camp conducted by doctors from City General Hospital.',
      description_gu: 'સિટી જનરલ હોસ્પિટલના ડોક્ટરો દ્વારા નિઃશુલ્ક હેલ્થ ચેકઅપ કેમ્પ.',
      description_hi: 'सिटी जनरल अस्पताल के डॉक्टरों द्वारा आयोजित निःशुल्क स्वास्थ्य जांच शिविर।',
      location_en: 'Community Hall',
      location_gu: 'સામુદાયિક હોલ',
      location_hi: 'सामुदायिक भवन',
      event_date: '2026-03-10',
      event_time: '09:00 AM'
    }
  ];

  constructor(private http: HttpClient) {
    // Initial verification of session expiration
    const isValid = this.checkSessionValidity();
    this.isLoggedInSubject.next(isValid);

    // Periodically check session expiration every 5 seconds to handle idle/active tabs
    if (typeof window !== 'undefined') {
      window.setInterval(() => {
        this.checkSessionValidity();
      }, 5000);
    }

    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('fallback_events');
      if (!existing || JSON.parse(existing).length < this.fallbackEvents.length) {
        localStorage.setItem('fallback_events', JSON.stringify(this.fallbackEvents));
      }
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
    const loginUrl = environment.apiUrl + '/login';
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

  private defaultCarouselSettings: CarouselSettings = {
    images: [
      'https://images.unsplash.com/photo-1546482502-056e4794664d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80'
    ],
    interval: 3 // Default 3 seconds
  };

  getCarouselSettings(): Observable<CarouselSettings> {
    const settingsUrl = environment.apiUrl + '/settings/carousel';
    return this.http.get<CarouselSettings>(settingsUrl).pipe(
      catchError(() => {
        console.warn('Backend API offline. Using LocalStorage fallback for carousel settings.');
        const data = localStorage.getItem('carousel_settings');
        if (data) {
          return of(JSON.parse(data));
        }
        localStorage.setItem('carousel_settings', JSON.stringify(this.defaultCarouselSettings));
        return of(this.defaultCarouselSettings);
      })
    );
  }

  saveCarouselSettings(settings: CarouselSettings): Observable<CarouselSettings> {
    const settingsUrl = environment.apiUrl + '/settings/carousel';
    // Update browser LocalStorage immediately to keep fallback in sync
    localStorage.setItem('carousel_settings', JSON.stringify(settings));
    
    return this.http.post<CarouselSettings>(settingsUrl, settings).pipe(
      catchError(() => {
        console.warn('Backend API offline. Saving settings to LocalStorage fallback only.');
        return of(settings);
      })
    );
  }

  private confirmDialogSubject = new BehaviorSubject<{
    title: string;
    message: string;
    confirmBtnText?: string;
    cancelBtnText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);
  
  confirmDialog$ = this.confirmDialogSubject.asObservable();

  toggleBodyScroll(disable: boolean) {
    if (typeof document !== 'undefined') {
      if (disable) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }

  showConfirm(options: {
    title: string;
    message: string;
    confirmBtnText?: string;
    cancelBtnText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) {
    this.toggleBodyScroll(true);
    this.confirmDialogSubject.next(options);
  }

  closeConfirm() {
    this.toggleBodyScroll(false);
    const current = this.confirmDialogSubject.value;
    if (current && current.onCancel) {
      current.onCancel();
    }
    this.confirmDialogSubject.next(null);
  }

  triggerConfirm() {
    this.toggleBodyScroll(false);
    const current = this.confirmDialogSubject.value;
    if (current) {
      current.onConfirm();
    }
    this.confirmDialogSubject.next(null);
  }
}
