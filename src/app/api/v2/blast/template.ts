// ── Blast email template ─────────────────────────────────────────────────────
// Designed to land in Gmail Primary, not Promotions.
//
// Rules followed (matching the welcome email pattern):
//  - Plain text-style HTML, no card wrapper, no box shadow
//  - Max 2 images (orbital view + video thumb)
//  - No List-Unsubscribe header
//  - Personal subject: "thought you'd want to see this"
//  - Screenshots page linked for anyone who wants to see more

const BASE = "https://orblyapp.com";

export const VIDEO_URL   = `${BASE}/email/video.mp4`;
export const TURKISH_URL = `${BASE}/email/update-1-tr`;
export const SCREENS_URL = `${BASE}/email/update-1`;   // English full page

const IMG = {
  orbitDay:   `${BASE}/email/orbit-day.jpg`,
  videoThumb: `${BASE}/email/video-thumb.jpg`,
};

// ── Main builder ─────────────────────────────────────────────────────────────

export function buildBlastEmail(params: { unsubUrl: string }): { html: string; text: string } {
  const { unsubUrl } = params;

  // Matches the exact style of the welcome email — proven to land in Primary
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;background:#ffffff;">
<div style="max-width:520px;margin:0 auto;padding:40px 24px;">

  <p style="${P}">
    <a href="${TURKISH_URL}" style="font-size:12px;color:#999;text-decoration:none;border-bottom:1px solid #e0e0e0;padding-bottom:1px;">
      Türkçe okumak için tıklayın
    </a>
  </p>

  <p style="${P}">Hey,</p>

  <p style="${P}">Hope you're well.</p>

  <p style="${P}">
    Quick update — things are moving faster than I expected.
  </p>

  <p style="${P}">
    The core screens are done: calendar, reminders, focus timer. I'm building with
    iOS&nbsp;26's new Liquid Glass design language. But the real challenge isn't making
    it look nice — it's making it <em>calm</em>. ADHD brains are already overstimulated.
    An app should reduce that, not add to it. Visually engaging but quiet.
    Getting that balance right is harder than I thought.
  </p>

  <p style="${P}"><strong>Now the exciting part: the 3D orbital view.</strong></p>

  <p style="${P}">
    Each ring is a day. Each sphere is a task. You can drag tasks toward the NOW sphere.
    It looks great — but what I'm working on right now is visual communication.
    Someone opening that screen for the first time should understand it intuitively,
    without reading anything, without asking "what is this?" Still figuring it out.
  </p>

  <img src="${IMG.orbitDay}" alt="Orbly — today's orbital view" width="100%"
    style="width:100%;max-width:480px;border-radius:20px;display:block;margin:0 0 24px;" />

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

  <a href="${VIDEO_URL}" target="_blank" style="display:block;margin-bottom:24px;text-decoration:none;">
    <img src="${IMG.videoThumb}" alt="Watch — click to play" width="100%"
      style="width:100%;max-width:480px;border-radius:16px;display:block;" />
  </a>

  <p style="${P}">
    If you want to see all the screenshots —
    <a href="${SCREENS_URL}" style="color:#1a1a1a;">here's a quick page I put together</a>.
  </p>

  <p style="${P}">
    If you have thoughts, feedback, or questions — just reply. I actually read everything.
  </p>

  <p style="${P}">Thank you for being here.</p>

  <p style="margin:0 0 40px;font-size:16px;line-height:1.7;color:#1a1a1a;">
    Love,<br /><strong>Celal</strong>
  </p>

  <p style="font-size:12px;color:#999;line-height:1.6;margin:0;">
    No spam. <a href="${unsubUrl}" style="color:#999;">Unsubscribe anytime.</a>
  </p>

</div>
</body>
</html>`;

  const text = `[ Türkçe okumak için: ${TURKISH_URL} ]

Hey,

Hope you're well.

Quick update — things are moving faster than I expected.

The core screens are done: calendar, reminders, focus timer. Building with iOS 26's Liquid Glass design language. The real challenge isn't making it look nice — it's making it calm. ADHD brains are already overstimulated. Visually engaging but quiet. Getting that balance right is harder than I thought.

The 3D orbital view: each ring is a day, each sphere is a task. You can drag tasks toward the NOW sphere. Working on visual communication — someone should understand it intuitively on first look.

Grounding everything in ADHD science matters to me. Russell Barkley's work on attention, impulse control, time perception — really valuable. Slightly wild idea: getting his feedback on this would be incredible.

Last thing — a small exciting moment. When I first built the 3D screen, everything was static. My wife said "what if the elements rotated?" We tried it. It worked. Watch it here: ${VIDEO_URL}

All the screenshots: ${SCREENS_URL}

If you have thoughts — just reply. I actually read everything.

Thank you for being here.

Love,
Celal

---
No spam. Unsubscribe: ${unsubUrl}`;

  return { html, text };
}

const P = "margin:0 0 16px;font-size:16px;line-height:1.7;color:#1a1a1a;";
