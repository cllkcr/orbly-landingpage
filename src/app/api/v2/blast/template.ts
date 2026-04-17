// ── Blast email template — bilingual (TR first, EN second) ──────────────────
// Images must be uploaded to /public/email/ before sending:
//   timer-pomodoro.png, timer-timetimer.png, reminders.png,
//   orbit-week.png, orbit-day.png, video-thumb.png
//
// Replace VIDEO_URL placeholder in the HTML before the actual send.

const BASE = "https://orblyapp.com";

const IMG = {
  timerPomodoro:  `${BASE}/email/timer-pomodoro.jpg`,
  timerTimeTimer: `${BASE}/email/timer-timetimer.jpg`,
  reminders:      `${BASE}/email/reminders.jpg`,
  orbitWeek:      `${BASE}/email/orbit-week.jpg`,
  orbitDay:       `${BASE}/email/orbit-day.jpg`,
  videoThumb:     `${BASE}/email/video-thumb.jpg`,
};

// Replace before sending:
export const VIDEO_URL = "https://orblyapp.com/email/video.mp4";

// ── Shared helpers ───────────────────────────────────────────────────────────

function screenshot(src: string, alt: string, caption?: string): string {
  return `
    <div style="margin:0 auto 8px;max-width:280px;text-align:center;">
      <img
        src="${src}"
        alt="${alt}"
        width="280"
        style="width:100%;max-width:280px;border-radius:22px;display:block;margin:0 auto;"
      />
      ${caption ? `<p style="margin:6px 0 0;font-size:11px;color:#999;letter-spacing:0.5px;">${caption}</p>` : ""}
    </div>
  `;
}

