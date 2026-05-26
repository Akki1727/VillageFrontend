import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LanguageType = 'en' | 'gu' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<LanguageType>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  private translations: Record<LanguageType, Record<string, string>> = {
    en: {
      // Navbar
      nav_home: 'Home',
      nav_about: 'About',
      nav_events: 'Events',
      nav_politics: 'Politics',
      nav_admin: 'Admin',
      logout: 'Logout',
      // Footer
      footer_desc: 'Empowering our community with transparent information, event updates, and local governance.',
      footer_quick: 'Quick Links',
      footer_contact: 'Contact Us',
      footer_rights: 'All rights reserved.',
      // Home Page
      hero_title: 'Welcome to Our Village',
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
      events_header_title: 'Upcoming Events',
      events_header_subtitle: 'Join us in celebrating community, culture, and progress.',
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
      btn_delete: 'Delete'
    },
    gu: {
      // Navbar
      nav_home: 'હોમ',
      nav_about: 'અમારા વિશે',
      nav_events: 'કાર્યક્રમો',
      nav_politics: 'રાજકારણ',
      nav_admin: 'એડમિન',
      logout: 'લોગઆઉટ',
      // Footer
      footer_desc: 'અમારા સમુદાયને પારદર્શક માહિતી, કાર્યક્રમોની અપડેટ્સ અને સ્થાનિક શાસનથી સશક્ત બનાવવું.',
      footer_quick: 'ઝડપી લિંક્સ',
      footer_contact: 'સંપર્ક કરો',
      footer_rights: 'બધા હકો સ્વાધીન.',
      // Home Page
      hero_title: 'અમારા ગામમાં આપનું સ્વાગત છે',
      hero_subtitle: 'પ્રગતિ, પારદર્શિતા અને એકતા પર બનેલો સમુદાય.',
      hero_btn_more: 'વધુ જાણો',
      hero_btn_events: 'આગામી કાર્યક્રમો',
      highlights_title: 'ગામની વિશેષતાઓ',
      gov_title: 'શાસન',
      gov_desc: 'ભવિષ્યને ઘડતા સ્થાનિક વહીવટી નિર્ણયો અને નીતિઓ વિશે માહિતગાર રહો.',
      read_more: 'વધુ વાંચો →',
      comm_events_title: 'સામુદાયિક કાર્યક્રમો',
      comm_events_desc: 'અમારી સંસ્કૃતિ, તહેવારો અને સામુદાયિક મેળાવડાઓની ઉજવણીમાં અમારી સાથે જોડાઓ.',
      view_sched: 'પત્રક જુઓ →',
      heritage_title: 'આપણો વારસો',
      heritage_desc: 'અમારા સુંદર ગામના સમૃદ્ધ ઇતિહાસ અને વસ્તી વિષયક વિગતો વિશે જાણો.',
      explore_hist: 'ઇતિહાસ જાણો →',
      // About Page
      about_title: 'અમારા ગામ વિશે',
      about_subtitle: 'ઇતિહાસ, સંસ્કૃતિ અને વસ્તી વિષયક વિગતો શોધો જે આપણને અનોખા બનાવે છે.',
      hist_title: 'અમારો ઇતિહાસ',
      hist_p1: 'એક સદી પહેલા સ્થપાયેલું અમારું ગામ એક નાની વસાહતમાંથી સમૃદ્ધ સમુદાયમાં વિકસિત થયું છે. આપણે કૃષિ અને પરંપરાગત કારીગરી સાથે ઊંડાણપૂર્વક જોડાયેલા છીએ.',
      hist_p2: 'વર્ષો જતાં, અમે અમારા સાંસ્કૃતિક વારસાને જાળવી રાખીને આધુનિક સુવિધાઓ અપનાવી છે. ગામની મધ્યમાં આવેલું જૂનું વડનું ઝાડ હજી પણ આપણી દીર્ઘકાલીન વિરાસતના પુરાવા તરીકે ઊભું છે.',
      img_placeholder: 'ગામનું ચિત્ર',
      stat_pop: 'વસ્તી',
      stat_est: 'સ્થાપના',
      stat_schools: 'શાળાઓ',
      stat_hospitals: 'હોસ્પિટલો',
      // Events Page
      events_header_title: 'આગામી કાર્યક્રમો',
      events_header_subtitle: 'સમુદાય, સંસ્કૃતિ અને પ્રગતિની ઉજવણીમાં અમારી સાથે જોડાઓ.',
      event1_title: 'સ્વતંત્રતા દિવસની ઉજવણી',
      event1_time: '📍 ગામનું ચોક | 🕒 ૮:૦૦ AM',
      event1_desc: 'ધ્વજવંદન સમારોહ અને ત્યારબાદ શાળાના બાળકો દ્વારા સાંસ્કૃતિક કાર્યક્રમો અને સામુદાયિક ભોજન.',
      event2_title: 'ગાંધી જયંતિ સ્વચ્છતા અભિયાન',
      event2_time: '📍 પંચાયત કચેરી | 🕒 ૭:૦૦ AM',
      event2_desc: 'મહાત્મા ગાંધીના સ્વચ્છ ભારતના વિઝનને સન્માન આપવા માટે સમગ્ર ગામમાં સ્વચ્છતા અભિયાન.',
      event3_title: 'વાર્ષિક ખેડૂત બજાર અને મેળો',
      event3_time: '📍 ખુલ્લું મેદાન | 🕒 ૧૦:૦૦ AM - ૬:૦૦ PM',
      event3_desc: 'સ્થાનિક ખેડૂતો અને કારીગરો તેમની પેદાશો, હસ્તકલા અને સ્થાનિક વાનગીઓનું પ્રદર્શન કરશે.',
      // Politics Page
      pol_header_title: 'સ્થાનિક શાસન અને રાજકારણ',
      pol_header_subtitle: 'અમારા ગામના કલ્યાણ માટે સમર્પિત પારદર્શક વહીવટ.',
      panchayat_title: 'ગ્રામ પંચાયત',
      panchayat_desc: 'ગ્રામ પંચાયત એ આપણી સ્થાનિક સ્વરાજ્યની આધારશિલા છે. ગામના રહેવાસીઓ દ્વારા ચૂંટાયેલી પંચાયત ઇન્ફ્રાસ્ટ્રક્ચર વિકાસ, સ્વચ્છતા, શિક્ષણ અને વિવાદ નિવારણ માટે જવાબદાર છે.',
      leader1_name: 'રમેશ કુમાર',
      leader1_role: 'સરપંચ (ગામના વડા)',
      leader1_bio: 'કૃષિના આધુનિકીકરણ અને ગ્રામીણ શિક્ષણ ઇન્ફ્રાસ્ટ્રક્ચર સુધારવા માટે સમર્પિત.',
      leader2_name: 'સુનિતા દેવી',
      leader2_role: 'ડેપ્યુટી સરપંચ',
      leader2_bio: 'મહિલા સશક્તિકરણ અને ગ્રામીણ આરોગ્યસંભાળ પહેલો પર ધ્યાન કેન્દ્રિત કરે છે.',
      leader3_name: 'અનિલ શર્મા',
      leader3_role: 'મંત્રી (સેક્રેટરી)',
      leader3_bio: 'વહીવટી રેકોર્ડ, નાણાં અને સરકારી યોજનાઓના અમલીકરણનું સંચાલન કરે છે.',
      decisions_title: 'તાજેતરના ઠરાવો',
      dec_1_title: 'સોલાર સ્ટ્રીટ લાઈટ્સ પ્રોજેક્ટ:',
      dec_1_desc: 'મુખ્ય ગ્રામીણ રસ્તાઓ પર 50 સોલાર ઉર્જાથી ચાલતી સ્ટ્રીટ લાઈટો લગાવવાની મંજૂરી આપી.',
      dec_2_title: 'જળ સંરક્ષણ:',
      dec_2_desc: 'વરસાદી પાણીના સંગ્રહની ક્ષમતા વધારવા માટે ગામના તળાવને ઊંડું કરવાની કામગીરી શરૂ કરી.',
      dec_3_title: 'પ્રાથમિક શાળા અપગ્રેડ:',
      dec_3_desc: 'ગામની પ્રાથમિક શાળામાં સ્માર્ટ ક્લાસરૂમ બનાવવા માટે ભંડોળ ફાળવ્યું.',
      // Admin Panel
      admin_title: 'ઇવેન્ટ મેનેજમેન્ટ ડેશબોર્ડ',
      admin_subtitle: 'આગામી ગામની ઇવેન્ટ્સ અને પ્રોગ્રામ્સ ઉમેરો, અપડેટ કરો અને મેનેજ કરો.',
      add_event: 'નવી ઇવેન્ટ ઉમેરો',
      edit_event: 'ઇવેન્ટ સંપાદિત કરો',
      save: 'ઇવેન્ટ સાચવો',
      cancel: 'રદ કરો',
      confirm_delete: 'શું તમે ખરેખર આ ઇવેન્ટ કાઢી નાખવા માંગો છો?',
      title_en: 'શીર્ષક (અંગ્રેજી)',
      title_gu: 'શીર્ષક (ગુજરાતી)',
      title_hi: 'શીર્ષક (હિન્દી)',
      description_en: 'વર્ણન (અંગ્રેજી)',
      description_gu: 'વર્ણન (ગુજરાતી)',
      description_hi: 'વર્ણન (હિન્દી)',
      location_en: 'સ્થળ (અંગ્રેજી)',
      location_gu: 'સ્થળ (ગુજરાતી)',
      location_hi: 'સ્થળ (હિન્દી)',
      event_date: 'ઇવેન્ટ તારીખ',
      event_time: 'ઇવેન્ટ સમય',
      actions: 'ક્રિયાઓ',
      no_events: 'કોઈ ઇવેન્ટ મળી નથી. તમારી પ્રથમ ઇવેન્ટ ઉમેરો!',
      btn_edit: 'સંપાદિત કરો',
      btn_delete: 'કાઢી નાખો'
    },
    hi: {
      // Navbar
      nav_home: 'होम',
      nav_about: 'हमारे बारे में',
      nav_events: 'कार्यक्रम',
      nav_politics: 'राजनीति',
      nav_admin: 'एडमिन',
      logout: 'लॉगआउट',
      // Footer
      footer_desc: 'पारदर्शी जानकारी, कार्यक्रम अपडेट और स्थानीय शासन के साथ हमारे समुदाय को सशक्त बनाना।',
      footer_quick: 'त्वरित लिंक्स',
      footer_contact: 'संपर्क करें',
      footer_rights: 'सर्वाधिकार सुरक्षित।',
      // Home Page
      hero_title: 'हमारे गाँव में आपका स्वागत है',
      hero_subtitle: 'प्रगति, पारदर्शिता और एकता पर बना एक समुदाय।',
      hero_btn_more: 'अधिक जानें',
      hero_btn_events: 'आगामी कार्यक्रम',
      highlights_title: 'गाँव की मुख्य विशेषताएं',
      gov_title: 'शासन',
      gov_desc: 'हमारे भविष्य को आकार देने वाले स्थानीय प्रशासनिक निर्णयों और नीतियों के बारे में सूचित रहें।',
      read_more: 'और पढ़ें →',
      comm_events_title: 'सामुदायिक कार्यक्रम',
      comm_events_desc: 'हमारी संस्कृति, त्योहारों और सामुदायिक समारोहों को मनाने में हमारे साथ शामिल हों।',
      view_sched: 'अनुसूची देखें →',
      heritage_title: 'हमारी विरासत',
      heritage_desc: 'हमारे सुंदर गाँव के समृद्ध इतिहास और जनसांख्यिकी के बारे में जानें।',
      explore_hist: 'इतिहास का अन्वेषण करें →',
      // About Page
      about_title: 'हमारे गाँव के बारे में',
      about_subtitle: 'उस इतिहास, संस्कृति और जनसांख्यिकी की खोज करें जो हमें अद्वितीय बनाती है।',
      hist_title: 'हमारा इतिहास',
      hist_p1: 'एक सदी से भी अधिक समय पहले स्थापित, हमारा गाँव एक छोटी सी बस्ती से बढ़कर एक समृद्ध समुदाय बन गया है। हम कृषि और पारंपरिक शिल्प कौशल में गहराई से जुड़े हुए हैं।',
      hist_p2: 'वर्षों से, हमने अपनी सांस्कृतिक विरासत को संरक्षित करते हुए आधुनिक सुविधाओं को अपनाया है। गाँव के केंद्र में स्थित पुराना बरगद का पेड़ आज भी हमारी स्थायी विरासत के प्रमाण के रूप में खड़ा है।',
      img_placeholder: 'गाँव का चित्र',
      stat_pop: 'जनसंख्या',
      stat_est: 'स्थापना',
      stat_schools: 'स्कूल',
      stat_hospitals: 'अस्पताल',
      // Events Page
      events_header_title: 'आगामी कार्यक्रम',
      events_header_subtitle: 'समुदाय, संस्कृति और प्रगति का जश्न मनाने में हमारे साथ शामिल हों।',
      event1_title: 'स्वतंत्रता दिवस समारोह',
      event1_time: '📍 ग्राम चौक | 🕒 सुबह 8:00 बजे',
      event1_desc: 'ध्वजारोहण समारोह के बाद स्कूली बच्चों द्वारा सांस्कृतिक कार्यक्रम और सामुदायिक भोज।',
      event2_title: 'गांधी जयंती स्वच्छता अभियान',
      event2_time: '📍 पंचायत कार्यालय | 🕒 सुबह 7:00 बजे',
      event2_desc: 'महात्मा गांधी के स्वच्छ भारत के सपने को सम्मान देने के लिए ग्राम स्तर पर स्वच्छता अभियान।',
      event3_title: 'वार्षिक किसान मेला',
      event3_time: '📍 खुला मैदान | 🕒 सुबह 10:00 से शाम 6:00 बजे तक',
      event3_desc: 'स्थानीय किसान और कारीगर अपनी उपज, हस्तशिल्प और स्थानीय व्यंजनों का प्रदर्शन करेंगे।',
      // Politics Page
      pol_header_title: 'स्थानीय शासन और राजनीति',
      pol_header_subtitle: 'हमारे गाँव के कल्याण के लिए समर्पित पारदर्शी प्रशासन।',
      panchayat_title: 'ग्राम पंचायत',
      panchayat_desc: 'ग्राम पंचायत हमारे स्थानीय स्वशासन की आधारशिला है। ग्रामीणों द्वारा निर्वाचित, पंचायत बुनियादी ढांचे के विकास, स्वच्छता, शिक्षा और विवाद समाधान के लिए जिम्मेदार है।',
      leader1_name: 'रमेश कुमार',
      leader1_role: 'सरपंच (गाँव प्रमुख)',
      leader1_bio: 'कृषि के आधुनिकीकरण और ग्रामीण शिक्षा बुनियादी ढांचे में सुधार के लिए समर्पित।',
      leader2_name: 'सुनीता देवी',
      leader2_role: 'उप सरपंच',
      leader2_bio: 'महिला सशक्तिकरण और ग्रामीण स्वास्थ्य पहलों पर ध्यान केंद्रित करता है।',
      leader3_name: 'अनिल शर्मा',
      leader3_role: 'सचिव',
      leader3_bio: 'प्रशासनिक रिकॉर्ड, वित्त और सरकारी योजनाओं के कार्यान्वयन का प्रबंधन करते हैं।',
      decisions_title: 'हाल के प्रस्ताव',
      dec_1_title: 'सौर स्ट्रीट लाइट परियोजना:',
      dec_1_desc: 'मुख्य गाँव की सड़कों पर 50 सौर ऊर्जा संचालित स्ट्रीट लाइटें लगाने की मंजूरी दी।',
      dec_2_title: 'जल संरक्षण:',
      dec_2_desc: 'वर्षा जल संचयन क्षमता बढ़ाने के लिए गाँव के तालाब को गहरा करने की पहल शुरू की।',
      dec_3_title: 'प्राथमिक विद्यालय अपग्रेड:',
      dec_3_desc: 'गाँव के प्राथमिक विद्यालय में स्मार्ट क्लासरूम स्थापित करने के लिए धन आवंटित किया।',
      // Admin Panel
      admin_title: 'इवेंट मैनेजमेंट डैशबोर्ड',
      admin_subtitle: 'आगामी गाँव के कार्यक्रमों को जोड़ें, अपडेट करें और प्रबंधित करें।',
      add_event: 'नया कार्यक्रम जोड़ें',
      edit_event: 'कार्यक्रम संपादित करें',
      save: 'कार्यक्रम सहेजें',
      cancel: 'रद्द करें',
      confirm_delete: 'क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?',
      title_en: 'शीर्षक (अंग्रेजी)',
      title_gu: 'शीर्षक (गुजराती)',
      title_hi: 'शीर्षक (हिंदी)',
      description_en: 'विवरण (अंग्रेजी)',
      description_gu: 'विवरण (गुजराती)',
      description_hi: 'विवरण (हिंदी)',
      location_en: 'स्थान (अंग्रेजी)',
      location_gu: 'स्थान (गुजराती)',
      location_hi: 'स्थान (हिंदी)',
      event_date: 'कार्यक्रम की तारीख',
      event_time: 'कार्यक्रम का समय',
      actions: 'कार्रवाई',
      no_events: 'कोई कार्यक्रम नहीं मिला। अपना पहला कार्यक्रम जोड़ें!',
      btn_edit: 'संपादित करें',
      btn_delete: 'हटाएं'
    }
  };

  constructor() {
    const savedLang = localStorage.getItem('village_lang') as LanguageType;
    if (savedLang && (savedLang === 'en' || savedLang === 'gu' || savedLang === 'hi')) {
      this.currentLangSubject.next(savedLang);
    }
  }

  setLanguage(lang: LanguageType) {
    localStorage.setItem('village_lang', lang);
    this.currentLangSubject.next(lang);
  }

  getLanguage(): LanguageType {
    return this.currentLangSubject.value;
  }

  t(key: string): string {
    const lang = this.getLanguage();
    return this.translations[lang]?.[key] || key;
  }
}
