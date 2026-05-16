import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ParticleField } from "@/components/maserati/ParticleField";
import { LuxuryCursor } from "@/components/maserati/LuxuryCursor";
import { WATCHES, watchesByCollection, imgUrl, type Watch } from "@/lib/maserati-watches";
import { useWishlist } from "@/lib/use-wishlist";

export const Route = createFileRoute("/")({
  component: MaseratiHome,
  head: () => ({
    meta: [
      { title: "Maserati Watches — Italian Precision Since 1914" },
      {
        name: "description",
        content:
          "A cinematic 3D showroom of Maserati luxury watches — Italian artistry, automotive heritage, and futuristic timekeeping.",
      },
    ],
  }),
});

const IMG = (name: string) => `/maserati/${encodeURI(name)}`;
const LIMITED = watchesByCollection("Limited Edition");
const EXCLUSIVE = watchesByCollection("Exclusive");
const GOLDEN = watchesByCollection("Golden");
const SIGNATURE = WATCHES[0];

const TIMELINE = [
  { year: "1914", title: "The Trident Rises", desc: "The Maserati brothers found their workshop in Bologna — a spirit of Italian artistry born from the racing track." },
  { year: "1939", title: "Three Crowns at Indianapolis", desc: "Three consecutive victories at Indianapolis cement Maserati's legend in international motorsport." },
  { year: "2014", title: "A Century of Excellence", desc: "Maserati celebrates 100 years of design, engineering, and uncompromising luxury." },
  { year: "Today", title: "Italian Precision on the Wrist", desc: "The trident migrates from the bonnet to the bezel — automotive-grade timepieces for the modern connoisseur." },
];

const TESTIMONIALS = [
  { quote: "An heirloom in the truest sense — every glance at the dial feels like the first turn of a key in a Granturismo.", author: "Alessandro Ricci", role: "Collector · Milan" },
  { quote: "The trident on the wrist is unmistakable. Italian elegance, automotive soul, perfect proportions.", author: "Sophia Laurent", role: "Editor · Robb Report" },
  { quote: "Maserati Watches has redefined what a heritage brand can do at the intersection of haute horlogerie and motorsport.", author: "James Whitfield", role: "Curator · Phillips" },
];

