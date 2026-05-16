import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WATCHES, imgUrl } from "@/lib/maserati-watches";
import { useWishlist } from "@/lib/use-wishlist";
import { LuxuryCursor } from "@/components/maserati/LuxuryCursor";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Your Wishlist — Maserati Watches" },
      { name: "description", content: "Your privately curated selection of Maserati timepieces." },
    ],
  }),
});

function WishlistPage() {
  const { list, toggle } = useWishlist();

  useEffect(() => {
    document.documentElement.classList.add("maserati");
    document.body.classList.add("maserati");
    return () => {
      document.documentElement.classList.remove("maserati");
      document.body.classList.remove("maserati");
    };
  }, []);

  const items = WATCHES.filter((w) => list.includes(w.slug));

  return (
    <div className="mas wl-page">
      <LuxuryCursor />

      {/* HEADER */}
      <header className="wl-header">
        <Link to="/" className="wl-back">
          <span className="wl-back-arrow">←</span> Back to Showroom
        </Link>
        <img src={imgUrl("orignal_logo.png")} alt="Maserati Watches" className="wl-logo" />
        <span className="wl-count">
          {items.length} {items.length === 1 ? "piece" : "pieces"}
        </span>
      </header>

      <section className="wl-section">
        {/* TITLE */}
        <div className="wl-hero">
          <div className="wl-sup">Privately Curated</div>
          <h1 className="wl-title">Your Wishlist</h1>
          <div className="wl-rule" />
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">♡</div>
            <p className="wl-empty-msg">Your wishlist is empty. Begin curating your collection.</p>
            <Link to="/" className="wl-explore-btn">Explore Collections</Link>
          </div>
        ) : (
          <>
            {/* SUMMARY BAR */}
            <div className="wl-summary">
              <span className="wl-summary-txt">{items.length} {items.length === 1 ? "timepiece" : "timepieces"} selected</span>
              <button className="wl-clear" onClick={() => items.forEach((w) => toggle(w.slug))}>
                Clear all
              </button>
            </div>

            {/* GRID */}
            <motion.div className="wl-grid" layout>
              <AnimatePresence>
                {items.map((w, i) => (
                  <motion.div
                    key={w.slug}
                    className="card"
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, delay: i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ position: "relative" }}
                  >
                    {/* REMOVE BUTTON */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(w.slug); }}
                      aria-label="Remove from wishlist"
                      className="wl-remove"
                    >♥</button>

                    <Link to="/watch/$slug" params={{ slug: w.slug }}>
                      <div className="thumb">
                        <img src={imgUrl(w.img)} alt={w.name} loading="lazy" />
                      </div>
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* FOOTER CTA */}
            <div className="wl-footer-cta">
              <Link to="/" className="wl-continue">← Continue Browsing</Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
