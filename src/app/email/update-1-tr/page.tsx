// Türkçe email versiyonu — orblyapp.com/email/update-1-tr

import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Orbly — Güncelleme",
  robots: "noindex",
};

const BASE = "https://orblyapp.com";
const VIDEO_URL = `${BASE}/email/video.mp4`;

export default function TurkishUpdatePage() {
  return (
    <main style={{
      background: "#f5f5f5",
      minHeight: "100vh",
      padding: "32px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>

          <p style={{ margin: "0 0 32px", fontSize: 18, fontWeight: 700, letterSpacing: -0.5, color: "#1a1a1a" }}>
            Orbly
          </p>

          <p style={P}>Merhaba, selamlar herkese!</p>

          <p style={P}>Umarım hepiniz iyisinizdir.</p>

          <p style={P}>Çok uzatmayıp direkt meseleye giriyorum.</p>

          <p style={P}>Her şey çok yolunda gidiyor.</p>

          <p style={P}>
            Temel ekranların tasarımı ve fonksiyonları hazır. Takvim, hatırlatıcılar, odak
            zamanlayıcısı çalışıyor. Şuan tamamen iOS&nbsp;26 odaklı, Liquid Glass ile
            ilerliyorum. Ama asıl önemli kısım şu: tasarımda kullanılan öğelerin çok fazla
            uyarıcı olmaması, cognitive overload yaratmaması. Hem ilgi çeken hem de low
            profile bir şey hedefliyorum. Bu dengeyi kurmak bazen gerçekten çok zor olabiliyor.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <img src={`${BASE}/email/timer-pomodoro.jpg`} alt="Pomodoro zamanlayıcı"
              style={{ width: "50%", borderRadius: 18 }} />
            <img src={`${BASE}/email/timer-timetimer.jpg`} alt="Time Timer"
              style={{ width: "50%", borderRadius: 18 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img src={`${BASE}/email/reminders.jpg`} alt="Hatırlatıcılar ekranı"
              style={{ maxWidth: 280, width: "100%", borderRadius: 22 }} />
          </div>

          <p style={P}><strong>Gelelim en eğlenceli kısma.</strong></p>

          <p style={P}>
            3D olarak orbitimiz ve tasklarımız gayet güzel gözüküyor. Taskları NOW küresine
            doğru çekebiliyoruz. Bu ekrandaki asıl sıkıntı ise görsel iletişim. Kullanıcının
            orbitteki halkaların ne anlama geldiğini, hangi elementin neyi ifade ettiğini
            kolay bir şekilde anlayabilmesi lazım. Hem UI hem UX tarafında bunu desteklemeye
            çalışıyorum. Yine burada da çok bunaltıcı olmamak önemli.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <img src={`${BASE}/email/orbit-week.jpg`} alt="Bu hafta görünümü"
              style={{ width: "50%", borderRadius: 18 }} />
            <img src={`${BASE}/email/orbit-day.jpg`} alt="Bugün görünümü"
              style={{ width: "50%", borderRadius: 18 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={`${BASE}/email/orbit-all.jpg`} alt="Nisan 2026 görünümü"
              style={{ maxWidth: 280, width: "100%", borderRadius: 22 }} />
          </div>

          <p style={P}>
            Bir de şunu söyleyeyim. Yaptıklarımı bilimsel çalışmalarla desteklemek benim
            için oldukça kritik. Russell Barkley harika bir adam, kitaplarından ve
            makalelerinden çok değerli ipuçları yakalıyorum. Bilmiyorum, uçuk bir fikir mi
            ama ondan ya da ekibinden bu uygulama için bir geri bildirim almak harika olurdu.
            Tabi ABD'deki sağlık mevzuatı bunu zorlaştırıyor olabilir. Ya da beni hiç
            umursamaz bile. Neyse, biraz dağıldım.
          </p>

          <p style={P}><strong>Şimdi size küçük bir heyecan anını paylaşmak istiyorum.</strong></p>

          <p style={P}>
            3D ekranı ilk kurduğumda her şey statikti. Eşim "ekrandakiler dönseydi nasıl
            olurdu?" dedi. Denedik. Çalıştı. O anı kayıt altına aldım.
          </p>

          <div style={{ marginBottom: 24 }}>
            <a href={VIDEO_URL} target="_blank" style={{ display: "block", textDecoration: "none" }}>
              <img src={`${BASE}/email/video-thumb.jpg`} alt="Videoyu izle"
                style={{ width: "100%", borderRadius: 16, display: "block" }} />
            </a>
          </div>

          <p style={P}>
            Buraya kadar gördüklerinizle ilgili düşünceleriniz, önerileriniz ya da herhangi bir sorunuz varsa bana ulaşın lütfen, fikirleriniz benim için çok değerli.
          </p>

          <p style={P}>Burada olduğunuz için teşekkür ederim.</p>

          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#1a1a1a" }}>
            Sağlıcakla kalın.<br />
            Sevgilerle, <strong>Celal</strong>
          </p>

        </div>
      </div>
    </main>
  );
}

const P: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 16,
  lineHeight: 1.7,
  color: "#1a1a1a",
};