function MaseratiHome() {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Apply maserati class to html/body
  useEffect(() => {
    document.documentElement.classList.add("maserati");
    document.body.classList.add("maserati");
    return () => {
      document.documentElement.classList.remove("maserati");
      document.body.classList.remove("maserati");
    };
  }, []);

  // Nav scroll state
  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll(".mas .r");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("on"), i * 60);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // GSAP hero entrance + parallax tilt on hero text
  useEffect(() => {
    if (!heroTextRef.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-text > *", {
        y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, delay: 0.2,
      });
    }, heroTextRef);
    return () => ctx.revert();
  }, [reduce]);

  // 3D tilt on cards
  useEffect(() => {
    if (reduce) return;
    const cards = document.querySelectorAll<HTMLElement>(".mas .card");
    const handlers: Array<() => void> = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`;
      };
      const onLeave = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => handlers.forEach((fn) => fn());
  }, [reduce]);

  // Hero parallax on mouse
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="mas">
      <LuxuryCursor />
      <ParticleField />

      {/* NAV */}
      <nav ref={navRef}>
        <div className="logo">
          <img src={IMG("orignal_logo.png")} alt="Maserati Watches" />
        </div>
        <ul ref={linksRef} className={`nav-links ${open ? "open" : ""}`}>
          <li><a href="#top" onClick={() => setOpen(false)}>Home</a></li>
          <li><a href="#limited" onClick={() => setOpen(false)}>Collections</a></li>
          <li><a href="#showcase" onClick={() => setOpen(false)}>Showcase</a></li>
          <li><a href="#story" onClick={() => setOpen(false)}>Heritage</a></li>
          <li><a href="#About" onClick={() => setOpen(false)}>About</a></li>
          <li><a href="#Contact" onClick={() => setOpen(false)}>Contact</a></li>
          <li><WishlistNavLink onClick={() => setOpen(false)} /></li>
          <li>
            <a href="#newsletter" className="nav-login" onClick={() => setOpen(false)}>Subscribe</a>
          </li>
        </ul>
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <video src={IMG("final-project-video.mp4")} autoPlay loop muted playsInline />
        <div className="hero-vignette" />
        <div className="hero-overlay">
          <div
            className="hero-text"
            ref={heroTextRef}
            style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
          >
            <div className="eyebrow-line">Italian Precision Since 1914</div>
            <h1>
              Explore the World<br />of <em>Maserati</em>
            </h1>
            <p>
              Where Italian artistry meets cutting-edge precision. A legacy of innovation,
              style, and sophistication crafted for those who demand excellence.
            </p>
            <div className="hero-ctas">
              <MagneticLink href="#limited" className="btn-primary">Discover Collections</MagneticLink>
              <MagneticLink href="#story" className="btn-ghost">Our Story</MagneticLink>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {[
          { n: <>110<sup style={{ fontSize: ".5em" }}>+</sup></>, l: "Years of Heritage" },
          { n: "12", l: "Exclusive Pieces" },
          { n: "48", l: "Countries Delivered" },
          { n: "∞", l: "Crafted to Last" },
        ].map((s, i) => (
          <div key={i} className="stat r">
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* LIMITED */}
      <Collection id="limited" sup="Most Exclusive" title="Limited Edition" items={LIMITED} />

      {/* SHOWCASE — Signature piece */}
      <section id="showcase" className="showcase r">
        <div className="showcase-stage">
          <span className="showcase-label">Signature</span>
          <span className="showcase-tag">{SIGNATURE.name}</span>
          <div className="showcase-glow" aria-hidden />
          <motion.img
            src={imgUrl(SIGNATURE.img)}
            alt={SIGNATURE.name}
            animate={{ y: [0, -14, 0], rotate: [-1.2, 1.2, -1.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "10%", filter: "drop-shadow(0 30px 60px rgba(0,0,0,.65))", zIndex: 2 }}
          />
        </div>
        <div className="showcase-info">
          <div className="eyebrow-line" style={{ marginBottom: "1rem" }}>Signature Piece</div>
          <h3>{SIGNATURE.name} — Engineered for the Wrist of a Connoisseur.</h3>
          <p>{SIGNATURE.desc}</p>
          <dl className="spec-grid">
            <div className="spec"><dt>Movement</dt><dd>{SIGNATURE.movement}</dd></div>
            <div className="spec"><dt>Case</dt><dd>{SIGNATURE.case}</dd></div>
            <div className="spec"><dt>Crystal</dt><dd>{SIGNATURE.crystal}</dd></div>
            <div className="spec"><dt>Water Resistance</dt><dd>{SIGNATURE.water}</dd></div>
          </dl>
          <div style={{ marginTop: "1.6rem" }}>
            <Link to="/watch/$slug" params={{ slug: SIGNATURE.slug }} className="about-cta">View Details</Link>
          </div>
        </div>
      </section>

      {/* EXCLUSIVE */}
      <Collection id="exclusive" sup="Curated Selection" title="Exclusive Collection" items={EXCLUSIVE} />

      {/* GOLDEN */}
      <Collection id="golden" sup="Pinnacle of Luxury" title="Golden Collection" items={GOLDEN} />

      {/* TIMELINE */}
      <section id="story" className="timeline">
        <div className="sec-head r" style={{ padding: 0 }}>
          <span className="sup">Our Heritage</span>
          <h2>A Century of Italian Craft</h2>
          <div className="orn"><span className="diamond" /></div>
        </div>
        <div className="tl-track">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.year}
              className="tl-item r"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="tl-year">{t.year}</div>
              <div className="tl-title">{t.title}</div>
              <div className="tl-desc">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="sec-head r" style={{ padding: 0 }}>
          <span className="sup">Voices of the Collectors</span>
          <h2>What They Say</h2>
          <div className="orn"><span className="diamond" /></div>
        </div>
        <div className="test-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="test-card r"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <p className="test-quote">{t.quote}</p>
              <div className="test-author">{t.author}</div>
              <div className="test-role">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="About" className="about">
        <div className="about-img r">
          <img src={IMG("about_us.webp")} alt="Maserati craftsmanship" loading="lazy" />
        </div>
        <div className="about-txt r">
          <div className="about-lbl">Our Story</div>
          <h2>Italian Elegance.<br />Automotive Heritage.</h2>
          <div className="rule" />
          <p>
            Maserati, renowned for its luxury automobiles, extends its design excellence to a
            range of watches that blend Italian elegance with automotive-inspired aesthetics.
            These timepieces cater to individuals who appreciate versatile and original styles.
          </p>
          <p>
            Maserati watches are crafted with high-quality materials, ensuring both durability
            and comfort. The designs incorporate elements from Maserati's automotive heritage —
            the trident emblem, sporty proportions — making them suitable for both everyday
            wear and formal occasions.
          </p>
          <a href="#Contact" className="about-cta">Contact Us</a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="newsletter r">
        <h3>Join the Trident Circle</h3>
        <p>
          Receive private invitations to launches, atelier previews, and exclusive Maserati
          horology editions — delivered with the discretion you expect.
        </p>
        <form className="news-form" onSubmit={(e) => { e.preventDefault(); }}>
          <input type="email" required placeholder="Your email address" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* CONTACT */}
      <section id="Contact" className="contact">
        <div className="contact-blk r">
          <h3>Get in Touch</h3>
          <div className="ci"><div className="ci-icon">📞</div><div className="ci-txt"><strong>Phone</strong>+1 (555) 123-4567</div></div>
          <div className="ci"><div className="ci-icon">✉</div><div className="ci-txt"><strong>Email</strong>support@MaseratiWatches.com</div></div>
          <div className="ci"><div className="ci-icon">🕒</div><div className="ci-txt"><strong>Hours</strong>Monday – Friday, 9:00 AM – 6:00 PM EST</div></div>
          <div className="sep ci"><div className="ci-icon">🏢</div><div className="ci-txt"><strong>Head Office</strong>123 Luxury Lane, Metropolis City, 10101, USA</div></div>
        </div>
        <div className="contact-blk r">
          <h3>Follow Us</h3>
          <ul className="socials">
            <li><a href="https://www.instagram.com">Instagram — @MaseratiWatches</a></li>
            <li><a href="https://www.facebook.com">Facebook — @MaseratiWatches</a></li>
            <li><a href="https://www.twitter.com">Twitter — @MaseratiWatches</a></li>
          </ul>
          <div className="sep"><div className="ci-txt" style={{ marginTop: ".4rem" }}><strong>Website</strong>www.MaseratiWatches.com</div></div>
        </div>
      </section>

      <footer>
        <p>© 2024 Maserati Watches. All rights reserved.</p>
        <div className="trident">⚜</div>
        <p>Italian Precision Since 1914</p>
      </footer>
    </div>
  );
}

function Collection({ id, sup, title, items }: { id: string; sup: string; title: string; items: Watch[] }) {
  const { has, toggle } = useWishlist();
  return (
    <section id={id} className="coll">
      <div className="sec-head r">
        <span className="sup">{sup}</span>
        <h2>{title}</h2>
        <div className="orn"><span className="diamond" /></div>
      </div>
      <div className="grid4" style={{ marginTop: "2.5rem" }}>
        {items.map((w, i) => (
          <div key={i} className="card r" style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(w.slug); }}
              aria-label={has(w.slug) ? "Remove from wishlist" : "Add to wishlist"}
              data-cursor="hover"
              style={{ position: "absolute", top: 12, right: 12, zIndex: 3, width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(232,220,170,.45)", background: has(w.slug) ? "rgba(232,220,170,.18)" : "rgba(0,0,0,.45)", color: has(w.slug) ? "rgb(232,220,170)" : "rgba(232,220,170,.85)", fontSize: "1.05rem", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .25s" }}
            >{has(w.slug) ? "♥" : "♡"}</button>
            <Link to="/watch/$slug" params={{ slug: w.slug }}>
              <div className="thumb"><img src={IMG(w.img)} alt={w.name} loading="lazy" /></div>
              <div className="info">
                <div>
                  <div className="tag">{w.tag}</div>
                  <div className="name">{w.name}</div>
                  <div className="price">{w.price}</div>
                </div>
                <div className="act">
                  <span className="lbl">View Details</span>
                  <div className="arr">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function WishlistNavLink({ onClick }: { onClick: () => void }) {
  const { count } = useWishlist();
  return (
    <Link to="/wishlist" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
      <span>Wishlist</span>
      {count > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "rgb(167,160,117)", color: "#111", fontSize: ".58rem", fontWeight: 600, letterSpacing: 0 }}>{count}</span>
      )}
    </Link>
  );
}

function MagneticLink({
  href, className, children,
}: { href: string; className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);
  return <a ref={ref} href={href} className={className}>{children}</a>;
}
