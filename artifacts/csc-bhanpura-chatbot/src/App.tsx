import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSendChat } from '@workspace/api-client-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BadgeInfo,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  FileCheck2,
  FileText,
  GraduationCap,
  IdCard,
  IndianRupee,
  Landmark,
  MapPin,
  MessageCircle,
  PhoneCall,
  Printer,
  RotateCcw,
  ScanLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stamp,
  UserRound,
  Vote,
} from 'lucide-react';

type Message = {
  id: number;
  from: 'bot' | 'user';
  text: string;
  steps?: string[];
  quickReplies?: string[];
};

type Language = 'hindi' | 'english';

type Service = {
  label: Record<Language, string>;
  prompt: Record<Language, string>;
  icon: typeof FileText;
  tint: string;
};

const queryClient = new QueryClient();

const LOCATION = 'Yadav Chopal, Bhanpura Gaav, Haryana';
const CENTER_NOTE =
  'Aap apna kaam khud online karne ki zaroorat nahi hai — CSC Bhanpura centre par aakar staff se karwa sakte hain.';

const uiCopy: Record<Language, {
  welcome: string;
  welcomeSteps: string[];
  welcomeReplies: string[];
  helpDesk: string;
  you: string;
  sidebarEyebrow: string;
  safeHelpTitle: string;
  safeHelpBody: string;
  today: string;
  quickServices: string;
  inputLabel: string;
  inputPlaceholder: string;
  sendLabel: string;
  safety: string;
  allServices: string;
  serviceQuestion: string;
  beforeVisit: string;
  beforeVisitBody: string;
  generalGuidance: string;
  errorText: string;
  errorSteps: string[];
}> = {
  hindi: {
    welcome: 'नमस्ते। मैं CSC भानपुरा का डिजिटल हेल्प डेस्क हूँ। आपको अपना ऑनलाइन या सरकारी काम खुद करने की जरूरत नहीं है — सेंटर पर आकर स्टाफ से करवा सकते हैं। मैं बताऊंगा कि कौन से दस्तावेज साथ लाने हैं।',
    welcomeSteps: ['नीचे अपनी सेवा चुनें या अपना काम सीधे लिखें।', 'CSC भानपुरा सेंटर पर आकर फॉर्म, आवेदन, भुगतान या प्रिंट का काम स्टाफ से करवाएं।'],
    welcomeReplies: ['ऑनलाइन फॉर्म भरवाना है', 'आधार का काम है', 'सर्टिफिकेट बनवाना है'],
    helpDesk: 'CSC हेल्प डेस्क',
    you: 'आप',
    sidebarEyebrow: 'आप यहां पूछ सकते हैं',
    safeHelpTitle: 'सीधी और सुरक्षित मदद',
    safeHelpBody: 'OTP, PIN या पासवर्ड किसी के साथ साझा न करें। अंतिम मंजूरी हमेशा सरकारी विभाग की होती है।',
    today: 'आज की सेवा',
    quickServices: 'जल्दी से सेवा चुनें',
    inputLabel: 'अपना सवाल लिखें',
    inputPlaceholder: 'अपना सवाल लिखें — जैसे “PAN का काम करवाना है”',
    sendLabel: 'सवाल भेजें',
    safety: 'OTP/PIN चैट में कभी न लिखें। सही शुल्क, दस्तावेज और मंजूरी CSC भानपुरा या आधिकारिक पोर्टल से पक्की होगी।',
    allServices: 'सभी सेवाएं',
    serviceQuestion: 'आपको किस काम में मदद चाहिए?',
    beforeVisit: 'सेंटर आने से पहले',
    beforeVisitBody: 'अपना काम और दस्तावेज पहले पूछ लें। इससे आपकी यात्रा आसान रहेगी।',
    generalGuidance: 'यह हेल्प डेस्क सामान्य जानकारी देता है। अंतिम मंजूरी CSC के हाथ में नहीं होती।',
    errorText: 'AI जवाब अभी उपलब्ध नहीं है। आप अपना सवाल दोबारा भेजें या CSC भानपुरा से सीधे संपर्क करके सेवा पक्की कर लें।',
    errorSteps: ['OTP, PIN या पासवर्ड चैट में साझा न करें।', 'सही शुल्क और जरूरत CSC भानपुरा या आधिकारिक पोर्टल से पक्की होगी।'],
  },
  english: {
    welcome: 'Hello. I am the CSC Bhanpura digital help desk. You do not need to complete your online or government work yourself — visit the centre and get it done with staff. I can tell you which documents to bring.',
    welcomeSteps: ['Choose a service below or type your work directly.', 'Visit CSC Bhanpura to get forms, applications, payments, or printing done with staff help.'],
    welcomeReplies: ['Get an online form filled', 'Aadhaar work', 'Get a certificate made'],
    helpDesk: 'CSC help desk',
    you: 'You',
    sidebarEyebrow: 'You can ask about',
    safeHelpTitle: 'Clear and safe help',
    safeHelpBody: 'Never share an OTP, PIN, or password. Final approval always comes from the government department.',
    today: "Today's service",
    quickServices: 'Choose a service quickly',
    inputLabel: 'Write your question',
    inputPlaceholder: 'Write your question — e.g. “I need help with PAN”',
    sendLabel: 'Send question',
    safety: 'Never write an OTP/PIN in chat. Confirm exact fees, requirements, and approval with CSC Bhanpura or the official portal.',
    allServices: 'All services',
    serviceQuestion: 'What work do you need help with?',
    beforeVisit: 'Before visiting the centre',
    beforeVisitBody: 'Ask about your work and documents first. It will make your visit easier.',
    generalGuidance: 'This help desk provides general guidance. Final approval is not handled by CSC.',
    errorText: 'The AI response is temporarily unavailable. Please send your question again or contact CSC Bhanpura directly to confirm the service.',
    errorSteps: ['Never share an OTP, PIN, or password in chat.', 'Confirm exact fees and requirements with CSC Bhanpura or the official portal.'],
  },
};

