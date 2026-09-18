import { LetterTemplate, LetterDocument } from '@/types/document';
import { getTodayFormatted } from '@/utils/marathiNumbering';
import { OFFICIAL_LETTERHEAD_PRESETS } from '@/utils/officialAssets';

export const defaultFormatting = {
  fontFamily: 'Noto Sans Devanagari' as const,
  fontSize: 14,
  lineHeight: 1.6,
  paragraphSpacing: 12,
  numberingStyle: 'devanagari' as const,
  alignment: 'left' as const,
  isBoldSubject: true,
  isUnderlineSubject: true,
};

export const defaultPageSettings = {
  paperSize: 'A4' as const,
  orientation: 'portrait' as const,
  margin: 'normal' as const,
  topMargin: 15,
  bottomMargin: 15,
  leftMargin: 20,
  rightMargin: 15,
};

export const letterTemplates: LetterTemplate[] = [
  {
    id: 'general_official',
    title: 'सामान्य अधिकृत पत्र',
    subtitle: 'शासकीय व निमशासकीय अधिकृत कामकाजासाठी',
    description: 'जावक क्रमांक, दिनांक, विषय, संदर्भ व कायदेशीर संरचनेसह संपूर्ण अधिकृत पत्र format.',
    iconName: 'FileText',
    category: 'official',
    defaultValues: {
      templateId: 'general_official',
      title: 'सामान्य अधिकृत पत्र',
      outwardNo: 'जा.क्र./२०२५-२६/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. जिल्हाधिकारी साहेब',
        department: 'जिल्हाधिकारी कार्यालय',
        office: 'महसूल विभाग',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'शासकीय योजनांतर्गत मंजूर कामाबाबत सविस्तर अहवाल सादर करणे बाबत...',
      references: [
        '१. शासन निर्णय क्रमांक: संकिर्ण-२०२४/प्र.क्र.४५/',
        '२. आपले परिपत्रक दिनांक १५ मे २०२५.'
      ],
      greeting: 'महोदय,',
      body: 'सस्नेह जय महाराष्ट्र.\n\nवरील विषयी व संदर्भांकित पत्रान्वये आपणास सविनय कळविण्यात येते की, आमच्या क्षेत्रातील मंजूर विकास कामांचा सविस्तर आढावा घेण्यात आला आहे.\n\nसदर कामांचे नियोजन व अंमलबजावणी नियमानुसार पूर्ण करण्यात आली असून पुढील कार्यवाहीसाठी आवश्यक ती कागदपत्रे सोबत जोडली आहेत.',
      numberedPoints: [
        { id: '1', text: 'सदर कामाची प्राथमिक पाहणी व मोजणी पूर्ण झाली आहे.' },
        { id: '2', text: 'स्थानिक नागरिकांच्या सोयीसाठी तात्काळ निधी वितरीत करण्यात यावा.' },
        { id: '3', text: 'तांत्रिक मान्यतेचा अहवाल सोबत संलग्न केला आहे.' }
      ],
      copiesTo: [
        'मा. मुख्य कार्यकारी अधिकारी, जिल्हा परिषद',
        'मा. तहसीलदार साहेब, संबंधित तालुका'
      ],
      closing: 'आपला विश्वासू,',
      sender: {
        name: 'रमेश मारुतीराव पाटील',
        designation: 'सरपंच / अध्यक्ष',
        institution: 'ग्रामपंचायत कार्यालय',
        address: 'मु.पो. पाथरी, ता. पाथरी, जि. परभणी.',
        mobile: '९८२२१२३४५६',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'official_application',
    title: 'शासकीय अर्ज / विनंती अर्ज',
    subtitle: 'विविध दाखले, योजना व सवलतींसाठी अर्ज',
    description: 'नागरिकांसाठी शासकीय कार्यालयात सादर करावयाचा अधिकृत अर्ज.',
    iconName: 'FilePlus',
    category: 'application',
    defaultValues: {
      templateId: 'official_application',
      title: 'शासकीय अर्ज',
      outwardNo: '',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. तहसीलदार साहेब',
        department: 'तहसील कार्यालय',
        office: 'महसूल शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'उत्पनाचा दाखला / रहिवासी प्रमाणपत्र मिळणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'मी खालील सही करणार अर्जदार आपणास सविनय अर्ज सादर करतो की, मला शैक्षणिक व शासकीय कामासाठी उत्पनाचा दाखला व रहिवासी प्रमाणपत्राची अत्यंत आवश्यकता आहे.\n\nमी या तालुक्याचा कायमचा रहिवासी असून माझे वार्षिक उत्पन्न नियमानुसार मर्यादेत आहे. अर्जासोबत आवश्यक असलेली सर्व कागदपत्रे जोडली आहेत.',
      numberedPoints: [
        { id: '1', text: 'आधार कार्ड व रेशन कार्ड छायांकित प्रत.' },
        { id: '2', text: 'स्वयंघोषणा पत्र व तलाठी अहवाल.' }
      ],
      copiesTo: [],
      closing: 'आपला नम्र अर्जदार,',
      sender: {
        name: 'आनंद त्र्यंबक जोशी',
        designation: 'नागरिक',
        institution: '',
        address: 'लक्ष्मी नगर, स्टेशन रोड, परभणी.',
        mobile: '९४२००९८७६५',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'complaint_letter',
    title: 'तक्रार अर्ज',
    subtitle: 'पोलीस, नगरपालिका किंवा प्रशासकीय तक्रारीसाठी',
    description: 'पोलीस स्टेशन, महापालिका किंवा महावितरणकडे तक्रार नोंदवण्यासाठी.',
    iconName: 'AlertCircle',
    category: 'complaint',
    defaultValues: {
      templateId: 'complaint_letter',
      title: 'तक्रार अर्ज',
      outwardNo: '',
      date: getTodayFormatted(),
      topNote: 'अत्यंत महत्त्वाचे',
      recipient: {
        designation: 'मा. पोलीस निरीक्षक साहेब',
        department: 'नानल पेठ पोलीस स्टेशन',
        office: 'कायदा व सुव्यवस्था शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: ' परिसरात होणाऱ्या बेकायदेशीर कृत्याबाबत व त्रासाबाबत कायदेशीर कारवाई करणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'मी खालील स्वाक्षरी करणारा तक्रारदार या अर्जाद्वारे आपणास नम्रपणे निदर्शनास आणून देतो की, आमच्या परिसरात मागील काही दिवसांपासून असामाजिक घटकांचा त्रास अत्यंत वाढला आहे.\n\nयाबाबत स्थानिक नागरिकांमध्ये भीतीचे वातावरण असून शांतता व सुरक्षिततेचा प्रश्न निर्माण झाला आहे. तरी आपण या प्रकरणी त्वरित दखल घेऊन योग्य ती कायदेशीर कारवाई करावी ही नम्र विनंती.',
      numberedPoints: [
        { id: '1', text: 'रात्रीच्या वेळी परिसरात गस्त वाढवण्यात यावी.' },
        { id: '2', text: 'संशयित व्यक्तींची चौकशी करण्यात यावी.' }
      ],
      copiesTo: [
        'मा. पोलीस अधीक्षक साहेब, जिल्हा परभणी'
      ],
      closing: 'आपला नम्र,',
      sender: {
        name: 'सुरेश वामनराव देशपांडे',
        designation: 'रहिवासी प्रतिनिधी',
        institution: 'नागरी हक्क समिती',
        address: 'गांधी नगर, गल्ली क्र. ३, परभणी.',
        mobile: '९८२३५४४३२१',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'education_letter',
    title: 'शिक्षण विभाग पत्र',
    subtitle: 'शिक्षणाधिकारी, बी.ई.ओ. व शालेय पत्रांसाठी',
    description: 'प्राथमिक/माध्यमिक शिक्षण विभाग, वेतन पथक व अनुदान पत्रांसाठी.',
    iconName: 'GraduationCap',
    category: 'education',
    defaultValues: {
      templateId: 'education_letter',
      title: 'शिक्षण विभाग पत्र',
      outwardNo: 'जा.क्र./शाळा/२०२५-२६/८९',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. शिक्षणाधिकारी (माध्यमिक)',
        department: 'शिक्षण विभाग, जिल्हा परिषद',
        office: 'माध्यमिक शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'शाळेतील कर्मचाऱ्यांचे थकीत वेतन व पदमान्यता मंजुरी बाबत...',
      references: [
        '१. शासन परिपत्रक क्र. एसएससी/२०२३/प्र.क्र.१०९/',
        '२. आपले कायार्लयीन पत्र दिनांक १० जानेवारी २०२५.'
      ],
      greeting: 'महोदय,',
      body: 'सविनय सादर करण्यात येते की, आमच्या विद्यालयातील कार्यरत शिक्षकांच्या नियमित वेतन व सुधारित सेवा संदर्भातील प्रस्ताव आपल्या कार्यालयाकडे मंजुरीसाठी प्रलंबित आहे.\n\nसदर प्रस्तावातील सर्व आवश्यक कागदपत्रांची व त्रुटींची पूर्तता करण्यात आली आहे. तरी सदर प्रस्तावास लवकरात लवकर मंजुरी मिळून थकीत वेतन अदा करण्यात यावे ही नम्र विनंती.',
      numberedPoints: [
        { id: '1', text: 'कर्मचाऱ्यांचे सेवापुस्तक व सेवा पट पडताळणी पूर्ण झाली आहे.' },
        { id: '2', text: 'वेतन पथकाचा पडताळणी अहवाल सोबत जोडला आहे.' }
      ],
      copiesTo: [
        'मा. शिक्षण उपसंचालक, विभाग छत्रपती संभाजीनगर',
        'मा. शिक्षण विस्तार अधिकारी, गट संसाधन केंद्र'
      ],
      closing: 'आपला विश्वासू,',
      sender: {
        name: 'मोहम्मद मुश्ताक अहमद',
        designation: 'संस्थेचे सचिव / मुख्याध्यापक',
        institution: 'कामेल उर्दू हायस्कूल',
        address: 'जवळ पाण्याची टाकी, युसुफ कॉलनी, परभणी.',
        mobile: '९४२१४८८१११',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'school_letter',
    title: 'शाळेचे पत्र / संस्था पत्र',
    subtitle: 'मुख्याध्यापक व संस्था चालकांसाठी',
    description: 'शाळा व्यवस्थापन, पालक-शिक्षक संघ व स्थानिक प्राधिकरणासाठी पत्र.',
    iconName: 'School',
    category: 'education',
    defaultValues: {
      templateId: 'school_letter',
      title: 'शाळेचे पत्र',
      outwardNo: 'जा.क्र./विज्ञा/२०२५/४५',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. मुख्याध्यापक / व्यवस्थापक',
        department: 'विद्या प्रसारक मंडळ',
        office: 'प्रशासकीय इमारत',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'शालेय क्रीडा व सांस्कृतिक कार्यक्रमाच्या आयोजनास परवानगी मिळणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'आपणास नम्रपूर्वक कळविण्यात येते की, आमच्या शाळेत दरवर्षीप्रमाणे यावर्षीही वार्षिक क्रीडा स्पर्धा व पारितोषिक वितरण समारंभाचे आयोजन करण्यात येत आहे.\n\nसदर कार्यक्रमासाठी मैदानाची दुरुस्ती व ध्वनिक्षेपक वापराची परवानगी मिळण्यासाठी हा अर्ज सादर केला आहे.',
      numberedPoints: [
        { id: '1', text: 'कार्यक्रम दिनांक २५ ते २७ नोव्हेंबर दरम्यान प्रस्तावित आहे.' },
        { id: '2', text: 'विद्यार्थी व पालकांची उपस्थिती अपेक्षित आहे.' }
      ],
      copiesTo: [],
      closing: 'आपला विश्वासू,',
      sender: {
        name: 'प्रकाश एकनाथराव कदम',
        designation: 'क्रीडा शिक्षक / सांस्कृतिक प्रमुख',
        institution: 'छत्रपती शिवाजी विद्यालय',
        address: 'विद्या नगर, परभणी.',
        mobile: '९७६५४३२१०९',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'permission_request',
    title: 'परवानगी अर्ज',
    subtitle: 'सार्वजनिक कार्यक्रम, ध्वनिक्षेपक व मिरवणूक परवानगी',
    description: 'पोलीस किंवा नगरपालिकेकडून सार्वजनिक कार्यक्रमासाठी ना-हरकत/परवानगी.',
    iconName: 'CheckSquare',
    category: 'request',
    defaultValues: {
      templateId: 'permission_request',
      title: 'परवानगी अर्ज',
      outwardNo: 'जा.क्र./स्वारी/२०२५-२६/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. पोलीस निरीक्षक साहेब',
        department: 'नानल पेठ पोलीस स्टेशन',
        office: 'परवानगी शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'धार्मिक / सांस्कृतिक कार्यक्रमासाठी व ध्वनिक्षेपक वापरासाठी परवानगी मिळणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'वरील विषयानुसार आपणास विनंती करण्यात येते की, आमच्या नोंदणीकृत संस्थेच्या वतीने दरवर्षीप्रमाणे यावर्षीही धार्मिक व सांस्कृतिक कार्यक्रमाचे आयोजन करण्यात आले आहे.\n\nसदर कार्यक्रमात भाविकांना दर्शनाची सोय करण्यासाठी व कायदा सुव्यवस्था अबाधित ठेवून शांततेत कार्यक्रम पार पाडण्यासाठी आवश्यक ती ध्वनिक्षेपक परवानगी व सहकार्य देण्यात यावे ही नम्र विनंती.',
      numberedPoints: [
        { id: '1', text: 'कार्यक्रम दिनांक २७ जून ते ०६ जुलै पर्यंत आयोजित केला आहे.' },
        { id: '2', text: 'ध्वनिक्षेपकाचा वापर शासन नियमानुसार व ठरवून दिलेल्या मर्यादेतच होईल.' }
      ],
      copiesTo: [
        'मा. जिल्हाधिकारी साहेब, परभणी',
        'मा. उपविभागीय अधिकारी, परभणी'
      ],
      closing: 'आपला विश्वासू,',
      sender: {
        name: 'मुश्ताक आली शाह',
        designation: 'मुतावल्ली व अध्यक्ष',
        institution: 'आशूरखाना नाले हैदर ट्रस्ट',
        address: 'लोकमान्य टिळक रोड, परभणी.',
        mobile: '९४२१४८८१११',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'leave_application',
    title: 'रजा अर्ज',
    subtitle: 'शासकीय व खाजगी कर्मचाऱ्यांसाठी रजेचा अर्ज',
    description: 'वैद्यकीय, नैमित्तिक किंवा अर्जित रजेसाठी वरिष्ठांकडे सादर करावयाचा अर्ज.',
    iconName: 'Calendar',
    category: 'application',
    defaultValues: {
      templateId: 'leave_application',
      title: 'रजा अर्ज',
      outwardNo: '',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. मुख्याध्यापक / वरिष्ठ अधिकारी साहेब',
        department: 'प्रशासकीय विभाग',
        office: 'कार्यालयीन शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'वैयक्तिक कारणास्तव ३ दिवसांची नैमित्तिक रजा मिळणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'मी खालील सही करणार आपणास सविनय विनंती करतो की, माझ्या घरगुती व वैयक्तिक अत्यंत महत्त्वाच्या कामासाठी मला दिनांक १५ जून ते १७ जून (एकूण ३ दिवस) कार्यालयात उपस्थित राहता येणार नाही.\n\nसदर कालावधीत माझ्या ताब्यातील तातडीचे काम सहकारी कर्मचाऱ्यांकडे सोपवले आहे. तरी मला सदर ३ दिवसांची नैमित्तिक रजा मंजूर करावी ही नम्र विनंती.',
      numberedPoints: [],
      copiesTo: [],
      closing: 'आपला नम्र सेवक,',
      sender: {
        name: 'गोपाळ कृष्णराव कुलकर्णी',
        designation: 'वरिष्ठ लिपिक',
        institution: 'जिल्हा परिषद कार्यालय',
        address: 'स्टेशन रोड, परभणी.',
        mobile: '९८२२३३४४५५',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'reminder_letter',
    title: 'स्मरणपत्र (Reminder)',
    subtitle: 'प्रलंबित अर्जावर स्मरणपत्र पाठवण्यासाठी',
    description: 'पूर्वी पाठवलेल्या पत्रावर कारवाई न झाल्यास वरिष्ठांना स्मरणपत्र (स्मरणपत्र-१/२/३).',
    iconName: 'Clock',
    category: 'official',
    defaultValues: {
      templateId: 'reminder_letter',
      title: 'स्मरणपत्र',
      outwardNo: 'जा.क्र./स्मरण-३/२०२५/',
      date: getTodayFormatted(),
      topNote: 'स्मरणपत्र-३',
      recipient: {
        designation: 'मा. विशेष पोलीस महानिरीक्षक साहेब',
        department: 'नांदेड परिक्षेत्र कार्यालय',
        office: 'चौकशी व तक्रार निवारण शाखा',
        placeWithPincode: 'नांदेड - ४३१६०३.',
      },
      subject: 'पूर्वी सादर केलेल्या तक्रार अर्जावर चौकशी करून त्वरित कारवाई करणे बाबत...',
      references: [
        '१. माझे मूळ पत्र दिनांक २१.११.२०२२',
        '२. माझे स्मरणपत्र क्र. २ दिनांक २७.०३.२०२५'
      ],
      greeting: 'महोदय,',
      body: 'उपरोक्त विषयी व संदर्भांकित पत्रांनुसार आपणास पुन्हा स्मरण देण्यात येते की, मी सादर केलेल्या तक्रार अर्जावर स्थानिक पातळीवर अद्याप कोणतीही समाधानकारक चौकशी झालेली नाही.\n\nदीर्घ काळ लोटूनही प्रकरण प्रलंबित राहिल्याने न्याय मिळण्यास विलंब होत आहे. तरी कृपया या प्रकरणात व्यक्तिशः लक्ष घालून त्वरित योग्य ती कारवाई करण्याचे निर्देश द्यावेत ही नम्र विनंती.',
      numberedPoints: [
        { id: '1', text: 'सदर प्रकरणातील संबंधित अधिकाऱ्यांचा अहवाल मागवण्यात यावा.' },
        { id: '2', text: 'चौकशीचा सविस्तर अहवाल तक्रारदारास पुरवण्यात यावा.' }
      ],
      copiesTo: [
        'मा. पोलीस अधीक्षक साहेब, परभणी'
      ],
      closing: 'आपला विश्वासू,',
      sender: {
        name: 'मोहम्मद मुश्ताक अहमद',
        designation: 'तक्रारदार / सचिव',
        institution: 'कामेल उर्दू हायस्कूल',
        address: 'युसुफ कॉलनी, परभणी.',
        mobile: '९४२१४८८१११',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'appeal_letter',
    title: 'अपील पत्र / पुनर्याचिका',
    subtitle: 'निर्णयाविरुद्ध वरिष्ठ अधिकाऱ्यांकडे अपील',
    description: 'प्रशासकीय किंवा विभागीय निर्णयाविरुद्ध वरिष्ठ प्राधिकरणाकडे पुनर्विलोकनासाठी पत्र.',
    iconName: 'ShieldAlert',
    category: 'official',
    defaultValues: {
      templateId: 'appeal_letter',
      title: 'अपील पत्र',
      outwardNo: 'जा.क्र./अपील/२०२५/१२',
      date: getTodayFormatted(),
      topNote: 'अपील अर्ज',
      recipient: {
        designation: 'मा. विभागीय आयुक्त साहेब',
        department: 'महसूल विभाग',
        office: 'विभागीय आयुक्त कार्यालय',
        placeWithPincode: 'छत्रपती संभाजीनगर - ४३१००१.',
      },
      subject: 'उपविभागीय अधिकारी यांच्या आदेशाविरुद्ध प्रथम अपील सादर करणे बाबत...',
      references: [
        '१. उपविभागीय अधिकारी परभणी यांचा आदेश क्र. महसूल/२०२४/४५६ दिनांक १० मे २०२४.'
      ],
      greeting: 'महोदय,',
      body: 'मी खालील नमूद अपीलाथी या अर्जाद्वारे आपणाकडे प्रथम अपील सादर करत आहे. कनिष्ठ प्राधिकरणाने दिलेला आदेश वस्तुस्थितीस व कायद्याच्या तरतुदीस धरून नाही.\n\nसदर आदेशामुळे माझ्यावर अन्याय झाला असून तो रद्द करून न्याय मिळणे आवश्यक आहे. अपीलातील सर्व मुद्दे सविस्तर खालीलप्रमाणे मांडण्यात आले आहेत.',
      numberedPoints: [
        { id: '1', text: 'कनिष्ठ अधिकाऱ्यांनी सादर केलेल्या पुराव्यांचा योग्य विचार केला नाही.' },
        { id: '2', text: 'अपीलार्थीची बाजू मांडण्याची पुरेशी संधी देण्यात आली नाही.' }
      ],
      copiesTo: [],
      closing: 'आपला विश्वासू अपीलार्थी,',
      sender: {
        name: 'विश्वनाथ बळीराम काळे',
        designation: 'अपीलार्थी',
        institution: '',
        address: 'मु.पो. जिंतूर, जि. परभणी.',
        mobile: '९८९०१२३४५६',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'request_letter',
    title: 'विनंती पत्र / सहकार्य पत्र',
    subtitle: 'सुविधा, दुरुस्ती व सहकार्यासाठी अधिकृत पत्र',
    description: 'रस्ते, वीज, पाणी व नागरी सुविधांच्या दुरुस्तीसाठी लोकप्रतिनिधी किंवा प्रशासनाला पत्र.',
    iconName: 'HeartHandshake',
    category: 'request',
    defaultValues: {
      templateId: 'request_letter',
      title: 'विनंती पत्र',
      outwardNo: '',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. आयुक्त / मुख्याधिकारी साहेब',
        department: 'नगर परिषद कार्यालय',
        office: 'आरोग्य व पाणीपुरवठा विभाग',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'आमच्या परिसरात नवीन पिण्याच्या पाण्याची पाईपलाईन टाकणे बाबत...',
      references: [],
      greeting: 'महोदय,',
      body: 'आम्ही खालील सही करणारे सर्व नागरिक आपल्या नगर परिषदेच्या प्रभागातील रहिवासी आहोत. आमच्या गल्लीत मागील अनेक महिन्यांपासून पिण्याच्या पाण्याचा प्रश्न गंभीर बनला आहे.\n\nजुन्या पाईपलाईन खराब झाल्यामुळे गढूळ पाणी येत असून आरोग्य धोक्यात आले आहे. तरी त्वरित नवीन पाईपलाईन मंजूर करून कामाला सुरुवात करावी ही नम्र विनंती.',
      numberedPoints: [
        { id: '1', text: 'सुमारे ५०० रहिवाशांना याचा फायदा होईल.' },
        { id: '2', text: 'आरोग्याचा प्रश्न लक्षात घेता कामाला प्राधान्य देण्यात यावे.' }
      ],
      copiesTo: [
        'मा. नगरसेवक / लोकप्रतिनिधी, संबंधित प्रभाग'
      ],
      closing: 'आपले नम्र रहिवासी,',
      sender: {
        name: 'सुभाष दगडूजी शिंदे',
        designation: 'अध्यक्ष',
        institution: 'विकासनगर रहिवासी संघ',
        address: 'विकासनगर, गल्ली क्र. २, परभणी.',
        mobile: '९८२२९८७६५४',
      },
      useLetterhead: false,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'kamel_highschool',
    title: 'कामेल उर्दू हायस्कूल शालेय पत्र',
    subtitle: 'Kamel Urdu High School (KES) Official Later Pad',
    description: 'कामेल उर्दू हायस्कूल, परभणी यांच्या अधिकृत लेटरपॅड व मुख्याध्यापक शिक्क्यासह.',
    iconName: 'GraduationCap',
    category: 'education',
    defaultValues: {
      templateId: 'kamel_highschool',
      title: 'कामेल हायस्कूल अधिकृत पत्र',
      outwardNo: 'जा. क्र. KES/2024-25/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. शिक्षणाधिकारी (माध्यमिक) साहेब',
        department: 'जिल्हा परिषद शिक्षण विभाग',
        office: 'माध्यमिक शिक्षण शाखा',
        placeWithPincode: 'परभणी - ४३१४०१.',
      },
      subject: 'शाळेतील भौतिक सुविधा व शैक्षणिक अहवाल सादर करणे बाबत...',
      references: [
        '१. आपले परिपत्रक जा.क्र. जिप/शिक्षण/२०२४-२५/.'
      ],
      greeting: 'महोदय,',
      body: 'सविनय सादर करण्यात येते की, कामेल उर्दू हायस्कूल, युसुफ कॉलनी, वांगी रोड, परभणी येथे शैक्षणिक वर्ष २०२४-२५ चे कामकाज सुरळीत सुरू आहे.\n\nशाळेत विद्यार्थ्यांच्या सर्वांगीण विकासासाठी आवश्यक असणारे उपक्रम राबविण्यात आले असून त्याचा सविस्तर अहवाल माहिती व पुढील कार्यवाहीस्तव सादर करण्यात येत आहे.',
      numberedPoints: [
        { id: '1', text: 'विद्यार्थी पटसंख्या व उपस्थिती समाधानकारक आहे.' },
        { id: '2', text: 'डिजिटल वर्गखोल्या व प्रयोगशाळेचे काम पूर्ण झाले आहे.' },
        { id: '3', text: 'शालेय पोषण आहार नियमानुसार नियमित दिला जात आहे.' }
      ],
      copiesTo: [
        'मा. शिक्षण उपसंचालक, छत्रपती संभाजीनगर विभाग',
        'संस्था दप्तर प्रत'
      ],
      closing: 'आपला नम्र,',
      sender: {
        name: '',
        designation: 'मुख्याध्यापक',
        institution: 'कामेल उर्दू हायस्कूल',
        address: 'युसुफ कॉलनी, वांगी रोड, परभणी (महाराष्ट्र) ४३१४०१',
        mobile: '९४२१४८८१११',
        email: 'kamelngo@gmail.com',
      },
      useLetterhead: true,
      letterhead: OFFICIAL_LETTERHEAD_PRESETS[0],
      stampUrl: '/signatures/HM.png',
      stampName: 'मुख्याध्यापक शिक्का (HM Stamp)',
      stampWidth: 110,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'kamel_education_society',
    title: 'कामेल एज्युकेशन सोसायटी पत्र',
    subtitle: 'Kamel Education Society Official Later Pad & Stamp',
    description: 'कामेल एज्युकेशन सोसायटी, परभणी लेटरपॅड व अध्यक्ष/सचिव शिक्का.',
    iconName: 'Building2',
    category: 'official',
    defaultValues: {
      templateId: 'kamel_education_society',
      title: 'कामेल एज्युकेशन सोसायटी अधिकृत पत्र',
      outwardNo: 'जा.क्र./ KES/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. धर्मादाय आयुक्त / संबंधित अधिकारी',
        department: 'धर्मादाय आयुक्त कार्यालय / शिक्षण संचालनालय',
        office: 'प्रशासन शाखा',
        placeWithPincode: 'परभणी / पुणे.',
      },
      subject: 'संस्थेच्या वार्षिक कामकाजाचा अहवाल व ठराव सादर करणे बाबत...',
      references: [
        '१. नोंदणी क्र. F.3098, MAH/55/97.'
      ],
      greeting: 'महोदय,',
      body: 'सविनय सादर करण्यात येते की, कामेल एज्युकेशन सोसायटी परभणी (अल्पसंख्याक संस्था क्र. M.E.S 2014/Pra. No. 169/ka.5) यांच्या नियामक मंडळाची बैठक नुकतीच पार पडली.\n\nसदर बैठकीत संस्थेच्या अंतर्गत सुरू असलेल्या शिक्षण संस्थांच्या प्रगतीचा आढावा घेण्यात आला असून सर्व संमत ठराव माहिती व मान्यतेसाठी सादर करीत आहोत.',
      numberedPoints: [
        { id: '1', text: 'वार्षिक लेखापरीक्षण (Audit Report) अहवाल सोबत संलग्न आहे.' },
        { id: '2', text: 'नूतन कार्यकारिणी यादी व ठरावाची प्रत सादर केली आहे.' }
      ],
      copiesTo: [
        'मा. सहाय्यक धर्मादाय आयुक्त, परभणी',
        'संस्था दप्तर प्रत'
      ],
      closing: 'आपला नम्र,',
      sender: {
        name: '',
        designation: 'अध्यक्ष',
        institution: 'कामेल एज्युकेशन सोसायटी',
        address: 'युसुफ कॉलनी, वांगी रोड, परभणी (महाराष्ट्र) ४३१४०१',
        mobile: '९४२१४८८१११',
        email: 'kamelngo@gmail.com',
      },
      useLetterhead: true,
      letterhead: OFFICIAL_LETTERHEAD_PRESETS[1],
      stampUrl: '/signatures/अध्यक्ष.png',
      stampName: 'अध्यक्ष शिक्का (President Stamp)',
      stampWidth: 140,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  },
  {
    id: 'ashoorkhana_naale_hyder',
    title: 'आशूरखाना नाले हैदर संस्थान पत्र',
    subtitle: 'AshoorKhana Naale Hyder Official Later Pad',
    description: 'आशूरखाना नाले हैदर, मस्जिद मेहताब अली शाह, दर्गा व बारदारी अधिकृत पत्र.',
    iconName: 'Scroll',
    category: 'official',
    defaultValues: {
      templateId: 'ashoorkhana_naale_hyder',
      title: 'आशूरखाना नाले हैदर अधिकृत पत्र',
      outwardNo: 'जा.क्र. ANH/PBN/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: 'मा. मुख्य कार्यकारी अधिकारी साहेब',
        department: 'महाराष्ट्र राज्य वक्फ मंडळ',
        office: 'मुख्यालय / विभागीय कार्यालय',
        placeWithPincode: 'छत्रपती संभाजीनगर / परभणी.',
      },
      subject: 'वक्फ नोंदणी क्र. MSBW/PBN/47/2010 अंतर्गत संस्थेचे पत्र...',
      references: [
        '१. वक्फ नोंदणी क्र. MSBW/PBN/47/2010.'
      ],
      greeting: 'महोदय,',
      body: 'सविनय सादर करण्यात येते की, आशूरखाना नाले हैदर, मस्जिद मेहताब अली शाह, कब्रस्तान व नक्कार खाना बारदारी, परभणी येथील धार्मिक व सामाजिक व्यवस्थापन योग्य रीतीने चालविले जात आहे.\n\nसंस्थेच्या परिसरातील देखरेख, दुरुस्ती व धार्मिक विधी सुरळीत पार पाडण्याबाबत खालीलप्रमाणे सविस्तर माहिती सादर करण्यात येत आहे.',
      numberedPoints: [
        { id: '1', text: 'परिसराची नियमित स्वच्छता व देखभाल करण्यात येत आहे.' },
        { id: '2', text: 'धार्मिक कार्यक्रमांचे योग्य नियोजन करण्यात आले आहे.' }
      ],
      copiesTo: [
        'मा. वक्फ अधिकारी, जिल्हा वक्फ कार्यालय, परभणी',
        'दप्तर प्रत'
      ],
      closing: 'आपला नम्र,',
      sender: {
        name: 'मुश्ताक अली शाह',
        designation: 'सज्जादा नशीन व मुतवल्ली',
        institution: 'आशूरखाना नाले हैदर, मस्जिद मेहताब अली शाह',
        address: 'कार्यालय: लोकमान्य टिळक रोड, परभणी.',
        mobile: '+९१ ९४२१४८८१११, ९११९४८८१११',
        email: 'anhparbhani123@gmail.com',
      },
      useLetterhead: true,
      letterhead: OFFICIAL_LETTERHEAD_PRESETS[2],
      stampUrl: '/signatures/aadhyaksh.png',
      stampName: 'अध्यक्ष स्वाक्षरी व शिक्का',
      stampWidth: 130,
      formatting: defaultFormatting,
      pageSettings: defaultPageSettings,
    }
  }
];
