/* ── Maserati Watches — shared interactions v2 ── */

// ─── SESSION HELPERS ─────────────────────────────────────────────────────
function isLoggedIn() {
  return localStorage.getItem('mw_session') === '1' &&
         !!localStorage.getItem('mw_user');
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('mw_user') || 'null'); } catch { return null; }
}
function logout() {
  localStorage.removeItem('mw_session');
  window.location.href = 'login.html';
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('mw_wish') || '[]'); } catch { return []; }
}
function saveWishlist(w) { localStorage.setItem('mw_wish', JSON.stringify(w)); }

// ─── TOAST ───────────────────────────────────────────────────────────────
function toast(msg, type) {
  var old = document.getElementById('mw-toast');
  if (old) old.remove();
  var border = type === 'error' ? 'rgba(220,80,80,.45)' : 'rgba(167,160,117,.5)';
  var color  = type === 'error' ? 'rgb(220,140,120)'   : 'rgb(210,200,150)';
  var bg     = type === 'error' ? '#1a0f0f'             : '#141312';
  var el = document.createElement('div');
  el.id = 'mw-toast';
  el.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(30px);'
    + 'background:' + bg + ';border:1px solid ' + border + ';color:' + color + ';'
    + "font-family:'Josefin Sans',sans-serif;font-size:.64rem;letter-spacing:.18em;"
    + 'text-transform:uppercase;padding:.9rem 2rem;z-index:99999;opacity:0;'
    + 'transition:opacity .3s,transform .3s;white-space:nowrap;backdrop-filter:blur(12px);pointer-events:none';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(function() {
    el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(function() {
    el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(function() { if(el.parentNode) el.remove(); }, 350);
  }, 3200);
}

// ─── MODAL ───────────────────────────────────────────────────────────────
function createModal(html) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:9100;'
    + 'display:flex;align-items:center;justify-content:center;padding:1rem;'
    + 'opacity:0;transition:opacity .3s;backdrop-filter:blur(5px)';

  var box = document.createElement('div');
  box.style.cssText = 'background:#141312;border:1px solid rgba(167,160,117,.22);'
    + 'width:100%;max-width:480px;padding:2.5rem;position:relative;'
    + 'transform:translateY(22px);transition:transform .3s;'
    + "font-family:'Josefin Sans',sans-serif;color:rgb(167,160,117);"
    + 'max-height:90vh;overflow-y:auto';
  box.innerHTML = html;

  var xBtn = document.createElement('button');
  xBtn.innerHTML = '&times;';
  xBtn.style.cssText = 'position:absolute;top:.9rem;right:1rem;background:none;border:none;'
    + 'color:rgba(167,160,117,.4);font-size:1.5rem;cursor:pointer;line-height:1;transition:color .2s';
  xBtn.onmouseenter = function(){ this.style.color='rgb(167,160,117)'; };
  xBtn.onmouseleave = function(){ this.style.color='rgba(167,160,117,.4)'; };
  box.prepend(xBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  requestAnimationFrame(function() {
    overlay.style.opacity = '1'; box.style.transform = 'translateY(0)';
  });

  function close() {
    overlay.style.opacity = '0'; box.style.transform = 'translateY(22px)';
    setTimeout(function() { if(overlay.parentNode) overlay.remove(); }, 300);
  }
  xBtn.onclick = close;
  overlay.onclick = function(e){ if(e.target===overlay) close(); };
  document.addEventListener('keydown', function esc(e){
    if(e.key==='Escape'){ close(); document.removeEventListener('keydown',esc); }
  });
  return { close: close };
}

// ─── BUY NOW ─────────────────────────────────────────────────────────────
function openBuyModal(watchName, watchPrice) {
  // Guard: must be logged in (session + user)
  if (!isLoggedIn()) {
    toast('Please sign in to place an order', 'error');
    setTimeout(function() { window.location.href = 'login.html'; }, 1600);
    return;
  }

  var user = getUser();
  var savedName = (user && user.name) ? user.name : '';

  var IS = 'width:100%;height:44px;background:rgba(255,255,255,.04);'
         + 'border:1px solid rgba(167,160,117,.2);color:rgb(210,200,150);'
         + "font-family:'Josefin Sans',sans-serif;font-size:.82rem;padding:0 .9rem;"
         + 'outline:none;letter-spacing:.05em;transition:border-color .2s,background .2s;box-sizing:border-box';
  var LS = 'display:block;font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;'
         + 'color:rgba(167,160,117,.52);margin-bottom:.4rem';
  var FS = 'margin-bottom:1.1rem';

  var html = '<div style="text-align:center;margin-bottom:1.5rem">'
    + '<div style="font-size:.53rem;letter-spacing:.36em;text-transform:uppercase;color:rgba(167,160,117,.45);margin-bottom:.4rem">Order Confirmation</div>'
    + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.8rem;font-weight:300;color:rgb(210,200,150)">' + watchName + '</div>'
    + '</div>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(167,160,117,.12);border-bottom:1px solid rgba(167,160,117,.12);padding:1rem 0;margin-bottom:1.4rem">'
    + '<span style="font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(167,160,117,.5)">Total Amount</span>'
    + '<span style="font-family:\'Cormorant Garamond\',serif;font-size:1.45rem;color:rgb(167,160,117)">' + watchPrice + '</span>'
    + '</div>'
    + '<div style="' + FS + '"><label style="' + LS + '">Full Name</label>'
    +   '<input id="b-name" type="text" value="' + savedName + '" placeholder="Your full name" style="' + IS + '"></div>'
    + '<div style="' + FS + '"><label style="' + LS + '">Phone Number</label>'
    +   '<input id="b-phone" type="tel" placeholder="+91 00000 00000" style="' + IS + '"></div>'
    + '<div style="margin-bottom:1.4rem"><label style="' + LS + '">Delivery Address</label>'
    +   '<textarea id="b-addr" rows="3" placeholder="Your full delivery address" style="'
    +   IS.replace('height:44px;','') + 'padding:.7rem .9rem;resize:none"></textarea></div>'
    + '<button id="b-confirm" style="width:100%;height:46px;background:rgb(167,160,117);'
    +   'border:1px solid rgb(167,160,117);color:#111;font-family:\'Josefin Sans\',sans-serif;'
    +   'font-size:.68rem;letter-spacing:.26em;text-transform:uppercase;cursor:pointer;transition:background .25s">Confirm Order</button>'
    + '<div id="b-err" style="color:rgb(220,140,120);font-size:.6rem;letter-spacing:.1em;text-align:center;margin-top:.7rem;min-height:1rem"></div>';

  var modal = createModal(html);

  // Focus styles
  ['b-name','b-phone','b-addr'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('focus', function(){ this.style.borderColor='rgba(167,160,117,.55)'; this.style.background='rgba(167,160,117,.05)'; });
    el.addEventListener('blur',  function(){ this.style.borderColor='rgba(167,160,117,.2)';  this.style.background='rgba(255,255,255,.04)'; });
  });

  var confirmBtn = document.getElementById('b-confirm');
  confirmBtn.addEventListener('mouseenter', function(){ this.style.background='rgb(210,200,150)'; });
  confirmBtn.addEventListener('mouseleave', function(){ this.style.background='rgb(167,160,117)'; });

  confirmBtn.addEventListener('click', function() {
    var n = document.getElementById('b-name').value.trim();
    var p = document.getElementById('b-phone').value.trim();
    var a = document.getElementById('b-addr').value.trim();
    var errEl = document.getElementById('b-err');
    errEl.textContent = '';

    if (!n || !p || !a) { errEl.textContent = 'Please fill in all fields to continue.'; return; }
    if (p.replace(/[\s\-\+\(\)]/g,'').length < 7) { errEl.textContent = 'Please enter a valid phone number.'; return; }

    var orders = JSON.parse(localStorage.getItem('mw_orders') || '[]');
    orders.push({ id: Date.now(), watch: watchName, price: watchPrice, buyer: n, phone: p, address: a, date: new Date().toLocaleString() });
    localStorage.setItem('mw_orders', JSON.stringify(orders));
    modal.close();
    toast('✓  Order placed — we will contact you shortly');
  });
}

// ─── WISHLIST TOGGLE ──────────────────────────────────────────────────────
function setWishActive(btn, active) {
  btn.textContent   = active ? '♥' : '♡';
  btn.style.color       = active ? 'rgb(210,200,150)' : '';
  btn.style.borderColor = active ? 'rgba(167,160,117,.65)' : '';
  btn.style.background  = active ? 'rgba(167,160,117,.09)' : '';
  btn.title = active ? 'Remove from wishlist' : 'Add to wishlist';
}

function restoreWishBtn(btn, name) {
  var found = getWishlist().some(function(w){ return w.name === name; });
  setWishActive(btn, found);
}

function toggleWishlist(btn, name, price, img) {
  var wish = getWishlist();
  var idx  = wish.findIndex(function(w){ return w.name === name; });
  if (idx === -1) {
    wish.push({ name: name, price: price, img: img });
    saveWishlist(wish);
    setWishActive(btn, true);
    toast('♥  Added to wishlist');
  } else {
    wish.splice(idx, 1);
    saveWishlist(wish);
    setWishActive(btn, false);
    toast('Removed from wishlist');
  }
}

// ─── NAV USER BADGE ──────────────────────────────────────────────────────
function renderNavBadge(user) {
  var links = document.querySelectorAll('a[href="login.html"]');
  links.forEach(function(a) {
    if (a.dataset.mwbadge) return;
    a.dataset.mwbadge = '1';

    var initial   = user.name ? user.name.charAt(0).toUpperCase() : '?';
    var firstName = user.name ? user.name.split(' ')[0] : 'Account';

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;gap:.55rem';

    // Avatar
    var av = document.createElement('div');
    av.textContent = initial;
    av.title = 'Signed in as ' + user.email;
    av.style.cssText = 'width:28px;height:28px;border-radius:50%;'
      + 'background:rgba(167,160,117,.14);border:1px solid rgba(167,160,117,.5);'
      + 'display:flex;align-items:center;justify-content:center;'
      + 'font-size:.7rem;font-weight:700;color:rgb(210,200,150);'
      + 'flex-shrink:0;letter-spacing:0';

    // Name label
    var nameEl = document.createElement('span');
    nameEl.textContent = firstName;
    nameEl.style.cssText = 'font-size:.63rem;letter-spacing:.16em;text-transform:uppercase;'
      + 'color:rgb(210,200,150);font-weight:600;cursor:default;'
      + "font-family:'Josefin Sans',sans-serif";

    // Sign Out button
    var logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Sign Out';
    logoutBtn.style.cssText = 'background:none;border:1px solid rgba(167,160,117,.24);'
      + 'color:rgba(167,160,117,.52);cursor:pointer;padding:.22rem .55rem;'
      + "font-family:'Josefin Sans',sans-serif;font-size:.52rem;letter-spacing:.18em;"
      + 'text-transform:uppercase;transition:border-color .2s,color .2s';
    logoutBtn.addEventListener('mouseenter', function(){
      this.style.borderColor='rgba(167,160,117,.6)'; this.style.color='rgb(167,160,117)';
    });
    logoutBtn.addEventListener('mouseleave', function(){
      this.style.borderColor='rgba(167,160,117,.24)'; this.style.color='rgba(167,160,117,.52)';
    });
    logoutBtn.addEventListener('click', function(e){ e.preventDefault(); logout(); });

    wrapper.appendChild(av);
    wrapper.appendChild(nameEl);
    wrapper.appendChild(logoutBtn);
    a.parentNode.replaceChild(wrapper, a);
  });
}

// ─── BOOT ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  if (isLoggedIn()) {
    var u = getUser();
    if (u) renderNavBadge(u);
  }
});