function screenshotRow(left: { src: string; alt: string }, right: { src: string; alt: string }): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
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
    </table>
  `;
}

function videoBlock(thumbUrl: string, linkUrl: string): string {
  return `
    <div style="position:relative;max-width:480px;margin:0 auto;border-radius:16px;overflow:hidden;cursor:pointer;">
      <a href="${linkUrl}" target="_blank" style="display:block;text-decoration:none;">
        <img src="${thumbUrl}" alt="Watch the moment it first worked"
          width="100%"
          style="width:100%;display:block;border-radius:16px;" />
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                    width:64px;height:64px;background:rgba(0,0,0,0.55);border-radius:50%;
                    display:flex;align-items:center;justify-content:center;">
          <div style="width:0;height:0;border-style:solid;
                      border-width:12px 0 12px 22px;
                      border-color:transparent transparent transparent #ffffff;
                      margin-left:4px;"></div>
        </div>
      </a>
    </div>
    <p style="text-align:center;font-size:12px;color:#999;margin:8px 0 0;">
      ▶ Oynamak için tıklayın / Click to watch
    </p>
  `;
}

// ── Turkish section ──────────────────────────────────────────────────────────

function turkishSection(unsubUrl: string): string {
  return `
    <h2 style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0 0 16px;">
      🇹🇷 Türkçe
    </h2>

    <p style="${P}">Merhaba,</p>

    <p style="${P}">Umarım iyisinizdir.</p>

    <p style="${P}">
      Kısa tutacağım. Direkt konuya gireyim.
    </p>

    <p style="${P}">
      Her şey beklenenden hızlı ilerliyor.
    </p>

    <p style="${P}">
      Temel ekranlar hazır: takvim, hatırlatıcılar, odak zamanlayıcısı. iOS&nbsp;26'nın yeni
      Liquid Glass tasarım diliyle ilerliyorum. Ama asıl mesele şu: ADHD beyin zaten her an
      bombardımana uğruyor. Bir uygulama buna eklemek yerine sakinleştirmeli.
      İlgi çeken ama sade. Bu dengeyi kurmak düşündüğümden çok daha zor.
    </p>

    ${screenshotRow(
      { src: IMG.timerPomodoro,  alt: "Pomodoro zamanlayıcı" },
      { src: IMG.timerTimeTimer, alt: "Time Timer ekranı" }
    )}

    <div style="height:16px;"></div>

    ${screenshot(IMG.reminders, "Hatırlatıcılar ekranı")}

    <div style="height:24px;"></div>

    <p style="${P}">
      <strong>En eğlenceli kısma geliyorum: 3D orbital ekran.</strong>
    </p>

    <p style="${P}">
      Her halka bir gün. Her küre bir görev. Taskları NOW küresine doğru sürükleyebiliyorsunuz.
      Görsel olarak gayet iyi duruyor ama şu an üzerinde çalıştığım asıl sorun görsel iletişim —
      o ekrana bakan birinin, bir şey okumadan, "bu ne?" demeden sezgisel olarak anlayabilmesi.
      Hâlâ üzerinde çalışıyorum.
    </p>

    ${screenshotRow(
      { src: IMG.orbitWeek, alt: "Bu hafta görünümü" },
      { src: IMG.orbitDay,  alt: "Bugün görünümü" }
    )}

    <div style="height:24px;"></div>

    <p style="${P}">
      Bir de şunu söylemek istiyorum: yaptıklarımı bilimsel temele oturtmak benim için çok önemli.
      Russell Barkley'nin kitaplarını ve makalelerini okuyorum — dikkat, dürtü kontrolü, zaman algısı
      konularında çok değerli ipuçları var. Biraz hayali bir düşünce ama ondan ya da ekibinden
      bu uygulama için bir geri bildirim almak inanılmaz olurdu. Muhtemelen gerçekçi değil
      ama düşünceme takıldı.
    </p>

    <p style="${P}">
      <strong>Son olarak, küçük ama güzel bir an.</strong>
    </p>

    <p style="${P}">
      3D ekranı ilk kurduğumda her şey statikti. Eşim "ekrandakiler dönseydi nasıl olurdu?" dedi.
      Denedik. Çalıştı. İlk çalıştığı anı video olarak kaydettim.
    </p>

    ${videoBlock(IMG.videoThumb, VIDEO_URL)}

    <div style="height:24px;"></div>

    <p style="${P}">
      Gördüklerinizle ilgili düşünceleriniz, önerileriniz ya da herhangi bir sorunuz
      varsa — yanıtlayabilirsiniz. Gerçekten okuyorum.
    </p>

    <p style="${P}">Burada olduğunuz için teşekkür ederim.</p>

    <p style="${P}">Sevgilerle,<br /><strong>Celal</strong></p>
  `;
}

// ── English section ──────────────────────────────────────────────────────────

function englishSection(unsubUrl: string): string {
  return `
    <h2 style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0 0 16px;">
      🇬🇧 English
    </h2>

    <p style="${P}">Hey,</p>

    <p style="${P}">Hope you're well.</p>

    <p style="${P}">
      Quick update — things are moving faster than I expected.
    </p>

    <p style="${P}">
      The core screens are done: calendar, reminders, focus timer. I'm building with
      iOS&nbsp;26's new Liquid Glass design language. But the real challenge isn't making it
      look nice — it's making it <em>calm</em>. ADHD brains are already overstimulated.
      An app should reduce that, not add to it. Visually engaging but quiet.
      Getting that balance right is harder than I thought.
    </p>

    <p style="${P}">
      <strong>Now the exciting part: the 3D orbital view.</strong>
    </p>

    <p style="${P}">
      Each ring is a day. Each sphere is a task. You can drag tasks toward the NOW sphere.
      It looks great — but what I'm actively working on right now is visual communication.
      Someone opening that screen for the first time should understand it intuitively,
      without reading anything, without asking "what is this?" Still figuring it out.
    </p>

    <p style="${P}">
      Also: grounding everything in ADHD science matters a lot to me. I've been reading
      Russell Barkley's books and papers — on attention, impulse control, time perception.
      Really valuable. Slightly wild idea, but getting feedback from him or his team on
      this app would be incredible. Probably not realistic. But it's been on my mind.
    </p>

    <p style="${P}">
      <strong>Last thing — a small exciting moment.</strong>
    </p>

    <p style="${P}">
      When I first built the 3D screen, everything was static. My wife said:
      "what if the elements rotated?" We tried it. It worked. I recorded the moment
      it first came alive.
    </p>

    ${videoBlock(IMG.videoThumb, VIDEO_URL)}

    <div style="height:24px;"></div>

    <p style="${P}">
      If you have thoughts, feedback, or questions — just reply. I actually read everything.
    </p>

    <p style="${P}">Thank you for being here.</p>

    <p style="${P}">Love,<br /><strong>Celal</strong></p>
  `;
}

// ── Paragraph style ──────────────────────────────────────────────────────────

const P = "margin:0 0 16px;font-size:16px;line-height:1.7;color:#1a1a1a;";

// ── Main builder ─────────────────────────────────────────────────────────────

export function buildBlastEmail(params: {
  unsubUrl: string;
}): { html: string; text: string } {
  const { unsubUrl } = params;

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Orbly — Güncelleme / Progress Update</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Card wrapper -->
    <div style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

      <!-- Logo / wordmark -->
      <p style="margin:0 0 32px;font-size:18px;font-weight:700;letter-spacing:-0.5px;color:#1a1a1a;">
        Orbly
      </p>

      <!-- Turkish section -->
      ${turkishSection(unsubUrl)}

      <!-- Divider -->
      <div style="border-top:1px solid #e8e8e8;margin:40px 0;"></div>

      <!-- English section -->
      ${englishSection(unsubUrl)}

      <!-- Footer -->
      <div style="border-top:1px solid #f0f0f0;margin-top:40px;padding-top:24px;">
        <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
          Bu e-postayı almak istemiyorsanız —
          <a href="${unsubUrl}" style="color:#aaa;">abonelikten çıkın</a>.<br />
          If you no longer want these emails —
          <a href="${unsubUrl}" style="color:#aaa;">unsubscribe here</a>.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  const text = `ORBLY — GÜNCELLEME / PROGRESS UPDATE
