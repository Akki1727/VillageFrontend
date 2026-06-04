import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
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

export interface HistorySettings {
  title: string;
  p1: string;
  p2: string;
}

export interface StaffModel {
  id?: number;
  name: string;
  position: string;
  profile_pic?: string; // base64 or URL
  description: string;
  status?: string; // 'active' or 'inactive'
  created_at?: string;
  updated_at?: string;
}

export interface ResolutionModel {
  id?: number;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatisticModel {
  id?: number;
  title: string;
  value: number;
  created_at?: string;
  updated_at?: string;
}

export interface VideoModel {
  id?: number;
  video_url: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl + '/events';
  private staffApiUrl = environment.apiUrl + '/staff';
  private resolutionsApiUrl = environment.apiUrl + '/resolutions';
  private statisticsApiUrl = environment.apiUrl + '/statistics';
  private homeCarouselApiUrl = environment.apiUrl + '/settings/home-carousel';
  private videosApiUrl = environment.apiUrl + '/videos';

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    typeof localStorage !== 'undefined' ? localStorage.getItem('admin_session') === 'active' : false
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private safeSetItem(key: string, value: string): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Failed to save key "${key}" to LocalStorage (quota exceeded or storage disabled):`, e);
      return false;
    }
  }

  setLoginState(state: boolean) {
    if (typeof localStorage !== 'undefined') {
      if (state) {
        this.safeSetItem('admin_session', 'active');
        this.safeSetItem('admin_login_timestamp', Date.now().toString());
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
      this.safeSetItem('admin_login_timestamp', Date.now().toString());
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
        this.safeSetItem('fallback_events', JSON.stringify(this.fallbackEvents));
      }

      const existingStaff = localStorage.getItem('fallback_staff');
      if (existingStaff) {
        const parsed = JSON.parse(existingStaff);
        const defaults = ['Ramesh Kumar', 'Sunita Devi', 'Anil Sharma'];
        const filtered = parsed.filter((m: any) => !defaults.includes(m.name));
        this.safeSetItem('fallback_staff', JSON.stringify(filtered));
      } else {
        this.safeSetItem('fallback_staff', JSON.stringify([]));
      }

      const existingRes = localStorage.getItem('fallback_resolutions');
      if (existingRes) {
        const parsed = JSON.parse(existingRes);
        const defaults = ['Solar Street Lights Project:', 'Water Conservation:', 'Primary School Upgrade:'];
        const filtered = parsed.filter((r: any) => !defaults.includes(r.title));
        this.safeSetItem('fallback_resolutions', JSON.stringify(filtered));
      } else {
        this.safeSetItem('fallback_resolutions', JSON.stringify([]));
      }

      const existingStats = localStorage.getItem('fallback_statistics');
      if (existingStats) {
        const parsed = JSON.parse(existingStats);
        const defaults = ['Population', 'Established', 'Schools', 'Hospitals'];
        const filtered = parsed.filter((s: any) => !defaults.includes(s.title));
        this.safeSetItem('fallback_statistics', JSON.stringify(filtered));
      } else {
        this.safeSetItem('fallback_statistics', JSON.stringify([]));
      }

      const existingVideos = localStorage.getItem('fallback_videos');
      if (!existingVideos) {
        this.safeSetItem('fallback_videos', JSON.stringify([]));
      }
    }
  }

  private getFallbackEvents(): EventModel[] {
    const data = localStorage.getItem('fallback_events');
    return data ? JSON.parse(data) : this.fallbackEvents;
  }

  private saveFallbackEvents(events: EventModel[]) {
    this.safeSetItem('fallback_events', JSON.stringify(events));
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
    images: [],
    interval: 3 // Default 3 seconds
  };

  private defaultHomeCarouselSettings: CarouselSettings = {
    images: [],
    interval: 5
  };

  private defaultHistorySettings: HistorySettings = {
    title: 'Our History',
    p1: 'Founded over a century ago, our village has grown from a small settlement into a thriving community. We are deeply rooted in agriculture and traditional craftsmanship.',
    p2: 'Over the years, we have embraced modern amenities while preserving our cultural heritage. The old banyan tree in the center of the village still stands as a testament to our enduring legacy.'
  };

  getCarouselSettings(): Observable<CarouselSettings> {
    const settingsUrl = environment.apiUrl + '/settings/carousel';
    return this.http.get<CarouselSettings>(settingsUrl).pipe(
      catchError(() => {
        console.warn('Backend API offline. Using default carousel settings.');
        return of(this.defaultCarouselSettings);
      })
    );
  }

  saveCarouselSettings(settings: CarouselSettings): Observable<CarouselSettings> {
    const settingsUrl = environment.apiUrl + '/settings/carousel';
    return this.http.post<CarouselSettings>(settingsUrl, settings).pipe(
      catchError(() => {
        console.warn('Backend API offline. Settings not saved.');
        return of(settings);
      })
    );
  }

  getHomeCarouselSettings(): Observable<CarouselSettings> {
    return this.http.get<CarouselSettings>(this.homeCarouselApiUrl).pipe(
      catchError(() => {
        console.warn('Backend API offline. Using default home carousel settings.');
        return of(this.defaultHomeCarouselSettings);
      })
    );
  }

  saveHomeCarouselSettings(settings: CarouselSettings): Observable<CarouselSettings> {
    return this.http.post<CarouselSettings>(this.homeCarouselApiUrl, settings).pipe(
      catchError(() => {
        console.warn('Backend API offline. Home settings not saved.');
        return of(settings);
      })
    );
  }

  getHistorySettings(): Observable<HistorySettings> {
    const settingsUrl = environment.apiUrl + '/settings/history';
    return this.http.get<HistorySettings>(settingsUrl).pipe(
      catchError(() => {
        console.warn('Backend API offline. Using default history settings.');
        return of(this.defaultHistorySettings);
      })
    );
  }

  saveHistorySettings(settings: HistorySettings): Observable<HistorySettings> {
    const settingsUrl = environment.apiUrl + '/settings/history';
    return this.http.post<HistorySettings>(settingsUrl, settings).pipe(
      catchError(() => {
        console.warn('Backend API offline. History settings not saved.');
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

  private fallbackStaff: StaffModel[] = [];

  private getFallbackStaff(): StaffModel[] {
    const data = localStorage.getItem('fallback_staff');
    return data ? JSON.parse(data) : this.fallbackStaff;
  }

  private saveFallbackStaff(staff: StaffModel[]) {
    this.safeSetItem('fallback_staff', JSON.stringify(staff));
  }

  getStaff(): Observable<StaffModel[]> {
    if (this.http && typeof this.http.get === 'function') {
      return this.http.get<StaffModel[]>(this.staffApiUrl).pipe(
        catchError(() => {
          console.warn('Backend API staff offline. Using LocalStorage fallback.');
          return of(this.getFallbackStaff());
        })
      );
    }
    return of(this.getFallbackStaff());
  }

  createStaff(member: StaffModel): Observable<StaffModel> {
    if (this.http && typeof this.http.post === 'function') {
      return this.http.post<StaffModel>(this.staffApiUrl, member).pipe(
        catchError(() => {
          console.warn('Backend API staff offline. Saving to LocalStorage fallback.');
          const list = this.getFallbackStaff();
          member.id = Date.now();
          list.push(member);
          this.saveFallbackStaff(list);
          return of(member);
        })
      );
    } else {
      const list = this.getFallbackStaff();
      member.id = Date.now();
      list.push(member);
      this.saveFallbackStaff(list);
      return of(member);
    }
  }

  updateStaff(member: StaffModel): Observable<StaffModel> {
    if (this.http && typeof this.http.put === 'function' && member.id) {
      return this.http.put<StaffModel>(`${this.staffApiUrl}/${member.id}`, member).pipe(
        catchError(() => {
          console.warn('Backend API staff offline. Updating in LocalStorage fallback.');
          const list = this.getFallbackStaff();
          const idx = list.findIndex(e => e.id === member.id);
          if (idx !== -1) {
            list[idx] = member;
            this.saveFallbackStaff(list);
          }
          return of(member);
        })
      );
    } else {
      const list = this.getFallbackStaff();
      const idx = list.findIndex(e => e.id === member.id);
      if (idx !== -1) {
        list[idx] = member;
        this.saveFallbackStaff(list);
      }
      return of(member);
    }
  }

  deleteStaff(id: number): Observable<any> {
    if (this.http && typeof this.http.delete === 'function') {
      return this.http.delete(`${this.staffApiUrl}/${id}`).pipe(
        catchError(() => {
          console.warn('Backend API staff offline. Deleting from LocalStorage fallback.');
          let list = this.getFallbackStaff();
          list = list.filter(e => e.id !== id);
          this.saveFallbackStaff(list);
          return of({ success: true });
        })
      );
    } else {
      let list = this.getFallbackStaff();
      list = list.filter(e => e.id !== id);
      this.saveFallbackStaff(list);
      return of({ success: true });
    }
  }

  // Panchayat Resolutions Offline Fallback Data & Methods
  private fallbackResolutions: ResolutionModel[] = [];

  private getFallbackResolutions(): ResolutionModel[] {
    const data = localStorage.getItem('fallback_resolutions');
    return data ? JSON.parse(data) : this.fallbackResolutions;
  }

  private saveFallbackResolutions(resolutions: ResolutionModel[]) {
    this.safeSetItem('fallback_resolutions', JSON.stringify(resolutions));
  }

  getResolutions(): Observable<ResolutionModel[]> {
    if (this.http && typeof this.http.get === 'function') {
      return this.http.get<ResolutionModel[]>(this.resolutionsApiUrl).pipe(
        catchError(() => {
          console.warn('Backend API resolutions offline. Using LocalStorage fallback.');
          return of(this.getFallbackResolutions());
        })
      );
    }
    return of(this.getFallbackResolutions());
  }

  createResolution(res: ResolutionModel): Observable<ResolutionModel> {
    if (this.http && typeof this.http.post === 'function') {
      return this.http.post<ResolutionModel>(this.resolutionsApiUrl, res).pipe(
        catchError(() => {
          console.warn('Backend API resolutions offline. Saving to LocalStorage fallback.');
          const list = this.getFallbackResolutions();
          res.id = Date.now();
          list.push(res);
          this.saveFallbackResolutions(list);
          return of(res);
        })
      );
    } else {
      const list = this.getFallbackResolutions();
      res.id = Date.now();
      list.push(res);
      this.saveFallbackResolutions(list);
      return of(res);
    }
  }

  updateResolution(res: ResolutionModel): Observable<ResolutionModel> {
    if (this.http && typeof this.http.put === 'function' && res.id) {
      return this.http.put<ResolutionModel>(`${this.resolutionsApiUrl}/${res.id}`, res).pipe(
        catchError(() => {
          console.warn('Backend API resolutions offline. Updating in LocalStorage fallback.');
          const list = this.getFallbackResolutions();
          const idx = list.findIndex(e => e.id === res.id);
          if (idx !== -1) {
            list[idx] = res;
            this.saveFallbackResolutions(list);
          }
          return of(res);
        })
      );
    } else {
      const list = this.getFallbackResolutions();
      const idx = list.findIndex(e => e.id === res.id);
      if (idx !== -1) {
        list[idx] = res;
        this.saveFallbackResolutions(list);
      }
      return of(res);
    }
  }

  deleteResolution(id: number): Observable<any> {
    if (this.http && typeof this.http.delete === 'function') {
      return this.http.delete(`${this.resolutionsApiUrl}/${id}`).pipe(
        catchError(() => {
          console.warn('Backend API resolutions offline. Deleting from LocalStorage fallback.');
          let list = this.getFallbackResolutions();
          list = list.filter(e => e.id !== id);
          this.saveFallbackResolutions(list);
          return of({ success: true });
        })
      );
    } else {
      let list = this.getFallbackResolutions();
      list = list.filter(e => e.id !== id);
      this.saveFallbackResolutions(list);
      return of({ success: true });
    }
  }

  // Panchayat Statistics Offline Fallback Data & Methods
  private fallbackStatistics: StatisticModel[] = [];

  private getFallbackStatistics(): StatisticModel[] {
    const data = localStorage.getItem('fallback_statistics');
    return data ? JSON.parse(data) : this.fallbackStatistics;
  }

  private saveFallbackStatistics(stats: StatisticModel[]) {
    this.safeSetItem('fallback_statistics', JSON.stringify(stats));
  }

  getStatistics(): Observable<StatisticModel[]> {
    if (this.http && typeof this.http.get === 'function') {
      return this.http.get<StatisticModel[]>(this.statisticsApiUrl).pipe(
        catchError(() => {
          console.warn('Backend API statistics offline. Using LocalStorage fallback.');
          return of(this.getFallbackStatistics());
        })
      );
    }
    return of(this.getFallbackStatistics());
  }

  createStatistic(stat: StatisticModel): Observable<StatisticModel> {
    if (this.http && typeof this.http.post === 'function') {
      return this.http.post<StatisticModel>(this.statisticsApiUrl, stat).pipe(
        catchError(() => {
          console.warn('Backend API statistics offline. Saving to LocalStorage fallback.');
          const list = this.getFallbackStatistics();
          stat.id = Date.now();
          list.push(stat);
          this.saveFallbackStatistics(list);
          return of(stat);
        })
      );
    } else {
      const list = this.getFallbackStatistics();
      stat.id = Date.now();
      list.push(stat);
      this.saveFallbackStatistics(list);
      return of(stat);
    }
  }

  updateStatistic(stat: StatisticModel): Observable<StatisticModel> {
    if (this.http && typeof this.http.put === 'function' && stat.id) {
      return this.http.put<StatisticModel>(`${this.statisticsApiUrl}/${stat.id}`, stat).pipe(
        catchError(() => {
          console.warn('Backend API statistics offline. Updating in LocalStorage fallback.');
          const list = this.getFallbackStatistics();
          const idx = list.findIndex(e => e.id === stat.id);
          if (idx !== -1) {
            list[idx] = stat;
            this.saveFallbackStatistics(list);
          }
          return of(stat);
        })
      );
    } else {
      const list = this.getFallbackStatistics();
      const idx = list.findIndex(e => e.id === stat.id);
      if (idx !== -1) {
        list[idx] = stat;
        this.saveFallbackStatistics(list);
      }
      return of(stat);
    }
  }

  deleteStatistic(id: number): Observable<any> {
    if (this.http && typeof this.http.delete === 'function') {
      return this.http.delete(`${this.statisticsApiUrl}/${id}`).pipe(
        catchError(() => {
          console.warn('Backend API statistics offline. Deleting from LocalStorage fallback.');
          let list = this.getFallbackStatistics();
          list = list.filter(e => e.id !== id);
          this.saveFallbackStatistics(list);
          return of({ success: true });
        })
      );
    } else {
      let list = this.getFallbackStatistics();
      list = list.filter(e => e.id !== id);
      this.saveFallbackStatistics(list);
      return of({ success: true });
    }
  }

  // Videos Offline Fallback Data & Methods
  private fallbackVideos: VideoModel[] = [];

  private getFallbackVideos(): VideoModel[] {
    const data = localStorage.getItem('fallback_videos');
    return data ? JSON.parse(data) : this.fallbackVideos;
  }

  private saveFallbackVideos(videos: VideoModel[]) {
    this.safeSetItem('fallback_videos', JSON.stringify(videos));
  }

  getVideos(): Observable<VideoModel[]> {
    if (this.http && typeof this.http.get === 'function') {
      return this.http.get<VideoModel[]>(this.videosApiUrl).pipe(
        catchError(() => {
          console.warn('Backend API videos offline. Using LocalStorage fallback.');
          return of(this.getFallbackVideos());
        })
      );
    }
    return of(this.getFallbackVideos());
  }

  uploadVideoToCloudinary(file: File): Observable<HttpEvent<any>> {
    const totalBytes = file.size;
    const threshold = 100 * 1024 * 1024; // 100MB threshold

    if (totalBytes <= threshold) {
      // Normal single upload for files <= 100MB
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloudinaryUploadPreset);
      formData.append('cloud_name', environment.cloudinaryCloudName);

      const url = `https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/video/upload`;
      return this.http.post(url, formData, {
        reportProgress: true,
        observe: 'events'
      });
    }

    // Chunked upload for files > 100MB, using 95MB chunks
    const chunkSize = 95 * 1024 * 1024; // 95MB chunk size
    const uniqueUploadId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

    return new Observable<HttpEvent<any>>((observer) => {
      let start = 0;

      const uploadNextChunk = () => {
        const end = Math.min(start + chunkSize, totalBytes);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk, file.name); // Pass file.name to keep extension
        formData.append('upload_preset', environment.cloudinaryUploadPreset);
        formData.append('cloud_name', environment.cloudinaryCloudName);

        const httpHeaders = new HttpHeaders({
          'X-Unique-Upload-Id': uniqueUploadId,
          'Content-Range': `bytes ${start}-${end - 1}/${totalBytes}`
        });

        const url = `https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/video/upload`;

        this.http.post(url, formData, {
          headers: httpHeaders,
          reportProgress: true,
          observe: 'events'
        }).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total) {
                const currentChunkLoaded = event.loaded;
                const totalLoaded = start + currentChunkLoaded;
                observer.next({
                  type: HttpEventType.UploadProgress,
                  loaded: totalLoaded,
                  total: totalBytes
                } as HttpEvent<any>);
              }
            } else if (event.type === HttpEventType.Response) {
              start = end;
              if (start < totalBytes) {
                // Upload next chunk
                uploadNextChunk();
              } else {
                // Completed all chunks, emit final response
                observer.next(event);
                observer.complete();
              }
            }
          },
          error: (err) => {
            observer.error(err);
          }
        });
      };

      uploadNextChunk();
    });
  }

  uploadVideoLocal(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('video', file);

    return this.http.post(this.videosApiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  saveVideoUrl(videoUrl: string): Observable<any> {
    return this.http.post(this.videosApiUrl, { video_url: videoUrl });
  }

  deleteVideo(id: number): Observable<any> {
    if (this.http && typeof this.http.delete === 'function') {
      return this.http.delete(`${this.videosApiUrl}/${id}`).pipe(
        catchError(() => {
          console.warn('Backend API videos offline. Deleting from LocalStorage fallback.');
          let list = this.getFallbackVideos();
          list = list.filter(v => v.id !== id);
          this.saveFallbackVideos(list);
          return of({ success: true });
        })
      );
    } else {
      let list = this.getFallbackVideos();
      list = list.filter(v => v.id !== id);
      this.saveFallbackVideos(list);
      return of({ success: true });
    }
  }
}
