import { Letterhead } from '@/types/document';

export interface OfficialStamp {
  id: string;
  name: string;              // Marathi label
  description: string;       // Role description
  imageUrl: string;          // Public URL
  defaultWidth: number;      // Render width in px
  category: 'stamp' | 'signature' | 'both';
  senderRole?: string;
  senderName?: string;
  hidden?: boolean;          // If true, hidden from selectable library but retained for existing documents
}

export const OFFICIAL_STAMPS_PRESETS: OfficialStamp[] = [
  {
    id: 'stamp_adhyaksh_round',
    name: 'अध्यक्ष शिक्का (President Stamp)',
    description: 'कामेल एज्युकेशन सोसायटी अध्यक्ष अधिकृत शिक्का',
    imageUrl: '/signatures/अध्यक्ष.png',
    defaultWidth: 140,
    category: 'stamp',
    senderRole: 'अध्यक्ष',
    hidden: true, // Hidden from selectable library per instructions, but image preserved for older docs
  },
  {
    id: 'stamp_adhyaksh_sign',
    name: 'अध्यक्ष स्वाक्षरी व शिक्का (Sign & Stamp)',
    description: 'अध्यक्ष स्वाक्षरी व शिक्का',
    imageUrl: '/signatures/aadhyaksh.png',
    defaultWidth: 130,
    category: 'both',
    senderRole: 'अध्यक्ष',
  },
  {
    id: 'stamp_secretary',
    name: 'सचिव शिक्का व स्वाक्षरी (Secretary Stamp)',
    description: 'कामेल एज्युकेशन सोसायटी सचिव शिक्का व स्वाक्षरी',
    imageUrl: '/signatures/Secretary.png',
    defaultWidth: 130,
    category: 'both',
    senderRole: 'सचिव',
  },
  {
    id: 'stamp_hm',
    name: 'मुख्याध्यापक शिक्का (HM Stamp)',
    description: 'कामेल उर्दू हायस्कूल मुख्याध्यापक शिक्का व स्वाक्षरी',
    imageUrl: '/signatures/HM.png',
    defaultWidth: 110,
    category: 'stamp',
    senderRole: 'मुख्याध्यापक',
  },
  {
    id: 'stamp_anwar_bhai',
    name: 'अनवर भाई (Anwar Bhai)',
    description: 'अधिकृत स्वाक्षरी व शिक्का',
    imageUrl: '/signatures/Anwar Bhai.png',
    defaultWidth: 140,
    category: 'both',
    senderName: 'अनवर भाई',
  },
  {
    id: 'stamp_if_bh',
    name: 'इफ्तिखार भाई (Iftikhar Bhai)',
    description: 'अधिकृत स्वाक्षरी',
    imageUrl: '/signatures/If bh.png',
    defaultWidth: 120,
    category: 'signature',
    senderName: 'इफ्तिखार भाई',
  },
];

export const officialLetterheads = {
  society: {
    name: 'Kamel Education Society',
    image: '/letterheads/Society later.png',
  },
  school: {
    name: 'Kamel Urdu High School',
    image: '/letterheads/High School later.png',
  },
  ashoorkhana: {
    name: 'AshoorKhana Naale Hyder',
    image: '/letterheads/Aashoorkhana later.png',
  },
};

export const OFFICIAL_LETTERHEAD_PRESETS: Letterhead[] = [
  {
    id: 'lh_kamel_highschool',
    title: 'Kamel Urdu High School',
    subtitle: "Kamel Education Society's (Minority institution no. M.E.S 2014/Pra. No. 169/ka.5)",
    registrationNo: 'शाळा मान्यता क्र. MES 2014',
    address: 'Yousuf Colony, Wangi Road, Parbhani (Maharashtra) 431401',
    contactInfo: 'Mobile: 9421 488 111, E-mail: kamelngo@gmail.com',
    logoUrl: officialLetterheads.school.image,
    headerImageUrl: officialLetterheads.school.image,
    defaultOutwardPrefix: 'KES/2024-25/',
  },
  {
    id: 'lh_kamel_education_society',
    title: 'Kamel Education Society',
    subtitle: '(Minority institution. no. M.E.S 2014/Pra. No. 169/ka.5)',
    registrationNo: 'नोंदणी क्र. F.3098, MAH/55/97',
    address: 'Yousuf Colony, Wangi Road, Parbhani (Maharashtra) 431401',
    contactInfo: 'Mobile : 9421 488 111, E-mail : kamelngo@gmail.com',
    logoUrl: officialLetterheads.society.image,
    headerImageUrl: officialLetterheads.society.image,
    defaultOutwardPrefix: 'जा.क्र./ KES/',
  },
  {
    id: 'lh_ashoorkhana_naale_hyder',
    title: 'AshoorKhana Naale Hyder',
    subtitle: 'Masjid Mahetab Ali Shah, Graveyard & Naqqar Khana Baradari',
    registrationNo: 'वक्फ नोंदणी क्र. MSBW/PBN/47/2010',
    address: 'Office: Lokmanya Tilak Road, Parbhani.',
    contactInfo: 'Sajjada Nashine & Mutawalli – Mushtaque Ali Shah | मो. 9421488111, 9119488111 | anhparbhani123@gmail.com',
    logoUrl: officialLetterheads.ashoorkhana.image,
    headerImageUrl: officialLetterheads.ashoorkhana.image,
    defaultOutwardPrefix: 'जा.क्र. ANH/PBN/',
  },
];

export interface OfficialInstitution {
  id: string;
  name: string;
  location: string;
  udiseCode: string;
  letterheadId?: string;
}

export const KAMEL_EDUCATION_SOCIETY_INSTITUTIONS: OfficialInstitution[] = [
  {
    id: 'kamel_primary_urdu_school',
    name: 'Kamel Primary Urdu School',
    location: 'Yousuf Colony, Parbhani',
    udiseCode: '27171000335',
  },
  {
    id: 'kamel_urdu_junior_college',
    name: 'Kamel Urdu Junior College',
    location: 'Yousuf Colony, Parbhani',
    udiseCode: '27171000358',
  },
  {
    id: 'kamel_urdu_primary_school',
    name: 'Kamel Urdu Primary School',
    location: 'Wangi Road, Parbhani',
    udiseCode: '27171000229',
  },
  {
    id: 'kamel_urdu_high_school',
    name: 'Kamel Urdu High School',
    location: 'Yousuf Colony, Parbhani',
    udiseCode: '27171000190',
    letterheadId: 'lh_kamel_highschool',
  },
];

