import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orbly — Progress Update",
  robots: "noindex",
};

const BASE = "https://orblyapp.com";
const VIDEO_URL = `${BASE}/email/video.mp4`;

export default function EnglishUpdatePage() {
  return (
    <main style={{
      background: "#f5f5f5", minHeight: "100vh", padding: "32px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

          <p style={{ margin: "0 0 32px", fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Orbly</p>

          <p style={P}>Hey,</p>
          <p style={P}>Hope you're well.</p>
          <p style={P}>Quick update — things are moving faster than I expected.</p>
          <p style={P}>
            The core screens are done: calendar, reminders, focus timer. Building with iOS&nbsp;26's
            Liquid Glass design language. The real challenge isn't making it look nice — it's making
            it <em>calm</em>. ADHD brains are already overstimulated. Visually engaging but quiet.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <img src={`${BASE}/email/timer-pomodoro.jpg`} alt="Pomodoro timer"
              style={{ width: "50%", borderRadius: 18 }} />
            <img src={`${BASE}/email/timer-timetimer.jpg`} alt="Time Timer"
              style={{ width: "50%", borderRadius: 18 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={`${BASE}/email/reminders.jpg`} alt="Reminders"
              style={{ maxWidth: 280, width: "100%", borderRadius: 22 }} />
          </div>

          <p style={P}><strong>The 3D orbital view.</strong></p>
          <p style={P}>
            Each ring is a day. Each sphere is a task. You can drag tasks toward the NOW sphere.
            Working on visual communication — someone should understand it intuitively on first look.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <img src={`${BASE}/email/orbit-week.jpg`} alt="This Week"
              style={{ width: "50%", borderRadius: 18 }} />
            <img src={`${BASE}/email/orbit-day.jpg`} alt="Today"
              style={{ width: "50%", borderRadius: 18 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={`${BASE}/email/orbit-all.jpg`} alt="April 2026"
              style={{ maxWidth: 280, width: "100%", borderRadius: 22 }} />
          </div>

          <p style={P}>
            Grounding everything in ADHD science matters to me. Russell Barkley's work on
            attention, impulse control, time perception — really valuable. Slightly wild idea,
            but getting his feedback on this would be incredible.
          </p>

          <p style={P}><strong>A small exciting moment.</strong></p>
          <p style={P}>
            When I first built the 3D screen, everything was static. My wife said "what if the
            elements rotated?" We tried it. It worked. I recorded the moment it first came alive.
          </p>

          <div style={{ marginBottom: 24 }}>
            <a href={VIDEO_URL} target="_blank" style={{ display: "block", textDecoration: "none" }}>
              <img src={`${BASE}/email/video-thumb.jpg`} alt="Watch video"
                style={{ width: "100%", borderRadius: 16 }} />
            </a>
          </div>

          <p style={P}>
            If you have thoughts, feedback, or questions — just reply. I actually read everything.
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
            Love,<br /><strong>Celal</strong>
          </p>
        </div>
      </div>
    </main>
  );
}

const P: React.CSSProperties = { margin: "0 0 16px", fontSize: 16, lineHeight: 1.7, color: "#1a1a1a" };
