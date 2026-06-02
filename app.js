/* =====================================================================
   إعدادات الموقع — بدّل هاد القيم فقط ملي تسيفط ليا المعلومات الكاملة
   ===================================================================== */
const CONFIG = {
  name: "Salon Chez Anas",          // السمية ديال المحل
  phone: "+212 668-510690",         // رقم الهاتف (للعرض)
  phoneRaw: "212668510690",         // الرقم بلا رموز (للروابط)
  whatsappMessage: "السلام، بغيت نحجز موعد فالصالون 💈", // رسالة الواتساب الجاهزة
  hoursOpen: "11:00",
  hoursClose: "20:30",
  hoursDays: "من الاثنين إلى السبت",

  // الخدمات — زيد / حيّد / بدّل كيفما بغيتي
  services: [
    { ico: "💈", title: "حلاقة كلاسيكية", desc: "حلاقة عصرية على ذوقك بأيدي محترفين.", price: "" },
    { ico: "🧔", title: "تهذيب اللحية", desc: "تشكيل وتنعيم اللحية بأحدث التقنيات.", price: "" },
    { ico: "✂️", title: "حلاقة + غسيل", desc: "تجربة كاملة مع غسيل وعناية بالشعر.", price: "" },
    { ico: "🧴", title: "عناية بالوجه", desc: "تنظيف وترطيب البشرة لإطلالة منعشة.", price: "" },
  ],
};

/* =====================================================================
   لا حاجة لتعديل ما تحت — منطق الموقع
   ===================================================================== */
(function () {
  const waLink = `https://wa.me/${CONFIG.phoneRaw}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  const telLink = `tel:+${CONFIG.phoneRaw}`;

  // حقن البيانات النصية
  document.querySelectorAll('[data-field]').forEach((el) => {
    const f = el.getAttribute('data-field');
    switch (f) {
      case 'name': el.textContent = CONFIG.name; break;
      case 'phone': el.textContent = CONFIG.phone; break;
      case 'phone-link': el.setAttribute('href', telLink); break;
      case 'whatsapp-link': el.setAttribute('href', waLink); break;
      case 'hours-open': el.textContent = CONFIG.hoursOpen; break;
      case 'hours-close': el.textContent = CONFIG.hoursClose; break;
      case 'hours-days': el.textContent = CONFIG.hoursDays; break;
    }
  });

  // السنة فالفوتر
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // توليد بطاقات الخدمات
  const cardsWrap = document.getElementById('serviceCards');
  if (cardsWrap) {
    CONFIG.services.forEach((s, i) => {
      const c = document.createElement('div');
      c.className = 'card reveal';
      c.setAttribute('data-anim', 'fade-up');
      c.style.setProperty('--d', (i * 0.08) + 's');
      c.innerHTML = `
        <span class="ico">${s.ico}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        ${s.price ? `<span class="price">${s.price}</span>` : ''}`;
      cardsWrap.appendChild(c);
    });
  }

  // Navbar scroll state
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Burger menu
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // Scroll reveal (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  const observeAll = () => document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  observeAll();

  // Hero 3D parallax tilt (mouse)
  const hero3d = document.getElementById('hero3d');
  const hero = document.getElementById('hero');
  if (hero3d && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      hero3d.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    hero.addEventListener('mouseleave', () => { hero3d.style.transform = 'rotateY(0) rotateX(0)'; });
  }

  // Cards 3D tilt + glow follow
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg) translateY(-6px)`;
    card.style.setProperty('--mx', px * 100 + '%');
    card.style.setProperty('--my', py * 100 + '%');
  });
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card');
    if (card) card.style.transform = '';
  });

  // Parallax 3D background on scroll
  const layer1 = document.querySelector('.layer-1');
  const layer2 = document.querySelector('.layer-2');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (layer1) layer1.style.transform = `translateY(${y * 0.15}px)`;
    if (layer2) layer2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });
})();
