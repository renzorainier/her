import React, { useState, useEffect, useRef } from "react";

/* --------------------------------------------------
   CONFIGURATION
-------------------------------------------------- */
const startDate = new Date("2019-11-24T13:23:23");

// Add the path to your Canon in D duet
const backgroundMusic = "/canon.mp3";

// Your personal messages
const compliments = [
  "I always enjoy 'yung late-night talks natin.",
  "Remember this song? Pinractice natin 'yung duet nito, 'di ba?",
  "Smile mo lang, masaya na ako.",
  "Sundays are the best talaga.",
  "Si Mama pa rin mas maganda (pagbigyan na natin).",
  "Thank you for teaching me piano, ha.",
  "Thank you for being my inspiration all those years.",
  "Bati na agad tayo 'pag may away tayo, ha.",
  "Dito lang ako palagi for you.",
  "Lord, ibigay Mo na kasi siya sa akin, hehe.",
  "Hey, lagi kang maganda tuwing Sunday.",
  "I'm sorry na sa inconsistencies ko, ha.",
  "Tell me lahat, I love it 'pag nagkukuwento ka.",
  "Yes, scan mo lang 'to palagi 'pag nami-miss mo ako.",
  "I miss you palagi.",
  "Never akong magsasawa sa 'yo, ha.",
  "I hope someday maging totoo na 'to.",
  "Do well sa lahat!",
  "'Wag tayong matutulog nang may away, ha.",
  "Usap tayo palagi.",
  "Ganda mo last Sunday!",
  "Ganda naman nito... akin na lang siya, Lord.",
  "Naka-repeat lang 'to, ha, pero 'wag kang magsawa i-visit. :)",
  "Pahinga lang 'pag pagod, 'wag aayaw, ha."
];

/* --------------------------------------------------
   SMART PLURAL FUNCTION
-------------------------------------------------- */
function formatLabel(value, singular) {
  return value === 1 ? singular : `${singular}s`;
}