function createInitialMessage(language: Language): Message {
  const copy = uiCopy[language];
  return {
    id: 1,
    from: 'bot',
    text: copy.welcome,
    steps: copy.welcomeSteps,
    quickReplies: copy.welcomeReplies,
  };
}

const services: Service[] = [
  { label: { hindi: 'फॉर्म और आवेदन', english: 'Forms & applications' }, prompt: { hindi: 'ऑनलाइन फॉर्म भरवाना है', english: 'I need help with an online form' }, icon: FileText, tint: 'service-sun' },
  { label: { hindi: 'सर्टिफिकेट', english: 'Certificates' }, prompt: { hindi: 'सर्टिफिकेट बनवाना है', english: 'I need a certificate' }, icon: Stamp, tint: 'service-mint' },
  { label: { hindi: 'नौकरी और परीक्षा', english: 'Jobs & exams' }, prompt: { hindi: 'जॉब फॉर्म या परीक्षा फॉर्म भरवाना है', english: 'I need help with a job or exam form' }, icon: BriefcaseBusiness, tint: 'service-coral' },
  { label: { hindi: 'स्कॉलरशिप', english: 'Scholarships' }, prompt: { hindi: 'स्कॉलरशिप का काम है', english: 'I need help with a scholarship' }, icon: GraduationCap, tint: 'service-lilac' },
  { label: { hindi: 'आधार का काम', english: 'Aadhaar guidance' }, prompt: { hindi: 'आधार का काम है', english: 'I need Aadhaar help' }, icon: IdCard, tint: 'service-aqua' },
  { label: { hindi: 'PAN कार्ड', english: 'PAN card' }, prompt: { hindi: 'PAN कार्ड का काम करवाना है', english: 'I need help with PAN card work' }, icon: FileCheck2, tint: 'service-rose' },
  { label: { hindi: 'वोटर सेवाएं', english: 'Voter services' }, prompt: { hindi: 'वोटर ID का काम है', english: 'I need voter ID help' }, icon: Vote, tint: 'service-sand' },
  { label: { hindi: 'प्रिंट, स्कैन और PDF', english: 'Print, scan & PDF' }, prompt: { hindi: 'फोटो स्कैन और प्रिंट करवाना है', english: 'I need printing, scanning, or PDF work' }, icon: Printer, tint: 'service-blue' },
];

