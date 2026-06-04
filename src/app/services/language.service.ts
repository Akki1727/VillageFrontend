import { Injectable } from '@angular/core';

export type LanguageType = 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translations = {
    en: {
      // Navbar
      nav_home: 'Home',
      nav_about: 'About',
      nav_events: 'Events',
      nav_politics: 'Politics',
      nav_videos: 'Videos',
      nav_admin: 'Admin',
      logout: 'Logout',
      // Footer
      footer_desc: 'Empowering our community with transparent information, event updates, and local governance.',
      footer_quick: 'Quick Links',
      footer_contact: 'Contact Us',
      footer_rights: 'All rights reserved.',
      // Home Page
      hero_title: 'Welcome to Dhamatvan Village',
      hero_subtitle: 'A community built on progress, transparency, and unity.',
      hero_btn_more: 'Discover More',
      hero_btn_events: 'Upcoming Events',
      highlights_title: 'Village Highlights',
      gov_title: 'Governance',
      gov_desc: 'Stay informed about local administrative decisions and policies shaping our future.',
      read_more: 'Read More →',
      comm_events_title: 'Community Events',
      comm_events_desc: 'Join us in celebrating our culture, festivals, and community gatherings.',
      view_sched: 'View Schedule →',
      heritage_title: 'Our Heritage',
      heritage_desc: 'Learn about the rich history and demographics of our beautiful village.',
      explore_hist: 'Explore History →',
      upcoming_events_title: 'Upcoming Events & Announcements',
      upcoming_events_subtitle: 'Stay updated and participate in upcoming community initiatives, celebrations, and gatherings.',
      no_upcoming_events: 'No upcoming events scheduled at this moment. Check back soon!',
      // About Page
      about_title: 'About Our Village',
      about_subtitle: 'Discover the history, culture, and demographics that make us unique.',
      hist_title: 'Our History',
      hist_p1: 'Founded over a century ago, our village has grown from a small settlement into a thriving community. We are deeply rooted in agriculture and traditional craftsmanship.',
      hist_p2: 'Over the years, we have embraced modern amenities while preserving our cultural heritage. The old banyan tree in the center of the village still stands as a testament to our enduring legacy.',
      img_placeholder: 'Image of Village',
      stat_pop: 'Population',
      stat_est: 'Established',
      stat_schools: 'Schools',
      stat_hospitals: 'Hospitals',
      // Events Page
      events_header_title: 'Completed Events & Highlights',
      events_header_subtitle: 'Explore successfully completed initiatives, festivals, and community programs.',
      no_completed_events: 'No completed events found.',
      event1_title: 'Independence Day Celebration',
      event1_time: '📍 Village Square | 🕒 8:00 AM',
      event1_desc: 'Flag hoisting ceremony followed by cultural programs by the school children and community feast.',
      event2_title: 'Gandhi Jayanti Cleanliness Drive',
      event2_time: '📍 Panchayat Office | 🕒 7:00 AM',
      event2_desc: "A village-wide cleanliness drive to honor Mahatma Gandhi's vision of Swachh Bharat.",
      event3_title: 'Annual Farmers Market & Mela',
      event3_time: '📍 Open Grounds | 🕒 10:00 AM - 6:00 PM',
      event3_desc: 'Local farmers and artisans showcasing their produce, handicrafts, and local cuisines.',
      // Politics Page
      pol_header_title: 'Local Governance & Politics',
      pol_header_subtitle: 'Transparent administration dedicated to the welfare of our village.',
      panchayat_title: 'Gram Panchayat',
      panchayat_desc: 'The Gram Panchayat is the cornerstone of our local self-governance. Elected by the village residents, the Panchayat is responsible for infrastructure development, sanitation, education, and dispute resolution.',
      leader1_name: 'Ramesh Kumar',
      leader1_role: 'Sarpanch (Village Head)',
      leader1_bio: 'Dedicated to modernizing agriculture and improving rural education infrastructure.',
      leader2_name: 'Sunita Devi',
      leader2_role: 'Deputy Sarpanch',
      leader2_bio: "Focuses on women's empowerment and rural healthcare initiatives.",
      leader3_name: 'Anil Sharma',
      leader3_role: 'Secretary',
      leader3_bio: 'Manages administrative records, finances, and government scheme implementations.',
      decisions_title: 'Recent Resolutions',
      dec_1_title: 'Solar Street Lights Project:',
      dec_1_desc: 'Approved the installation of 50 solar-powered street lights across main village roads.',
      dec_2_title: 'Water Conservation:',
      dec_2_desc: 'Initiated the deepening of the village pond to increase rainwater harvesting capacity.',
      dec_3_title: 'Primary School Upgrade:',
      dec_3_desc: 'Allocated funds for setting up a smart classroom in the village primary school.',
      // Admin Panel
      admin_title: 'Event Management Dashboard',
      admin_subtitle: 'Add, update, and manage upcoming village events and programs.',
      add_event: 'Add New Event',
      edit_event: 'Edit Event',
      save: 'Save Event',
      cancel: 'Cancel',
      confirm_delete: 'Are you sure you want to delete this event?',
      title_en: 'Title (English)',
      title_gu: 'Title (Gujarati)',
      title_hi: 'Title (Hindi)',
      description_en: 'Description (English)',
      description_gu: 'Description (Gujarati)',
      description_hi: 'Description (Hindi)',
      location_en: 'Location (English)',
      location_gu: 'Location (Gujarati)',
      location_hi: 'Location (Hindi)',
      event_date: 'Event Date',
      event_time: 'Event Time',
      actions: 'Actions',
      no_events: 'No events found. Add your first event!',
      btn_edit: 'Edit',
      btn_delete: 'Delete',
      // Event Details Modal
      modal_details_title: 'Program Details',
      modal_location: '📍 Venue & Location',
      modal_time_date: '📅 Date & Time',
      modal_description: '📝 Detailed Description',
      modal_close: 'Close',
      // Video Translations
      admin_videos_title: 'Videos & Media Dashboard',
      admin_videos_subtitle: 'Upload, manage, and showcase video highlights of our village.',
      add_video: 'Upload New Video'
    }
  };

  getLanguage(): string {
    return 'en';
  }

  t(key: string): string {
    return (this.translations.en as Record<string, string>)[key] || key;
  }
}