/* --------------------------------------------------
   TIME CALCULATION FUNCTION
-------------------------------------------------- */
function calculateTimeDifference(from) {
  const now = new Date();

  let years = now.getFullYear() - from.getFullYear();
  let months = now.getMonth() - from.getMonth();
  let days = now.getDate() - from.getDate();
  let hours = now.getHours() - from.getHours();
  let minutes = now.getMinutes() - from.getMinutes();
  let seconds = now.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */
export default function App() {
  const [time, setTime] = useState(() => calculateTimeDifference(startDate));
  const [stage, setStage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const audioRef = useRef(null);
  const sequenceStarted = useRef(false);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeDifference(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- AUDIO LOADING FALLBACK ---------------- */
  // If the browser blocks auto-downloading audio, unlock the button anyway after 2.5s
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!audioLoaded) {
        setAudioLoaded(true);
      }
    }, 2500);
    return () => clearTimeout(fallbackTimer);
  }, [audioLoaded]);

  /* ---------------- START EXPERIENCE ---------------- */
  const handleStart = () => {
    if (!audioLoaded) return;

    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      // We catch the error just in case the browser blocks it, but interacting
      // with the button usually grants permission to play.
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  /* ---------------- CINEMATIC SEQUENCE ---------------- */
  useEffect(() => {
    if (!hasStarted || sequenceStarted.current) return;
    sequenceStarted.current = true;

    const sequence = [
      { delay: 1000, stage: 1 },    // Intro
      { delay: 4000, stage: 2 },    // Years
      { delay: 7000, stage: 3 },    // Months
      { delay: 10000, stage: 4 },   // Days
      { delay: 13000, stage: 5 },   // Hours
      { delay: 16000, stage: 6 },   // Minutes
      { delay: 19000, stage: 7 },   // Seconds

      // Vulnerability Sequence
      { delay: 22000, stage: 8 },   // "We aren't perfect."
      { delay: 25500, stage: 9 },   // "We've had our share of fights..."
      { delay: 29000, stage: 10 },  // "But we always try to fix it."

      // Final Reveal Sequence
      { delay: 33000, stage: 11 },  // Final Grid Appears
      { delay: 36000, stage: 12 },  // Text: Cherished every single one
      { delay: 39500, stage: 13 },  // Separator Line
      { delay: 42500, stage: 14 },  // Text: And looking forward...
      { delay: 44500, stage: 15 },  // Text: I only see my future with you.

      // The Grand Finale
      { delay: 48000, stage: 16 },  // Text: And when the time comes...
      { delay: 50500, stage: 17 },  // Text: in God's perfect time...
      { delay: 53500, stage: 18 },  // Text: I wish it would be you.

      // NEVER ENDING CYCLE
      { delay: 59000, stage: 19 },  // Start cycling compliments
    ];

    const timeouts = sequence.map(({ delay, stage }) =>
      setTimeout(() => setStage(stage), delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [hasStarted]);

  /* -------------------------------------------------- */
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans overflow-hidden">

      <audio
        ref={audioRef}
        src={backgroundMusic}
        loop
        preload="auto"
        onCanPlayThrough={() => setAudioLoaded(true)}
        onLoadedData={() => setAudioLoaded(true)}
      />

      <BackgroundEffects />

      {/* START SCREEN */}
      {!hasStarted && (
        <div
          className={`absolute z-50 flex flex-col items-center transition-all duration-700 ${audioLoaded ? 'cursor-pointer animate-pulse-slow' : 'opacity-50'}`}
          onClick={handleStart}
        >
          {/* Headphones/Volume Icon */}
          <div className="mb-8 flex flex-col items-center space-y-3">
            <svg className="w-8 h-8 text-pink-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10v4c0 3.313 2.687 6 6 6h6c3.313 0 6-2.687 6-6v-4m-3-4V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m-3 0a2 2 0 00-2 2v2c0 1.105.895 2 2 2h2V8H3zm16 0h2a2 2 0 012 2v2c0 1.105-.895 2-2 2h-2V8z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 13a2 2 0 104 0 2 2 0 00-4 0z"></path>
            </svg>
            <p className="text-white/40 text-[10px] tracking-widest uppercase text-center px-4">Best experienced with headphones<br/>or volume up</p>
          </div>

          <div className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 ${audioLoaded ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-transparent border border-white/5'}`}>
            {audioLoaded ? (
              <svg className="w-6 h-6 text-pink-300 translate-x-[2px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              // Loading Spinner
              <svg className="w-6 h-6 text-white/30 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>

          <p className="mt-6 text-pink-200/60 tracking-[0.3em] uppercase text-xs font-light">
            {audioLoaded ? "For You" : "Loading music..."}
          </p>
        </div>
      )}

      {/* INTRO */}
      {stage === 1 && (
        <div className="animate-intro-sequence absolute z-20 w-full px-6">
          <p className="text-pink-200/80 text-xl tracking-[0.4em] uppercase font-light text-center">
            Every moment <br/><span className="text-sm text-white/40 mt-4 block">since that day</span>
          </p>
        </div>
      )}

      {/* SPOTLIGHT SEQUENCE */}
      {stage >= 2 && stage <= 7 && (
        <div key={stage} className="absolute z-30 flex items-center justify-center animate-spotlight-enter">
          <SpotlightNumber
            value={
              stage === 2 ? time.years :
              stage === 3 ? time.months :
              stage === 4 ? time.days :
              stage === 5 ? time.hours :
              stage === 6 ? time.minutes :
              time.seconds
            }
            label={
              stage === 2 ? formatLabel(time.years, "Year") :
              stage === 3 ? formatLabel(time.months, "Month") :
              stage === 4 ? formatLabel(time.days, "Day") :
              stage === 5 ? formatLabel(time.hours, "Hour") :
              stage === 6 ? formatLabel(time.minutes, "Minute") :
              formatLabel(time.seconds, "Second")
            }
          />
        </div>
      )}

      {/* VULNERABILITY SEQUENCE */}
      {stage >= 8 && stage <= 10 && (
        <div key={stage} className="absolute z-30 flex items-center justify-center text-center px-6 animate-text-sequence w-full">
          {stage === 8 && (
            <p className="text-pink-200/80 text-xl tracking-[0.3em] uppercase font-light">
              We aren't perfect.
            </p>
          )}
          {stage === 9 && (
            <p className="text-white/80 text-2xl font-serif italic leading-relaxed">
              We've had our share of <br/>fights and arguments...
            </p>
          )}
          {stage === 10 && (
            <div className="flex flex-col items-center">
              <p className="text-pink-200/80 text-xs tracking-[0.4em] uppercase mb-4">
                But no matter what
              </p>
              <p className="text-3xl font-serif italic bg-gradient-to-br from-white via-pink-100 to-pink-300 bg-clip-text text-transparent">
                we always try to fix it.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FINAL GRID */}
      {stage >= 11 && (
        <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-zoom-out-enter p-6 pb-20">

          <p className="text-pink-200/80 text-xs tracking-[0.4em] uppercase mb-6">
            Time we've shared
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8 w-full">
            <TimeBox value={time.years} label={formatLabel(time.years, "Year")} isMain />
            <TimeBox value={time.months} label={formatLabel(time.months, "Month")} isMain />
            <TimeBox value={time.days} label={formatLabel(time.days, "Day")} isMain />
            <TimeBox value={time.hours} label={formatLabel(time.hours, "Hour")} />
            <TimeBox value={time.minutes} label={formatLabel(time.minutes, "Minute")} />
            <HeartbeatBox value={time.seconds} label={formatLabel(time.seconds, "Second")} />
          </div>

          <div className="text-center space-y-4 max-w-sm mt-2">

            {/* Paragraph 1 */}
            <div className={`transition-all duration-1000 ${stage >= 12 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
              <p className="text-white/80 font-serif italic text-base leading-relaxed">
                "Since I first showed my interest in you, I've cherished every single one."
              </p>
            </div>

            {/* Divider */}
            <div className={`mx-auto w-16 h-[1px] bg-gradient-to-r from-transparent via-pink-400/50 to-transparent transition-all duration-1000 ${stage >= 13 ? 'opacity-100' : 'opacity-0 scale-0'}`} />

            {/* Paragraph 2 */}
            <div className={`transition-all duration-2000 ${stage >= 14 ? 'opacity-100' : 'opacity-0 translate-y-4 blur-sm'}`}>
              <p className="text-pink-200/60 text-[10px] uppercase tracking-[0.3em] mb-2">
                And looking forward,
              </p>
              <h2 className={`text-xl font-serif text-white/90 transition-all duration-2000 ${stage >= 15 ? 'opacity-100' : 'opacity-0 translate-y-2 blur-sm'}`}>
                I only see my future with you.
              </h2>
            </div>

            {/* THE GRAND FINALE */}
            <div className={`transition-all duration-2000 ${stage >= 16 ? 'opacity-100' : 'opacity-0 translate-y-4 blur-sm'}`}>
              <p className="text-pink-200/60 text-[10px] uppercase tracking-[0.3em] mb-2 mt-6">
                And when the time comes, <br/>
                <span className={`transition-all duration-2000 inline-block mt-2 ${stage >= 17 ? 'opacity-100' : 'opacity-0'}`}>in God's perfect time...</span>
              </p>
              <h1 className={`text-3xl font-serif bg-gradient-to-br from-white via-pink-100 to-pink-400 bg-clip-text text-transparent transition-all duration-2000 ${stage >= 18 ? 'opacity-100' : 'opacity-0 translate-y-4 blur-sm'}`}>
                I wish it would be you.
              </h1>
            </div>

          </div>
        </div>
      )}

      {/* NEVER ENDING COMPLIMENTS */}
      {stage >= 19 && (
        <ComplimentCycler compliments={compliments} />
      )}

      <GlobalStyles />
    </div>
  );
}

/* --------------------------------------------------
   COMPONENTS
-------------------------------------------------- */

function ComplimentCycler({ compliments }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * compliments.length));

  useEffect(() => {
    // Cycles exactly every 4 seconds to match the CSS animation duration
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex;
        // Keep generating a new random index until it's different from the previous one
        do {
          nextIndex = Math.floor(Math.random() * compliments.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [compliments.length]);

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
      <p
        key={index} // Changing the key forces React to restart the animation
        className="text-pink-200/80 text-sm tracking-wide font-light animate-fade-in-out text-center max-w-[80%]"
      >
        {compliments[index]}
      </p>
    </div>
  );
}

function SpotlightNumber({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[140px] font-bold font-mono bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent leading-none">
        {String(value)}
      </span>
      <span className="text-xl text-pink-300/80 uppercase tracking-[0.6em] mt-4">
        {label}
      </span>
    </div>
  );
}

function TimeBox({ value, label, isMain }) {
  return (
    <div className="flex flex-col items-center py-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/[0.04]">
      <span className={`font-mono font-bold text-white ${isMain ? 'text-3xl' : 'text-xl'}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-pink-200/60 uppercase tracking-widest mt-2">
        {label}
      </span>
    </div>
  );
}

function HeartbeatBox({ value, label }) {
  return (
    <div className="relative flex flex-col items-center py-4 bg-pink-500/10 border border-pink-400/20 rounded-2xl animate-heartbeat backdrop-blur-sm shadow-[0_0_20px_rgba(236,72,153,0.1)] overflow-hidden">
      <div className="absolute top-2 right-2 text-pink-400 text-[10px] animate-pulse">
        ❤️
      </div>
      <span className="font-mono text-xl font-bold text-pink-200">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-pink-200/80 uppercase tracking-widest mt-2">
        {label}
      </span>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60vh] h-[60vh] bg-pink-500/10 rounded-full blur-[120px] animate-breathe" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-white/5 rounded-full blur-[120px] animate-breathe-delayed" />
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @keyframes spotlight-enter {
        0% { opacity: 0; transform: translateY(120px); filter: blur(10px); }
        20% { opacity: 1; filter: blur(0); }
        80% { opacity: 1; filter: blur(0); }
        100% { opacity: 0; transform: translateY(-120px); filter: blur(10px); }
      }
      .animate-spotlight-enter {
        animation: spotlight-enter 3s linear forwards;
      }

      @keyframes text-sequence {
        0% { opacity: 0; transform: translateY(15px); filter: blur(8px); }
        20% { opacity: 1; transform: translateY(0); filter: blur(0); }
        80% { opacity: 1; transform: translateY(0); filter: blur(0); }
        100% { opacity: 0; transform: translateY(-15px); filter: blur(8px); }
      }
      .animate-text-sequence {
        animation: text-sequence 3.5s ease-in-out forwards;
      }
      .animate-intro-sequence {
        animation: text-sequence 3s ease-in-out forwards;
      }

      @keyframes zoom-out-enter {
        0% { opacity: 0; transform: scale(1.1); filter: blur(10px); }
        100% { opacity: 1; transform: scale(1); filter: blur(0); }
      }
      .animate-zoom-out-enter {
        animation: zoom-out-enter 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      }

      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.05); }
        30% { transform: scale(1); }
        45% { transform: scale(1.05); }
      }
      .animate-heartbeat {
        animation: heartbeat 1s infinite cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
      }
      .animate-breathe {
        animation: breathe 8s infinite ease-in-out;
      }
      .animate-breathe-delayed {
        animation: breathe 8s infinite ease-in-out;
        animation-delay: 4s;
      }

      .animate-pulse-slow {
        animation: breathe 4s infinite ease-in-out;
      }

      /* New animation for the cycling compliments */
      @keyframes fade-in-out {
        0% { opacity: 0; transform: translateY(5px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-5px); }
      }
      .animate-fade-in-out {
        animation: fade-in-out 4s ease-in-out infinite;
      }
    `}</style>
  );
}