function answerFor(question: string): Omit<Message, 'id' | 'from'> {
  const text = question.toLowerCase().trim();
  const common = `\n\n${CENTER_NOTE}`;

  if (/aadhaar|aadhar|आधार/.test(text)) {
    return {
      text: `Aadhaar update, download, print ya status check ka kaam CSC Bhanpura centre par aakar staff se karwa sakte hain. OTP ya biometric ki zaroorat service par depend karegi.${common}`,
      steps: [
        'Aadhaar number ya enrolment details saath lekar centre par aayen.',
        'Registered mobile saath rakhein; OTP centre par aap khud enter karenge.',
        'Jahan biometric lage, verification centre par hi hoga.',
        'Exact requirement, fee aur approval CSC Bhanpura par confirm hoga.',
      ],
      quickReplies: ['Aadhaar update ke liye kya chahiye?', 'Aadhaar print karna hai'],
    };
  }

  if (/pan|पैन/.test(text)) {
    return {
      text: `PAN card application ya correction ka kaam CSC Bhanpura centre par aakar staff se karwa sakte hain. Staff form, document upload aur acknowledgement mein madad karega; final approval Income Tax department ka hota hai.${common}`,
      steps: [
        'Identity aur address proof ki clear copy lekar centre par aayen.',
        'Apna active mobile number saath rakhein.',
        'Photo/signature available ho to saath laayen; format centre par confirm hoga.',
        'Exact fee aur documents CSC Bhanpura par confirm honge.',
      ],
      quickReplies: ['PAN ke liye documents?', 'PAN correction karni hai'],
    };
  }

  if (/voter|मतदाता|election|epic/.test(text)) {
    return {
      text: `Voter ID ka new registration, correction, address shift ya status check ka kaam CSC Bhanpura centre par aakar staff se karwa sakte hain. Eligibility aur approval Election Commission ka hota hai.${common}`,
      steps: [
        'Naam, janam-tithi aur current address ki details saath lekar aayen.',
        'Identity ya residence proof ki clear copy saath rakhein.',
        'Purana voter ID ya reference number ho to saath laayen.',
        'Exact documents aur timeline CSC Bhanpura par confirm hongi.',
      ],
      quickReplies: ['Naya voter ID banana hai', 'Voter ID correction'],
    };
  }

  if (/certificate|प्रमाण|income|जाति|caste|residence|domicile|birth|death/.test(text)) {
    return {
      text: `Income, caste, residence aur doosre certificate ka application CSC Bhanpura centre par aakar staff se karwa sakte hain. Certificate issue sambandhit sarkari department ki approval par depend karta hai.${common}`,
      steps: [
        'Jis certificate ka kaam hai, uska naam bata kar centre par aayen.',
        'Aadhaar, address proof aur supporting document ki clear copy saath rakhein.',
        'OTP ya verification centre par aapki sahmati se hoga.',
        'Exact documents, fee aur processing time CSC Bhanpura par confirm honge.',
      ],
      quickReplies: ['Income certificate', 'Caste certificate', 'Residence certificate'],
    };
  }

  if (/scholarship|छात्रवृत्ति| छात्रवृत्ति|scholar/.test(text)) {
    return {
      text: `Scholarship application ka registration, form filling aur document upload CSC Bhanpura centre par aakar staff se karwa sakte hain. Eligibility aur approval scheme ke department ka hota hai.${common}`,
      steps: [
        'Student details, school/college details aur active mobile saath rakhein.',
        'Aadhaar, income certificate, marksheet ya doosre papers saath laayen.',
        'Bank details ki zaroorat ho sakti hai; ise chat mein share na karein.',
        'Form submit karne se pehle details aapke saamne verify ki jayengi.',
      ],
      quickReplies: ['Scholarship documents?', 'Scholarship status check'],
    };
  }

  if (/job|naukri|रोजगार|exam|pariksha|भर्ती|recruitment|admit/.test(text)) {
    return {
      text: `Job, recruitment ya exam form bharne ka kaam CSC Bhanpura centre par aakar staff se karwa sakte hain. Vacancy ki eligibility, fee aur deadline official notification ke hisaab se confirm hogi.${common}`,
      steps: [
        'Official notification ya application link ho to saath lekar aayen.',
        'Photo, signature, ID proof aur qualification documents saath rakhein.',
        'Naam, category aur date of birth ki details centre par verify karenge.',
        'Payment ke baad acknowledgement/receipt centre se lein.',
      ],
      quickReplies: ['Job form bharna hai', 'Exam admit card download'],
    };
  }

  if (/admission|school|college|दाखिला|प्रवेश/.test(text)) {
    return {
      text: `School ya college admission ka online form, document upload aur status check CSC Bhanpura centre par aakar staff se karwa sakte hain. Admission rules, eligibility, fee aur dates institution ke hisaab se confirm hongi.${common}`,
      steps: [
        'Student ka naam, DOB, contact aur previous marksheet saath laayen.',
        'Photo, signature aur required certificates ki clear copies rakhein.',
        'Course aur category details centre par verify karenge.',
        'Application ke baad acknowledgement number centre se lein.',
      ],
      quickReplies: ['Admission form bharna hai', 'Documents upload help'],
    };
  }

  if (/recharge|bill|payment|bijli|electricity|mobile|रिचार्ज|भुगतान/.test(text)) {
    return {
      text: `Mobile recharge aur bill payment CSC Bhanpura centre par aakar staff se karwa sakte hain. Operator, biller aur amount aapke saamne verify karke hi payment hoga.${common}`,
      steps: [
        'Mobile number ya consumer number saath lekar centre par aayen.',
        'Amount aur biller ka naam aapke saamne confirm hoga.',
        'OTP/PIN kabhi kisi ko na batayein; payment aapki permission se hi hoga.',
        'Exact service charge, agar koi ho, CSC Bhanpura par confirm hoga.',
      ],
      quickReplies: ['Mobile recharge', 'Bijli bill payment'],
    };
  }

  if (/photo|scan|print|pdf|photocopy|दस्तावेज|document|प्रिंट/.test(text)) {
    return {
      text: `Photo, scan, photocopy, print aur PDF ka kaam CSC Bhanpura centre par aakar karwa sakte hain. Original document ya file saath laayen; staff available method se kaam kar dega.${common}`,
      steps: [
        'Original document saaf aur poora lekar centre par aayen.',
        'Required page size, copies aur colour/black-white preference bata dein.',
        'PDF banne ke baad naam aur pages aapke saamne check honge.',
        'Exact fee kaam ki quantity aur format dekhkar CSC Bhanpura confirm karega.',
      ],
      quickReplies: ['PDF banwani hai', 'Photo print karna hai'],
    };
  }

  if (/form|online|application|apply|ऑनलाइन|फॉर्म/.test(text)) {
    return {
      text: `Online form bharne ka kaam CSC Bhanpura centre par aakar staff se karwa sakte hain. Staff registration, details fill karne, document upload aur acknowledgement mein madad karega.${common}`,
      steps: [
        'Application ka official portal ya link ho to saath lekar aayen.',
        'Mobile number, email, ID aur supporting documents saath rakhein.',
        'OTP aap khud enter karein; OTP kisi ko bhi share na karein.',
        'Final submit se pehle poora form aapke saamne verify kiya jayega.',
      ],
      quickReplies: ['Job form', 'Certificate form', 'Admission form'],
    };
  }

  if (/hello|hi|namaste|नमस्ते|help|madad|सहायता/.test(text)) {
    return {
      text: `Bilkul, aap apna kaam karwane ke liye CSC Bhanpura centre par aa sakte hain. Service ka naam likh dein — jaise “PAN apply”, “certificate”, “job form” ya “Aadhaar update”.${common}`,
      quickReplies: ['Online form bharna hai', 'PAN card apply karna hai', 'Print aur PDF work'],
    };
  }

  return {
    text: 'Aap apna kaam CSC Bhanpura centre par aakar karwa sakte hain. Main forms, certificates, jobs, scholarships, admissions, PAN, Aadhaar, voter services, recharge aur print/scan work mein madad karta hoon.',
    steps: ['Aap kis service ka kaam karwana chahte hain? Service ka naam likh dein.'],
  };
}

