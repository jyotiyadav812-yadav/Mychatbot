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

type Service = {
  label: string;
  prompt: string;
  icon: typeof FileText;
  tint: string;
};

const queryClient = new QueryClient();

const LOCATION = 'Yadav Chopal, Bhanpura Gaav, Haryana';
const ONLINE_NOTE =
  'You can also get your work done online from CSC Bhanpura, so you may contact us before visiting the centre.';

const initialMessage: Message = {
  id: 1,
  from: 'bot',
  text: 'Namaste. Main CSC Bhanpura ka digital help desk hoon. Aap kisi bhi online service ke baare mein pooch sakte hain — main documents, OTP, biometrics, fee aur official approval ke baare mein seedhi jaankari dunga.',
  steps: [
    'Neeche kisi service ko chun sakte hain, ya apna sawaal seedha likh sakte hain.',
    'Agar kisi kaam ke liye aapko centre aana zaroori ho, main pehle bata dunga.',
  ],
  quickReplies: ['Online form bharna hai', 'Aadhaar guidance', 'Certificate banwana hai'],
};

const services: Service[] = [
  { label: 'Forms & applications', prompt: 'Online form bharna hai', icon: FileText, tint: 'service-sun' },
  { label: 'Certificates', prompt: 'Certificate banwana hai', icon: Stamp, tint: 'service-mint' },
  { label: 'Jobs & exams', prompt: 'Job form ya exam bharna hai', icon: BriefcaseBusiness, tint: 'service-coral' },
  { label: 'Scholarships', prompt: 'Scholarship ke baare mein batao', icon: GraduationCap, tint: 'service-lilac' },
  { label: 'Aadhaar guidance', prompt: 'Aadhaar ka kaam hai', icon: IdCard, tint: 'service-aqua' },
  { label: 'PAN card', prompt: 'PAN card apply karna hai', icon: FileCheck2, tint: 'service-rose' },
  { label: 'Voter services', prompt: 'Voter ID ka kaam hai', icon: Vote, tint: 'service-sand' },
  { label: 'Print, scan & PDF', prompt: 'Photo scan print karna hai', icon: Printer, tint: 'service-blue' },
];