======================================

🇹🇷 TÜRKÇE

Merhaba,

Umarım iyisinizdir. Kısa tutacağım, direkt konuya gireyim.

Her şey beklenenden hızlı ilerliyor.

Temel ekranlar hazır: takvim, hatırlatıcılar, odak zamanlayıcısı. iOS 26'nın Liquid Glass tasarım diliyle ilerliyorum. Ama asıl mesele şu: ADHD beyin zaten her an bombardımana uğruyor. Bir uygulama buna eklemek yerine sakinleştirmeli. İlgi çeken ama sade. Bu dengeyi kurmak düşündüğümden çok daha zor.

En eğlenceli kısma geliyorum: 3D orbital ekran.

Her halka bir gün. Her küre bir görev. Taskları NOW küresine doğru sürükleyebiliyorsunuz. Görsel iletişim üzerinde çalışıyorum — o ekrana bakan birinin sezgisel olarak anlayabilmesi lazım.

Yaptıklarımı bilimsel temele oturtmak benim için çok önemli. Russell Barkley'nin kitaplarını ve makalelerini okuyorum. Biraz hayali ama ondan bir geri bildirim almak inanılmaz olurdu.

Son olarak, küçük ama güzel bir an. 3D ekranı ilk kurduğumda her şey statikti. Eşim "ekrandakiler dönseydi nasıl olurdu?" dedi. Denedik. Çalıştı. O anı kaydettim: ${VIDEO_URL}

Düşünceleriniz, önerileriniz varsa — yanıtlayabilirsiniz. Gerçekten okuyorum.

Burada olduğunuz için teşekkür ederim.

Sevgilerle,
Celal

──────────────────────────────────────

🇬🇧 ENGLISH

Hey,

Hope you're well. Quick update — things are moving faster than I expected.

The core screens are done: calendar, reminders, focus timer. Building with iOS 26's Liquid Glass design language. But the real challenge isn't making it look nice — it's making it calm. ADHD brains are already overstimulated. Visually engaging but quiet. Getting that balance right is harder than I thought.

The exciting part: the 3D orbital view. Each ring is a day, each sphere is a task. You can drag tasks toward the NOW sphere. Working on the visual communication — someone should understand it intuitively on first look.

Grounding everything in ADHD science matters a lot to me. I've been reading Russell Barkley's work — attention, impulse control, time perception. Slightly wild idea, but getting his feedback on this app would be incredible. Probably not realistic. But it's been on my mind.

Last thing — a small exciting moment. When I first built the 3D screen, everything was static. My wife said: "what if the elements rotated?" We tried it. It worked. I recorded the moment: ${VIDEO_URL}

If you have thoughts or questions — just reply. I actually read everything.

Thank you for being here.

Love,
Celal

──────────────────────────────────────
Unsubscribe: ${"{UNSUB_URL}"}`;

  return { html, text };
}
