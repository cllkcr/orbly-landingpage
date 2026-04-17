// ── Blast email template ─────────────────────────────────────────────────────
// English-only email. Turkish version lives at /email/update-1-tr

const BASE = "https://orblyapp.com";

export const VIDEO_URL = "https://orblyapp.com/email/video.mp4";
export const TURKISH_URL = `${BASE}/email/update-1-tr`;

const IMG = {
  timerPomodoro:  `${BASE}/email/timer-pomodoro.jpg`,
  timerTimeTimer: `${BASE}/email/timer-timetimer.jpg`,
  reminders:      `${BASE}/email/reminders.jpg`,
  orbitWeek:      `${BASE}/email/orbit-week.jpg`,
  orbitDay:       `${BASE}/email/orbit-day.jpg`,
  videoThumb:     `${BASE}/email/video-thumb.jpg`,
};

const P = "margin:0 0 16px;font-size:16px;line-height:1.7;color:#1a1a1a;";

function screenshotRow(left: { src: string; alt: string }, right: { src: string; alt: string }): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td style="width:50%;padding-right:6px;vertical-align:top;">
          <img src="${left.src}" alt="${left.alt}" width="100%"
            style="width:100%;border-radius:18px;display:block;" />
        </td>
        <td style="width:50%;padding-left:6px;vertical-align:top;">
          <img src="${right.src}" alt="${right.alt}" width="100%"
            style="width:100%;border-radius:18px;display:block;" />
        </td>
      </tr>
    </table>`;
}

function screenshot(src: string, alt: string): string {
  return `<div style="text-align:center;margin-bottom:16px;">
    <img src="${src}" alt="${alt}" width="280"
      style="width:100%;max-width:280px;border-radius:22px;display:inline-block;" />
  </div>`;
}

// ── Main builder ─────────────────────────────────────────────────────────────

export function buildBlastEmail(params: { unsubUrl: string }): { html: string; text: string } {
  const { unsubUrl } = params;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A progress update from Orbly</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
<div style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

  <!-- Wordmark -->
  <p style="margin:0 0 8px;font-size:18px;font-weight:700;letter-spacing:-0.5px;color:#1a1a1a;">Orbly</p>

  <!-- Turkish link -->
  <p style="margin:0 0 32px;">
    <a href="${TURKISH_URL}"
      style="font-size:12px;color:#888;text-decoration:none;border-bottom:1px solid #ddd;padding-bottom:1px;">
      Türkçe okumak için tıklayın
    </a>
  </p>

  <!-- Body -->
  <p style="${P}">Hey,</p>

  <p style="${P}">Hope you're well.</p>

  <p style="${P}">Quick update — things are moving faster than I expected.</p>

  <p style="${P}">
    The core screens are done: calendar, reminders, focus timer. I'm building with
    iOS&nbsp;26's new Liquid Glass design language. But the real challenge isn't making
    it look nice — it's making it <em>calm</em>. ADHD brains are already overstimulated.
    An app should reduce that, not add to it. Visually engaging but quiet.
    Getting that balance right is harder than I thought.
  </p>

  ${screenshotRow(
    { src: IMG.timerPomodoro,  alt: "Pomodoro timer" },
    { src: IMG.timerTimeTimer, alt: "Time Timer" }
  )}

  ${screenshot(IMG.reminders, "Reminders screen")}

  <p style="${P}"><strong>Now the exciting part: the 3D orbital view.</strong></p>

  <p style="${P}">
    Each ring is a day. Each sphere is a task. You can drag tasks toward the NOW sphere.
    It looks great — but what I'm working on right now is visual communication.
    Someone opening that screen for the first time should understand it intuitively,
    without reading anything, without asking "what is this?" Still figuring it out.
  </p>

  ${screenshotRow(
    { src: IMG.orbitWeek, alt: "This Week orbital view" },
    { src: IMG.orbitDay,  alt: "Today orbital view" }
  )}

  <p style="${P}">
    Also: grounding everything in ADHD science matters a lot to me. I've been reading
    Russell Barkley's books and papers — on attention, impulse control, time perception.
    Slightly wild idea, but getting feedback from him or his team on this app would be
    incredible. Probably not realistic. But it's been on my mind.
  </p>

  <p style="${P}"><strong>Last thing — a small exciting moment.</strong></p>

  <p style="${P}">
    When I first built the 3D screen, everything was static. My wife said:
    "what if the elements rotated?" We tried it. It worked.
    I recorded the moment it first came alive.
  </p>

  <!-- Video thumbnail — play button baked into image -->
  <div style="margin-bottom:24px;">
    <a href="${VIDEO_URL}" target="_blank" style="display:block;text-decoration:none;">
      <img src="${IMG.videoThumb}" alt="Watch the moment it first worked" width="100%"
        style="width:100%;border-radius:16px;display:block;" />
    </a>
  </div>

  <p style="${P}">
    If you have thoughts, feedback, or questions — just reply. I actually read everything.
  </p>

  <p style="${P}">Thank you for being here.</p>

  <p style="margin:0;font-size:16px;line-height:1.7;color:#1a1a1a;">
    Love,<br /><strong>Celal</strong>
  </p>

  <!-- Footer -->
  <div style="border-top:1px solid #f0f0f0;margin-top:40px;padding-top:20px;">
    <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
      If you no longer want these emails —
      <a href="${unsubUrl}" style="color:#aaa;">unsubscribe here</a>.
    </p>
  </div>

</div>
</div>
</body>
</html>`;

  const text = `ORBLY — A PROGRESS UPDATE

Hey,

Hope you're well.

Quick update — things are moving faster than I expected.

The core screens are done: calendar, reminders, focus timer. Building with iOS 26's Liquid Glass design language. The real challenge isn't making it look nice — it's making it calm. ADHD brains are already overstimulated. Visually engaging but quiet. Getting that balance right is harder than I thought.

Now the exciting part: the 3D orbital view. Each ring is a day, each sphere is a task. You can drag tasks toward the NOW sphere. Working on visual communication — someone should understand it intuitively on first look.

Grounding everything in ADHD science matters a lot to me. Russell Barkley's books and papers on attention, impulse control, time perception — really valuable. Slightly wild idea: getting his feedback on this app would be incredible. Probably not realistic. But it's been on my mind.

Last thing — a small exciting moment. When I first built the 3D screen, everything was static. My wife said: "what if the elements rotated?" We tried it. It worked. Watch it here: ${VIDEO_URL}

If you have thoughts or questions — just reply. I actually read everything.

Thank you for being here.

Love,
Celal

Turkish version: ${TURKISH_URL}
Unsubscribe: ${unsubUrl}`;

  return { html, text };
}