function answerFor(question: string): Omit<Message, 'id' | 'from'> {
  const text = question.toLowerCase().trim();
  const common = `\n\n${ONLINE_NOTE}`;

  if (/aadhaar|aadhar|आधार/.test(text)) {
    return {
      text: `Aadhaar mein update, download, print ya status check ke liye CSC Bhanpura aapko process samjha sakta hai. OTP ya biometric ki zaroorat service par depend karegi.${common}`,
      steps: [
        'Aadhaar number ya enrolment details saath rakhein.',
        'Registered mobile par aane wala OTP aapko khud enter karna hoga.',
        'Jahan biometric lage, verification centre par hi hoga.',
        'Exact requirement, fee aur approval official portal ke hisaab se confirm honge.',
      ],
      quickReplies: ['Aadhaar update ke liye kya chahiye?', 'Aadhaar print karna hai'],
    };
  }

  if (/pan|पैन/.test(text)) {
    return {
      text: `PAN card application ya correction mein CSC Bhanpura form, document upload aur acknowledgement mein madad kar sakta hai. Final approval Income Tax ke official process se hota hai.${common}`,
      steps: [
        'Identity aur address proof ki clear copy rakhein.',
        'Mobile number aur email active rakhein, agar portal maange.',
        'Photo/signature ki file format aur size official portal ke mutabik honi chahiye.',
        'Exact fee aur documents application ke waqt official portal par confirm honge.',
      ],
      quickReplies: ['PAN ke liye documents?', 'PAN correction karni hai'],
    };
  }

  if (/voter|मतदाता|election|epic/.test(text)) {
    return {
      text: `Voter ID ke liye new registration, correction, address shift aur status check mein online assistance mil sakti hai. Eligibility aur approval Election Commission ke official portal par depend karta hai.${common}`,
      steps: [
        'Naam, janam-tithi aur current address ki details ready rakhein.',
        'Portal ke hisaab se identity ya residence proof upload ho sakta hai.',
        'Application ke baad reference number se status dekha ja sakta hai.',
        'Exact documents aur timeline official portal se confirm hongi.',
      ],
      quickReplies: ['Naya voter ID banana hai', 'Voter ID correction'],
    };
  }

  if (/certificate|प्रमाण|income|जाति|caste|residence|domicile|birth|death/.test(text)) {
    return {
      text: `Income, caste, residence aur doosre certificates ke online application mein CSC Bhanpura madad kar sakta hai. Certificate issue karna sambandhit sarkari department ki approval par depend karta hai.${common}`,
      steps: [
        'Aap kis certificate ke liye apply kar rahe hain, yeh pehle confirm hoga.',
        'Aadhaar, address proof aur supporting document ki clear copy rakhein.',
        'OTP ya verification ke baad form submit hoga.',
        'Exact documents, fee aur processing time official portal/department se confirm honge.',
      ],
      quickReplies: ['Income certificate', 'Caste certificate', 'Residence certificate'],
    };
  }

  if (/scholarship|छात्रवृत्ति| छात्रवृत्ति|scholar/.test(text)) {
    return {
      text: `Scholarship application mein registration, form filling aur document upload ki online help mil sakti hai. Eligibility, last date aur approval scheme ke official portal se hi confirm honge.${common}`,
      steps: [
        'Student details, school/college details aur bank account information ready rakhein.',
        'Aadhaar, income certificate, marksheet ya doosre papers scheme ke mutabik lag sakte hain.',
        'OTP aapke registered mobile par aa sakta hai.',
        'Submit karne se pehle form ki details aapke saamne verify ki jayengi.',
      ],
      quickReplies: ['Scholarship documents?', 'Scholarship status check'],
    };
  }

  if (/job|naukri|रोजगार|exam|pariksha|भर्ती|recruitment|admit/.test(text)) {
    return {
      text: `Job, recruitment ya exam form bharne mein CSC Bhanpura online assistance de sakta hai. Vacancy ki eligibility, fee aur deadline hamesha official notification se confirm karein.${common}`,
      steps: [
        'Official notification ya application link saath rakhein.',
        'Photo, signature, ID proof aur qualification documents ready rakhein.',
        'Form submit karne se pehle naam, category aur date of birth check karein.',
        'Payment hua ho to acknowledgement/receipt zaroor save karein.',
      ],
      quickReplies: ['Job form bharna hai', 'Exam admit card download'],
    };
  }

  if (/admission|school|college|दाखिला|प्रवेश/.test(text)) {
    return {
      text: `School ya college admission ke online form, document upload aur status check mein madad mil sakti hai. Admission rules, eligibility, fee aur dates institution ke official portal se confirm hongi.${common}`,
      steps: [
        'Student ka naam, DOB, contact aur previous marksheet ready rakhein.',
        'Photo, signature aur required certificates ki clear files rakhein.',
        'Form submit karne se pehle course aur category details check karein.',
        'Acknowledgement number ko sambhal kar rakhein.',
      ],
      quickReplies: ['Admission form bharna hai', 'Documents upload help'],
    };
  }

  if (/recharge|bill|payment|bijli|electricity|mobile|रिचार्ज|भुगतान/.test(text)) {
    return {
      text: `Mobile recharge aur bill payment ke liye online assistance mil sakti hai. Operator, biller, amount aur final status payment se pehle aapko verify karna hoga.${common}`,
      steps: [
        'Mobile number ya consumer number dhyan se check karein.',
        'Amount aur biller ka naam confirm karke hi aage badhein.',
        'OTP/PIN kabhi kisi ko na batayein; payment aapki permission se hi hoga.',
        'Exact service charge, agar koi ho, payment se pehle CSC Bhanpura se confirm hoga.',
      ],
      quickReplies: ['Mobile recharge', 'Bijli bill payment'],
    };
  }

  if (/photo|scan|print|pdf|photocopy|दस्तावेज|document|प्रिंट/.test(text)) {
    return {
      text: `Photo, scan, photocopy, print aur PDF banane ki suvidha CSC Bhanpura mein mil sakti hai. Aap file WhatsApp/USB/email ya centre par available method se de sakte hain — method pehle confirm kar lein.${common}`,
      steps: [
        'Original document saaf aur poora lekar aayen.',
        'Required page size, copies aur colour/black-white preference bata dein.',
        'PDF banne ke baad naam aur pages check kar lein.',
        'Exact fee kaam ki quantity aur format dekhkar CSC Bhanpura confirm karega.',
      ],
      quickReplies: ['PDF banwani hai', 'Photo print karna hai'],
    };
  }

  if (/form|online|application|apply|ऑनलाइन|फॉर्म/.test(text)) {
    return {
      text: `Online form bharne mein CSC Bhanpura aapko registration, details fill karne, document upload aur acknowledgement save karne mein help kar sakta hai.${common}`,
      steps: [
        'Application ka official portal ya link saath rakhein.',
        'Mobile number, email, ID aur supporting documents ready rakhein.',
        'OTP aapko khud batana ya enter karna hoga; OTP kisi aur se share na karein.',
        'Final submit se pehle poora form aapke saamne verify kiya jayega.',
      ],
      quickReplies: ['Job form', 'Certificate form', 'Admission form'],
    };
  }

  if (/hello|hi|namaste|नमस्ते|help|madad|सहायता/.test(text)) {
    return {
      text: `Bilkul, main madad ke liye yahin hoon. Aap service ka naam ya apna kaam likh dein — jaise “PAN apply”, “certificate”, “job form” ya “Aadhaar update”.${common}`,
      quickReplies: ['Online form bharna hai', 'PAN card apply karna hai', 'Print aur PDF work'],
    };
  }

  return {
    text: 'Main is sawaal ko poori tarah samajh nahi paaya. Main forms, certificates, jobs, scholarships, admissions, PAN, Aadhaar, voter services, recharge aur print/scan work mein help kar sakta hoon.',
    steps: ['Aap kis service ke liye madad chahte hain? Service ka naam ya portal ka naam likh dein.'],
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

function ChatBubble({ message, onQuickReply }: { message: Message; onQuickReply: (value: string) => void }) {
  const isBot = message.from === 'bot';
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
          {isBot ? 'CSC help desk' : 'Aap'}
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

function ServiceTile({ service, onSelect }: { service: Service; onSelect: (prompt: string) => void }) {
  const Icon = service.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(service.prompt)}
      data-testid={`button-service-${service.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
      className="group flex min-h-[100px] flex-col justify-between rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-3.5 text-left shadow-[0_5px_18px_rgba(33,38,64,.035)] transition duration-200 hover:-translate-y-1 hover:border-[hsl(var(--primary)/.35)] hover:shadow-[var(--shadow-card)]"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${service.tint} text-[hsl(var(--foreground))] transition-transform duration-200 group-hover:scale-105`}>
        <Icon size={18} strokeWidth={1.9} />
      </span>
      <span className="mt-3 text-[12px] font-semibold leading-4 text-[hsl(var(--foreground))]">{service.label}</span>
    </button>
  );
}

function App() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const chatMutation = useSendChat();

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