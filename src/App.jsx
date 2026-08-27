import { useState } from "react";

const EVENTS = [
  { id: "tech", name: "Tech Symposium", date: "Sept 12", time: "10:00 AM", venue: "Innovation Hall", color: "#4A5FC1" },
  { id: "cultural", name: "Cultural Night", date: "Sept 13", time: "6:00 PM", venue: "Amphitheatre", color: "#C1447E" },
  { id: "sports", name: "Sports Meet", date: "Sept 14", time: "7:00 AM", venue: "Main Ground", color: "#3E8B5C" },
];

function App() {
  const [screen, setScreen] = useState("intro"); // "intro" | "form"
  const [isExiting, setIsExiting] = useState(false); // Controls screen transition state
  const [form, setForm] = useState({ name: "", email: "", eventId: "" });
  const [errors, setErrors] = useState({});
  const [pass, setPass] = useState(null);
  const [isPassExiting, setIsPassExiting] = useState(false); // Controls pass modal exit

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  function validate() {
    const nameOk = form.name.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const eventOk = !!form.eventId;
    const allEmpty = !form.name.trim() && !form.email.trim() && !form.eventId;

    const errs = {};
    if (allEmpty) {
      errs.form = true;
    } else {
      if (!nameOk) errs.name = true;
      if (!emailOk) errs.email = true;
      if (!eventOk) errs.eventId = true;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const event = EVENTS.find((ev) => ev.id === form.eventId);
    setPass({
      ...form,
      event,
      passId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    });
  }

  // Handle the transition from Intro to Form
  function transitionToForm() {
    setIsExiting(true);
    setTimeout(() => {
      setScreen("form");
      setIsExiting(false);
    }, 550); // Matches the duration of the webYankOut animation
  }

  // Handle the transition of closing the pass
  function closePass() {
    setIsPassExiting(true);
    setTimeout(() => {
      setPass(null);
      setIsPassExiting(false);
    }, 550);
  }

  function emailPass() {
    const subject = encodeURIComponent(`Your pass for ${pass.event.name}`);
    const body = encodeURIComponent(
      `Hi ${pass.name},\n\nHere are your event pass details:\n\nEvent: ${pass.event.name}\nName: ${pass.name}\nPass ID: ${pass.passId}\n\nSee you there!`
    );
    window.location.href = `mailto:${pass.email}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <style>{`
        /* -------------------------------------------------------------
           WEB TRANSITION PHYSICS & VISUAL ANIMATIONS
           ------------------------------------------------------------- */
        
        /* Yanking the current screen out to the left */
        @keyframes webYankOut {
          0% { transform: translateX(0); }
          15% { transform: translateX(40px) skewX(-2deg); } /* Web pulls tight backward */
          25% { transform: translateX(50px) skewX(-5deg); } /* Max tension */
          100% { transform: translateX(-150vw) skewX(20deg); opacity: 0; } /* SNAP! Pulled away violently */
        }

        /* Pulling the new screen in from the right */
        @keyframes webPullIn {
          0% { transform: translateX(150vw) skewX(-20deg); opacity: 0; }
          70% { transform: translateX(-40px) skewX(10deg); opacity: 1; } /* Overshoot */
          85% { transform: translateX(15px) skewX(-4deg); } /* Elastic bounce back */
          100% { transform: translateX(0) skewX(0); opacity: 1; } /* Settle */
        }

        /* Dropping the pass in from the ceiling */
        @keyframes webDropIn {
          0% { transform: translateY(-100vh) scale(0.8) rotate(15deg); opacity: 0; }
          60% { transform: translateY(50px) scale(1.05) rotate(-5deg); opacity: 1; } 
          80% { transform: translateY(-20px) scale(0.98) rotate(2deg); } 
          100% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
        }

        /* Yanking the pass back up to the ceiling */
        @keyframes webYankUpOut {
          0% { transform: translateY(0) scale(1); }
          20% { transform: translateY(40px) scale(0.95); } 
          100% { transform: translateY(-150vh) scale(0.8) rotate(-15deg); opacity: 0; } 
        }

        .web-yank-out { animation: webYankOut 0.55s cubic-bezier(0.5, -0.5, 0.5, 1) forwards; }
        .web-pull-in { animation: webPullIn 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .web-drop-in { animation: webDropIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .web-yank-up-out { animation: webYankUpOut 0.55s cubic-bezier(0.5, -0.5, 0.5, 1) forwards; }

        /* --- VISIBLE WEB STRAND CSS --- */
        
        @keyframes shootWebHoriz {
          0% { transform: scaleX(0); opacity: 0; }
          10% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes shootWebVert {
          0% { transform: scaleY(0); opacity: 0; }
          10% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        .web-visual-horiz {
          position: absolute;
          right: 50%;
          top: 50%;
          width: 150vw;
          height: 3px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 15px rgba(255,255,255,1), 0 0 30px rgba(74, 95, 193, 0.8);
          transform-origin: right center;
          animation: shootWebHoriz 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          z-index: 999;
          pointer-events: none;
        }

        .web-visual-horiz::before, .web-visual-horiz::after {
          content: '';
          position: absolute;
          right: 0;
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.8);
          box-shadow: 0 0 8px white;
          transform-origin: right center;
        }
        .web-visual-horiz::before { transform: rotate(1.5deg) translateY(-10px); }
        .web-visual-horiz::after { transform: rotate(-2deg) translateY(12px); }

        .web-impact-horiz {
          position: absolute;
          right: -15px;
          top: -15px;
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          box-shadow: 0 0 20px white;
        }

        /* Vertical web */
        .web-visual-vert {
          position: absolute;
          bottom: 50%;
          left: 50%;
          height: 150vh;
          width: 3px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 15px rgba(255,255,255,1), 0 0 30px rgba(193, 68, 126, 0.8);
          transform-origin: bottom center;
          animation: shootWebVert 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          z-index: 999;
          pointer-events: none;
        }

        .web-visual-vert::before, .web-visual-vert::after {
          content: '';
          position: absolute;
          bottom: 0;
          height: 100%;
          width: 1px;
          background: rgba(255,255,255,0.8);
          box-shadow: 0 0 8px white;
          transform-origin: bottom center;
        }
        .web-visual-vert::before { transform: rotate(1.5deg) translateX(-10px); }
        .web-visual-vert::after { transform: rotate(-2deg) translateX(12px); }

        .web-impact-vert {
          position: absolute;
          bottom: -15px;
          left: -15px;
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          box-shadow: 0 0 20px white;
        }

        /* --- HANGING SPIDER CSS --- */
        @keyframes spiderDrop {
          0% { transform: translateY(-100vh); }
          60% { transform: translateY(20px); }
          80% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        @keyframes spiderSway {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(8deg); }
        }
        
        @keyframes spiderYankUp {
          0% { transform: translateY(0) scale(1); }
          20% { transform: translateY(30px) scale(0.95); } 
          100% { transform: translateY(-100vh) scale(0.8); }
        }

        .spider-container {
          position: absolute;
          top: 0;
          right: 12%; /* Hanging on the right side */
          z-index: 101;
          transform-origin: top center;
          display: flex;
          flex-direction: column;
          align-items: center;
          /* First it drops in, then it begins swaying infinitely */
          animation: spiderDrop 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, 
                     spiderSway 3s ease-in-out 0.8s infinite alternate;
        }

        .spider-container.exiting {
          /* Overrides the drop/sway with the yank-up exit animation */
          animation: spiderYankUp 0.55s cubic-bezier(0.5, -0.5, 0.5, 1) forwards !important;
        }

        .spider-thread {
          width: 2px;
          height: 25vh; /* Hangs down a quarter of the screen */
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }

        .spider-body {
          font-size: 2.5rem;
          margin-top: -12px;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.8));
          transform: rotate(180deg); /* Make the spider hang upside down */
        }
      `}</style>

      {/* FIXED BACKGROUND LAYER */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "linear-gradient(rgba(10,14,23,0.3), rgba(10,14,23,0.85)), url('/up.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -2
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/image_d010a7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12, 
          mixBlendMode: "overlay",
          zIndex: -1
        }}
      />

      {/* APP CONTAINER */}
      <div style={{ minHeight: "100vh", width: "100vw", overflowX: "hidden", position: "relative" }}>
        
        {/* ---------------- INTRO SCREEN ---------------- */}
        {screen === "intro" && (
          <div
            className={isExiting ? "web-yank-out" : ""}
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "'Rajdhani', sans-serif",
              textAlign: "center",
              color: "white",
              paddingBottom: "3.5rem",
              position: "relative"
            }}
          >
            {/* INJECT VISIBLE HORIZONTAL WEB ON EXIT */}
            {isExiting && (
              <div className="web-visual-horiz">
                <div className="web-impact-horiz" />
              </div>
            )}

            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Rajdhani:wght@500;600;700&display=swap');

              @keyframes popIn {
                from { opacity: 0; transform: scale(0.85); }
                to { opacity: 1; transform: scale(1); }
              }
              @keyframes glowPulse {
                0%, 100% { box-shadow: 0 8px 32px rgba(193, 68, 126, 0.5), 0 0 0 rgba(74, 95, 193, 0); transform: translateY(0px); }
                50% { box-shadow: 0 15px 45px rgba(193, 68, 126, 0.7), 0 0 26px rgba(74, 95, 193, 0.6); transform: translateY(-5px); }
              }
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .intro-button {
                opacity: 0;
                animation: popIn 0.6s ease forwards, glowPulse 3s ease-in-out infinite;
                animation-delay: 1.4s, 2s;
                position: relative;
                overflow: hidden;
              }
              .intro-button::after {
                content: '';
                position: absolute;
                top: -50%; left: -50%; width: 200%; height: 200%;
                background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
                transform: rotate(30deg) translateX(-100%);
                transition: transform 0.6s ease;
              }
              .intro-button:hover::after {
                transform: rotate(30deg) translateX(100%);
              }
              .intro-button:hover {
                transform: translateY(-8px) scale(1.05) !important;
              }
              .intro-tagline {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                animation-delay: 1.9s;
              }
              .intro-card {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                position: relative;
              }
              .intro-card:nth-child(1) { animation-delay: 2.2s; }
              .intro-card:nth-child(2) { animation-delay: 2.4s; }
              .intro-card:nth-child(3) { animation-delay: 2.6s; }
              .intro-card:hover {
                transform: translateY(-8px);
              }
            `}</style>
            
            <div style={{ height: "46vh" }} />

            <button
              className="intro-button"
              onClick={transitionToForm} 
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: "1.7rem",
                letterSpacing: "0.02em",
                padding: "1.3rem 3.4rem",
                borderRadius: "999px",
                border: "2px solid rgba(255,255,255,0.8)",
                background: "linear-gradient(120deg, #4A5FC1, #C1447E)",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Get a Pass!!!
            </button>

            <p
              className="intro-tagline"
              style={{
                margin: "1.5rem 0 0 0",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase", 
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 4px 15px rgba(0,0,0,0.9)",
              }}
            >
              Three days. Three stages. One pass to see it all.
            </p>

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "stretch",
                justifyContent: "center",
                gap: "1.5rem",
                width: "100%",
                maxWidth: "980px",
                padding: "0 1.5rem",
                marginTop: "2rem",
                marginBottom: "2.5rem",
              }}
            >
              {EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="intro-card"
                  style={{
                    flex: "1 1 240px",
                    maxWidth: "280px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    background: "rgba(15, 20, 35, 0.75)",
                    border: `1px solid ${ev.color}`, 
                    borderRadius: "16px",
                    padding: "1.5rem",
                    backdropFilter: "blur(12px)", 
                    WebkitBackdropFilter: "blur(12px)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    textAlign: "left",
                    boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(${ev.id === 'tech' ? '74, 95, 193' : ev.id === 'cultural' ? '193, 68, 126' : '62, 139, 92'}, 0.1)`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 10px 30px ${ev.color}66, inset 0 0 20px ${ev.color}33`;
                    e.currentTarget.style.borderColor = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), inset 0 0 15px ${ev.color}1A`;
                    e.currentTarget.style.borderColor = ev.color;
                  }}
                >
                  <p style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: ev.color, textShadow: `0 0 10px ${ev.color}80` }}>
                    {ev.name}
                  </p>
                  <p style={{ margin: "0.6rem 0 0 0", fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
                    {ev.date} &middot; {ev.time}
                  </p>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.95rem", opacity: 0.6 }}>
                    {ev.venue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- FORM + PASS SCREEN ---------------- */}
        {screen === "form" && (
          <div 
            className="web-pull-in" 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              padding: "2rem",
              boxSizing: "border-box",
            }}
          >
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600;700&display=swap');

              .wv-label {
                display: block;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1.05rem;
                font-weight: 600;
                letter-spacing: 0.03em;
                text-transform: uppercase;
                color: #9fc2ff;
                text-shadow: 0 0 8px rgba(74, 95, 193, 0.6);
                margin: 1rem 0 0.35rem 0;
                text-align: left;
              }
              .required-star {
                color: #ff4d4d;
                margin-left: 4px;
              }
              .wv-input {
                width: 100%;
                box-sizing: border-box;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1rem;
                padding: 0.65rem 0.8rem;
                border-radius: 6px;
                border: 1.5px solid rgba(159, 194, 255, 0.5);
                background: rgba(13, 19, 33, 0.55);
                color: #fff;
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
              }
              .wv-input:focus {
                border-color: #ff8f8f;
                box-shadow: 0 0 10px rgba(255, 143, 143, 0.5);
              }
              .wv-submit {
                margin-top: 1.6rem;
                width: 100%;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.9rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                padding: 0.85rem;
                border: none;
                border-radius: 8px;
                background: linear-gradient(120deg, #4A5FC1, #C1447E);
                color: #fff;
                cursor: pointer;
                box-shadow: 0 6px 18px rgba(193, 68, 126, 0.35);
                transition: transform 0.15s ease, box-shadow 0.15s ease;
              }
              .wv-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 22px rgba(193, 68, 126, 0.5);
              }

              @keyframes wiggleLeftRight {
                0% { 
                  transform: translateX(-6px); 
                  filter: brightness(1.3) drop-shadow(0 0 10px rgba(255, 77, 77, 0.7)); 
                }
                50% { 
                  transform: translateX(6px); 
                  filter: brightness(1.75) drop-shadow(0 0 25px rgba(255, 100, 100, 1)); 
                }
                100% { 
                  transform: translateX(-6px); 
                  filter: brightness(1.3) drop-shadow(0 0 10px rgba(255, 77, 77, 0.7)); 
                }
              }

              .wv-field {
                position: relative;
                display: block;
                margin-bottom: 0.5rem;
              }
              .wv-comic-wrap {
                position: absolute;
                top: -10px;
                right: 100%;
                margin-right: 12px; 
                pointer-events: none;
                z-index: 10;
              }
              .wv-comic {
                display: block;
                width: 160px;
                animation: wiggleLeftRight 1.2s ease-in-out infinite;
              }
              .wv-comic-form-wrap {
                position: absolute;
                top: -80px; 
                left: -50px; 
                z-index: 10;
              }

              .pass-btn {
                margin: 0.35rem 0;
                padding: 0.75rem;
                width: 100%;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(0,0,0,0.4);
                color: white;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.2s, border-color 0.2s;
              }
              .pass-btn:hover {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.4);
              }
            `}</style>

            <form
              onSubmit={handleSubmit}
              style={{
                position: "relative",
                backgroundImage: "linear-gradient(rgba(10, 15, 30, 0.75), rgba(10, 15, 30, 0.75)), url('/pass.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backdropFilter: "blur(10px)",
                padding: "2.5rem 2rem",
                borderRadius: "16px",
                border: "1px solid rgba(159, 194, 255, 0.2)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                width: "100%",
                maxWidth: "360px",
                textAlign: "left"
              }}
            >
              {errors.form && (
                <div className="wv-comic-form-wrap">
                  <img
                    key="form-error"
                    src="/form.png"
                    alt="Fill out the form before continuing"
                    className="wv-comic"
                    style={{ width: "200px" }}
                  />
                </div>
              )}

              <div className="wv-field">
                {!errors.form && errors.name && (
                  <div className="wv-comic-wrap">
                    <img key="name-error" src="/name.png" alt="Name is required" className="wv-comic" />
                  </div>
                )}
                <label className="wv-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  className="wv-input"
                  type="text"
                  value={form.name}
                  placeholder="John Doe"
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div className="wv-field">
                {!errors.form && errors.email && (
                  <div className="wv-comic-wrap">
                    <img key="email-error" src="/email.png" alt="Enter a valid email" className="wv-comic" />
                  </div>
                )}
                <label className="wv-label">
                  Email <span className="required-star">*</span>
                </label>
                <input
                  className="wv-input"
                  type="email"
                  value={form.email}
                  placeholder="john@example.com"
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div className="wv-field">
                {!errors.form && errors.eventId && (
                  <div className="wv-comic-wrap">
                    <img key="event-error" src="/event.png" alt="Choose an event" className="wv-comic" />
                  </div>
                )}
                <label className="wv-label">
                  Event <span className="required-star">*</span>
                </label>
                <select
                  className="wv-input"
                  value={form.eventId}
                  onChange={(e) => updateField("eventId", e.target.value)}
                >
                  <option value="">Select an event...</option>
                  {EVENTS.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="wv-submit">Generate Pass</button>
            </form>

            {pass && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: isPassExiting ? "rgba(0,0,0,0)" : "rgba(0, 0, 0, 0.75)",
                  backdropFilter: isPassExiting ? "blur(0px)" : "blur(5px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 100,
                  transition: "all 0.5s ease", 
                }}
              >
                {/* INJECT HANGING SPIDER ON THE RIGHT SIDE */}
                <div className={`spider-container ${isPassExiting ? "exiting" : ""}`}>
                  <div className="spider-thread" />
                  <div className="spider-body">🕷️</div>
                </div>

                <div
                  className={isPassExiting ? "web-yank-up-out" : "web-drop-in"}
                  style={{
                    backgroundImage: "url('/pass.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "16px",
                    padding: "2rem 2rem 3.5rem 2rem",
                    width: "900px",
                    maxWidth: "95vw",
                    aspectRatio: "16 / 9", 
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
                    color: "white",
                    fontFamily: "'Rajdhani', sans-serif",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.15)",
                    zIndex: 102 /* Keeps the pass above the spider overlay slightly */
                  }}
                >
                  {/* INJECT VISIBLE VERTICAL WEB ON CLOSE */}
                  {isPassExiting && (
                    <div className="web-visual-vert">
                      <div className="web-impact-vert" />
                    </div>
                  )}

                  <div style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                    backgroundColor: "rgba(10, 15, 30, 0.65)", zIndex: 0 
                  }} />

                  <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }}>
                    <h2 style={{ 
                      fontFamily: "'Orbitron', sans-serif", 
                      color: pass.event.color, 
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)", 
                      margin: "0 0 1.5rem 0",
                      fontSize: "1.8rem"
                    }}>
                      {pass.event.name}
                    </h2>
                    
                    <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0.5rem 0" }}>{pass.name}</p>
                    <p style={{ fontSize: "1rem", opacity: 0.8, margin: "0 0 2rem 0" }}>{pass.email}</p>
                    
                    <div style={{ 
                      backgroundImage: "url('/image_cfbf08.png')", 
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      padding: "1.2rem", 
                      borderRadius: "12px", 
                      marginBottom: "2rem",
                      border: "2px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                      color: "#111" 
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>Pass ID</p>
                      <p style={{ margin: "0.2rem 0 0 0", fontSize: "2rem", fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.15em", fontWeight: 800 }}>{pass.passId}</p>
                    </div>

                    <button className="pass-btn" onClick={closePass}>Edit Details</button>
                    <button className="pass-btn" onClick={emailPass}>Email The Pass</button>
                    <button
                      className="pass-btn"
                      style={{ background: "#4A5FC1", border: "none", color: "white", marginTop: "0.5rem" }}
                      onClick={() => {
                        setForm({ name: "", email: "", eventId: "" });
                        closePass(); 
                      }}
                    >
                      Create New Pass
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;