function BrandMark() {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-[0_8px_18px_rgba(237,142,48,.26)]">
      <Landmark size={22} strokeWidth={2.1} />
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--sidebar))] bg-[hsl(var(--primary))]" />
    </div>
  );
}

function ChatBubble({ message, language, onQuickReply }: { message: Message; language: Language; onQuickReply: (value: string) => void }) {
  const isBot = message.from === 'bot';
  const copy = uiCopy[language];
  return (
    <div className={`chat-rise flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`} data-testid={`message-${message.id}`}>
      {isBot && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" aria-hidden="true">
          <MessageCircle size={16} />
        </div>
      )}
      <div className={`max-w-[min(90%,620px)] ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div className={isBot
          ? 'rounded-[4px_20px_20px_20px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] px-4 py-3.5 text-[14px] leading-6 text-[hsl(var(--foreground))] shadow-[0_7px_24px_rgba(33,38,64,.045)]'
          : 'rounded-[20px_4px_20px_20px] bg-[hsl(var(--primary))] px-4 py-3.5 text-[14px] leading-6 text-[hsl(var(--primary-foreground))] shadow-[0_8px_18px_rgba(36,119,112,.16)]'
        }>
          <p className="whitespace-pre-line">{message.text}</p>
          {message.steps && (
            <ol className="mt-3 space-y-2 border-t border-[hsl(var(--border)/.75)] pt-3 text-[13px] leading-5">
              {message.steps.map((step, index) => (
                <li key={`${message.id}-${index}`} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] font-mono text-[10px] font-medium text-[hsl(var(--foreground))]">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {isBot && message.quickReplies && (
          <div className="mt-3 flex flex-wrap gap-2" data-testid={`quick-replies-${message.id}`}>
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => onQuickReply(reply)}
                data-testid={`button-quick-reply-${reply.slice(0, 8).replace(/\s/g, '-')}`}
                className="group rounded-full border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--card))] px-3 py-1.5 text-left text-[12px] font-semibold text-[hsl(var(--primary))] transition hover:-translate-y-0.5 hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.06)]"
              >
                {reply}
                <ChevronRight className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" size={13} />
              </button>
            ))}
          </div>
        )}
        <span className={`mt-1.5 block font-mono text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] ${isBot ? 'text-left' : 'text-right'}`}>
          {isBot ? copy.helpDesk : copy.you}
        </span>
      </div>
      {!isBot && (
        <div className="mb-7 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]" aria-hidden="true">
          <UserRound size={16} />
        </div>
      )}
    </div>
  );
}

function ServiceTile({ service, language, onSelect }: { service: Service; language: Language; onSelect: (prompt: string) => void }) {
  const Icon = service.icon;
  const label = service.label[language];
  return (
    <button
      type="button"
      onClick={() => onSelect(service.prompt[language])}
      data-testid={`button-service-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
      className="group flex min-h-[100px] flex-col justify-between rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-3.5 text-left shadow-[0_5px_18px_rgba(33,38,64,.035)] transition duration-200 hover:-translate-y-1 hover:border-[hsl(var(--primary)/.35)] hover:shadow-[var(--shadow-card)]"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${service.tint} text-[hsl(var(--foreground))] transition-transform duration-200 group-hover:scale-105`}>
        <Icon size={18} strokeWidth={1.9} />
      </span>
      <span className="mt-3 text-[12px] font-semibold leading-4 text-[hsl(var(--foreground))]">{label}</span>
    </button>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>('hindi');
  const [messages, setMessages] = useState<Message[]>([createInitialMessage('hindi')]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const chatMutation = useSendChat();
  const copy = uiCopy[language];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  const sendMessage = (value: string) => {
    const clean = value.trim();
    if (!clean || isTyping) return;
    const userMessage: Message = { id: nextId.current++, from: 'user', text: clean };
    const history = messages.slice(-8).map((message) => ({
      role: message.from === 'bot' ? ('assistant' as const) : ('user' as const),
      content: message.text,
    }));
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);
    chatMutation.mutate(
      { data: { message: clean, history } },
      {
        onSuccess: (response) => {
          setMessages((current) => [
            ...current,
            { id: nextId.current++, from: 'bot', text: response.message },
          ]);
          setIsTyping(false);
        },
        onError: () => {
          setMessages((current) => [
            ...current,
            {
              id: nextId.current++,
              from: 'bot',
              text: 'AI response abhi available nahi hai. Aap apna sawaal dobara bhej sakte hain ya CSC Bhanpura se seedha contact karke service confirm kar sakte hain.',
              steps: [
                'OTP, PIN ya password chat mein share na karein.',
                'Exact fee aur requirement CSC Bhanpura ya official portal se confirm hogi.',
              ],
            },
          ]);
          setIsTyping(false);
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const clearConversation = () => {
    setMessages([initialMessage]);
    setInput('');
    setIsTyping(false);
    nextId.current = 2;
    inputRef.current?.focus();
  };

  return (
    <main className="paper-grain min-h-[100dvh] bg-[hsl(var(--background))]">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1500px]">
        <aside className="hidden w-[300px] shrink-0 flex-col bg-[hsl(var(--sidebar))] px-7 py-8 text-[hsl(var(--sidebar-foreground))] lg:flex">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[15px] font-extrabold tracking-[-.02em]">CSC Bhanpura</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.55)]">Digital seva desk</p>
            </div>
          </div>

          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.48)]">Aap yahan pooch sakte hain</p>
            <div className="mt-5 space-y-2.5">
              {[
                { icon: FileText, label: 'Forms & applications' },
                { icon: ShieldCheck, label: 'Documents & verification' },
                { icon: IndianRupee, label: 'Fees & official process' },
                { icon: ScanLine, label: 'Print, scan & PDF work' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.5)] px-3 py-3 text-[12px] text-[hsl(var(--sidebar-foreground)/.78)]">
                  <Icon size={16} className="text-[hsl(var(--sidebar-primary))]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.65)] p-4">
            <div className="flex items-start gap-2.5">
              <BadgeInfo size={17} className="mt-0.5 shrink-0 text-[hsl(var(--sidebar-primary))]" />
              <div>
                <p className="text-[12px] font-bold">Seedhi aur safe madad</p>
                <p className="mt-1.5 text-[11px] leading-5 text-[hsl(var(--sidebar-foreground)/.63)]">OTP, PIN ya password kisi ke saath share na karein. Final approval hamesha official department ka hota hai.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.9)] px-4 py-4 backdrop-blur-md sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden"><BrandMark /></div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-[16px] font-extrabold tracking-[-.025em] sm:text-[18px]">CSC Bhanpura help desk</h1>
                    <span className="hidden items-center gap-1 rounded-full bg-[hsl(var(--primary)/.1)] px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[hsl(var(--primary))] sm:flex">
                      <span className="h-1.5 w-1.5 animate-[pulse-soft_2s_ease-in-out_infinite] rounded-full bg-[hsl(var(--primary))]" /> online
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                    <MapPin size={13} className="shrink-0 text-[hsl(var(--accent))]" />
                    <span className="truncate">{LOCATION}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={clearConversation}
                data-testid="button-clear-conversation"
                className="group flex shrink-0 items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] px-3 py-2 text-[11px] font-bold text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--accent)/.65)] hover:text-[hsl(var(--foreground))]"
              >
                <RotateCcw size={14} className="transition-transform group-hover:-rotate-45" />
                <span className="hidden sm:inline">Nayi baat</span>
              </button>
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col overflow-hidden px-4 sm:px-7 lg:px-10">
              <div className="flex-1 overflow-y-auto py-6 sm:py-9" aria-live="polite">
                <div className="mb-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                  <span className="font-mono text-[9px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Aaj ki seva</span>
                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                </div>
                <div className="space-y-6">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} onQuickReply={sendMessage} />
                  ))}
                  {isTyping && (
                    <div className="chat-rise flex items-start gap-3" data-testid="status-chat-typing">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><MessageCircle size={16} /></div>
                      <div className="flex items-center gap-1.5 rounded-[4px_18px_18px_18px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] px-4 py-4 shadow-[0_7px_24px_rgba(33,38,64,.045)]">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              <div className="shrink-0 pb-4 pt-2 sm:pb-7">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                  <Sparkles size={13} className="text-[hsl(var(--accent))]" />
                  <span>Jaldi se service chunen</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {services.slice(0, 4).map((service) => <ServiceTile key={service.label} service={service} onSelect={sendMessage} />)}
                </div>
                <form onSubmit={handleSubmit} className="relative mt-3" data-testid="form-chat">
                  <label htmlFor="chat-input" className="sr-only">Apna sawaal likhein</label>
                  <input
                    ref={inputRef}
                    id="chat-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Apna sawaal likhein — jaise ‘PAN apply karna hai’"
                    disabled={isTyping}
                    data-testid="input-chat-message"
                    className="h-14 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-4 pr-14 text-[13px] text-[hsl(var(--foreground))] shadow-[0_10px_28px_rgba(33,38,64,.06)] transition placeholder:text-[hsl(var(--muted-foreground)/.72)] hover:border-[hsl(var(--primary)/.35)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-4 focus:ring-[hsl(var(--primary)/.1)] disabled:cursor-wait disabled:opacity-65"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    data-testid="button-send-message"
                    aria-label="Sawaal bhejein"
                    className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[0_5px_12px_rgba(237,142,48,.22)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {isTyping ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[hsl(var(--accent-foreground)/.35)] border-t-[hsl(var(--accent-foreground))]" /> : <Send size={17} />}
                  </button>
                </form>
                <div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-[hsl(var(--muted-foreground))]">
                  <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />
                  <span>OTP/PIN kabhi chat mein na likhein. Exact fee, requirement aur approval CSC Bhanpura ya official portal se confirm hoga.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden w-[270px] shrink-0 border-l border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-8 xl:block">
          <div className="sticky top-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Sabhi services</p>
                <h2 className="mt-1 text-[15px] font-extrabold tracking-[-.02em]">Aapko kis kaam mein help chahiye?</h2>
              </div>
              <Search size={17} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {services.slice(4).map((service) => <ServiceTile key={service.label} service={service} onSelect={sendMessage} />)}
            </div>
            <div className="mt-6 rounded-2xl border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.1)] p-4">
              <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                <PhoneCall size={16} className="text-[hsl(var(--accent))]" />
                <span className="text-[12px] font-bold">Centre par aane se pehle</span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">Apna kaam aur documents pehle pooch lein. Isse aapka trip aasaan rahega.</p>
              <div className="mt-3 flex items-start gap-2 text-[10px] font-medium leading-4 text-[hsl(var(--foreground))]">
                <MapPin size={12} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" />
                <span>{LOCATION}</span>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-2 px-1 text-[10px] leading-4 text-[hsl(var(--muted-foreground))]">
              <BookOpen size={13} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />
              <span>Yeh help desk general guidance deta hai. Official approval CSC ke haath mein nahi hota.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function RootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default RootApp;