import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { watchBySlug, imgUrl, WATCHES } from "@/lib/maserati-watches";
import { LuxuryCursor } from "@/components/maserati/LuxuryCursor";
import { useWishlist } from "@/lib/use-wishlist";

export const Route = createFileRoute("/watch/$slug")({
  component: WatchDetail,
  notFoundComponent: () => (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", color: "#a7a075", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
      Watch not found — <Link to="/" style={{ marginLeft: 8, textDecoration: "underline" }}>back to home</Link>
    </div>
  ),
});

function WatchDetail() {
  const { slug } = useParams({ from: "/watch/$slug" });
  const navigate = useNavigate();
  const watch = watchBySlug(slug);
  const { has, toggle } = useWishlist();
  const wished = watch ? has(watch.slug) : false;
  const [buyOpen, setBuyOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("maserati");
    document.body.classList.add("maserati");
    return () => {
      document.documentElement.classList.remove("maserati");
      document.body.classList.remove("maserati");
    };
  }, []);

  useEffect(() => {
    if (!watch) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [watch]);

  if (!watch) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", color: "#a7a075" }}>
        Watch not found. <Link to="/">Go home</Link>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const toggleWish = () => {
    const isOn = toggle(watch.slug);
    showToast(isOn ? "♥  Added to wishlist" : "Removed from wishlist");
  };

  const related = WATCHES.filter((w) => w.collection === watch.collection && w.slug !== watch.slug).slice(0, 3);

  return (
    <div className="mas" style={{ minHeight: "100vh", background: "#0c0c0b", color: "var(--mas-gold)" }}>
      <LuxuryCursor />
      {/* Top bar */}
      <header className="mas-detail-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.6rem clamp(1.2rem, 5vw, 4rem)", borderBottom: "1px solid rgba(167,160,117,.15)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: ".7rem", color: "rgb(210,200,150)", textDecoration: "none", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase" }}>
          <span style={{ fontSize: "1.1rem" }}>←</span> Back to Showroom
        </Link>
        <img src={imgUrl("orignal_logo.png")} alt="Maserati Watches" style={{ height: 36 }} />
        <button onClick={toggleWish} aria-label="Toggle wishlist" style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(167,160,117,.4)", background: wished ? "rgba(167,160,117,.12)" : "transparent", color: wished ? "rgb(232,220,170)" : "rgba(167,160,117,.7)", fontSize: "1.1rem", cursor: "pointer" }}>{wished ? "♥" : "♡"}</button>
      </header>

      {/* Detail */}
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: "clamp(2rem, 6vw, 6rem)", padding: "clamp(2rem, 6vw, 6rem) clamp(1.2rem, 5vw, 6rem)", alignItems: "center" }} className="watch-detail-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ position: "relative", aspectRatio: "1 / 1", border: "1px solid rgba(167,160,117,.18)", overflow: "hidden", background: "radial-gradient(circle at 50% 45%, rgba(232,220,170,.12), transparent 65%)" }}
        >
          <div style={{ position: "absolute", inset: "8%", border: "1px dashed rgba(167,160,117,.18)", borderRadius: "50%", animation: "masOrbit 28s linear infinite" }} />
          <motion.img
            src={imgUrl(watch.img)}
            alt={watch.name}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "8%", filter: "drop-shadow(0 30px 60px rgba(0,0,0,.6))" }}
          />
          <span style={{ position: "absolute", top: "1.2rem", left: "1.2rem", fontSize: ".5rem", letterSpacing: ".3em", color: "rgba(167,160,117,.6)", textTransform: "uppercase" }}>Signature · {watch.collection}</span>
          <span style={{ position: "absolute", bottom: "1.2rem", right: "1.2rem", fontSize: ".5rem", letterSpacing: ".3em", color: "rgba(167,160,117,.6)", textTransform: "uppercase" }}>{watch.name}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1.2rem", fontSize: ".55rem", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(167,160,117,.55)" }}>
            <span style={{ width: 28, height: 1, background: "rgba(167,160,117,.5)" }} /> {watch.tag}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)", lineHeight: 1.05, color: "rgb(232,220,170)", margin: 0 }}>{watch.name}</h1>
          <div style={{ marginTop: "1.4rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "rgb(210,200,150)" }}>{watch.price}</div>

          <p style={{ marginTop: "1.6rem", color: "rgba(210,200,150,.78)", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".88rem", lineHeight: 1.8, fontWeight: 300 }}>{watch.desc}</p>

          <dl style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(167,160,117,.15)", borderLeft: "1px solid rgba(167,160,117,.15)" }}>
            {[
              ["Movement", watch.movement],
              ["Case", watch.case],
              ["Crystal", watch.crystal],
              ["Water Resistance", watch.water],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "1.1rem 1.2rem", borderRight: "1px solid rgba(167,160,117,.15)", borderBottom: "1px solid rgba(167,160,117,.15)" }}>
                <dt style={{ fontSize: ".5rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(167,160,117,.55)", marginBottom: ".5rem" }}>{k}</dt>
                <dd style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(210,200,150)" }}>{v}</dd>
              </div>
            ))}
          </dl>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2.2rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setBuyOpen(true)}
              style={{ flex: "1 1 220px", height: 54, background: "rgb(167,160,117)", border: "1px solid rgb(167,160,117)", color: "#111", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".7rem", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgb(210,200,150)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(167,160,117)")}
            >Buy Now</button>
            <button
              onClick={toggleWish}
              style={{ flex: "1 1 220px", height: 54, background: wished ? "rgba(167,160,117,.1)" : "transparent", border: "1px solid rgba(167,160,117,.4)", color: wished ? "rgb(232,220,170)" : "rgb(167,160,117)", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".7rem", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s, border-color .25s" }}
            >{wished ? "♥  Wishlisted" : "♡  Add to Wishlist"}</button>
          </div>
        </motion.div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: "clamp(2rem, 6vw, 5rem) clamp(1.2rem, 5vw, 6rem)", borderTop: "1px solid rgba(167,160,117,.15)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "rgb(232,220,170)" }}>More from the {watch.collection} Collection</h2>
            <button onClick={() => navigate({ to: "/", hash: watch.collection === "Limited Edition" ? "limited" : watch.collection.toLowerCase() })} style={{ background: "none", border: "none", color: "rgb(167,160,117)", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".62rem", letterSpacing: ".24em", textTransform: "uppercase", cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {related.map((r) => (
              <Link key={r.slug} to="/watch/$slug" params={{ slug: r.slug }} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div whileHover={{ y: -6 }} style={{ border: "1px solid rgba(167,160,117,.18)", overflow: "hidden", background: "#111" }}>
                  <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "#0a0a09" }}>
                    <img src={imgUrl(r.img)} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }} loading="lazy" />
                  </div>
                  <div style={{ padding: "1rem 1.2rem" }}>
                    <div style={{ fontSize: ".48rem", letterSpacing: ".3em", color: "rgba(167,160,117,.55)", textTransform: "uppercase" }}>{r.tag}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "rgb(232,220,170)", marginTop: ".4rem" }}>{r.name}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgb(167,160,117)", marginTop: ".3rem" }}>{r.price}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Buy modal */}
      {buyOpen && (
        <BuyModal watch={watch} onClose={() => setBuyOpen(false)} onPlaced={() => { setBuyOpen(false); showToast("✓  Order placed — we'll be in touch"); }} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", background: "#141312", border: "1px solid rgba(167,160,117,.5)", color: "rgb(210,200,150)", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".64rem", letterSpacing: ".18em", textTransform: "uppercase", padding: ".9rem 2rem", zIndex: 99999, backdropFilter: "blur(12px)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function BuyModal({ watch, onClose, onPlaced }: { watch: { name: string; price: string; slug: string }; onClose: () => void; onPlaced: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!name.trim() || !phone.trim() || !addr.trim()) { setErr("Please fill in all fields."); return; }
    if (phone.replace(/[\s\-+()]/g, "").length < 7) { setErr("Please enter a valid phone number."); return; }
    const orders = JSON.parse(localStorage.getItem("mw_orders") || "[]");
    orders.push({ id: Date.now(), watch: watch.name, slug: watch.slug, price: watch.price, buyer: name, phone, address: addr, date: new Date().toLocaleString() });
    localStorage.setItem("mw_orders", JSON.stringify(orders));
    onPlaced();
  };

  const input: React.CSSProperties = { width: "100%", height: 44, background: "rgba(255,255,255,.04)", border: "1px solid rgba(167,160,117,.2)", color: "rgb(210,200,150)", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".82rem", padding: "0 .9rem", outline: "none", letterSpacing: ".05em", boxSizing: "border-box" };
  const label: React.CSSProperties = { display: "block", fontSize: ".56rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(167,160,117,.6)", marginBottom: ".4rem" };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", zIndex: 9100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(5px)" }}>
      <motion.div initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: "#141312", border: "1px solid rgba(167,160,117,.22)", width: "100%", maxWidth: 480, padding: "2.5rem", color: "rgb(167,160,117)", fontFamily: "'Josefin Sans', sans-serif", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: ".7rem", right: 1, background: "none", border: "none", color: "rgba(167,160,117,.5)", fontSize: "1.5rem", cursor: "pointer", padding: ".4rem 1rem" }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: ".53rem", letterSpacing: ".36em", textTransform: "uppercase", color: "rgba(167,160,117,.5)", marginBottom: ".4rem" }}>Order Confirmation</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "rgb(210,200,150)" }}>{watch.name}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(167,160,117,.12)", borderBottom: "1px solid rgba(167,160,117,.12)", padding: "1rem 0", marginBottom: "1.4rem" }}>
          <span style={{ fontSize: ".57rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(167,160,117,.5)" }}>Total Amount</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", color: "rgb(167,160,117)" }}>{watch.price}</span>
        </div>
        <div style={{ marginBottom: "1.1rem" }}><label style={label}>Full Name</label><input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></div>
        <div style={{ marginBottom: "1.1rem" }}><label style={label}>Phone Number</label><input style={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" /></div>
        <div style={{ marginBottom: "1.4rem" }}><label style={label}>Delivery Address</label><textarea rows={3} value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Your full delivery address" style={{ ...input, height: "auto", padding: ".7rem .9rem", resize: "none" }} /></div>
        <button onClick={submit} style={{ width: "100%", height: 46, background: "rgb(167,160,117)", border: "1px solid rgb(167,160,117)", color: "#111", fontFamily: "'Josefin Sans', sans-serif", fontSize: ".68rem", letterSpacing: ".26em", textTransform: "uppercase", cursor: "pointer" }}>Confirm Order</button>
        {err && <div style={{ color: "rgb(220,140,120)", fontSize: ".6rem", letterSpacing: ".1em", textAlign: "center", marginTop: ".7rem" }}>{err}</div>}
      </motion.div>
    </div>
  );
}