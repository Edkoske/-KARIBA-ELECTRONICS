import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const products = () => window.KARIBA_PRODUCTS || [];
const categories = () => window.KARIBA_CATEGORIES || [];
const company = () => window.KARIBA_COMPANY || { email: 'info@karibaelectronics.co.ke', whatsappNumber: '254729725614' };

function stars(rating) {
  const count = Math.round(rating);
  return `${'★'.repeat(count)}${'☆'.repeat(5 - count)}`;
}

function whatsappUrl(name, extra = '') {
  const message = `Hello Kariba Electronics, I am interested in ${name}. ${extra}Please share availability, pricing and delivery details.`;
  const number = String(company().whatsappNumber).replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function emailUrl(subject, body) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: company().email, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  function submitSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    navigate(`/shop${params.size ? `?${params}` : ''}`);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Kariba Electronics home page">
          <span className="brand-mark">K</span>
          <span>KARIBA ELECTRONICS</span>
        </Link>
        <div className="nav-wrap">
          <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
            <Link onClick={() => setMenuOpen(false)} className={location.pathname === '/' ? 'active' : ''} to="/">Home</Link>
            <Link onClick={() => setMenuOpen(false)} className={location.pathname.startsWith('/shop') ? 'active' : ''} to="/shop">Shop</Link>
            <a onClick={() => setMenuOpen(false)} href="/#categories">Categories</a>
            <Link onClick={() => setMenuOpen(false)} className={location.pathname === '/about' ? 'active' : ''} to="/about">About Us</Link>
            <a onClick={() => setMenuOpen(false)} href="/#services">Services</a>
            <Link onClick={() => setMenuOpen(false)} className={location.pathname === '/contact' ? 'active' : ''} to="/contact">Contact</Link>
          </nav>
          <div className="utility-bar">
            <form className="search-field" onSubmit={submitSearch} aria-label="Site search">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search products" aria-label="Search products" />
            </form>
            <button className="icon-button nav-toggle" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="footer-brand">Kariba Electronics</div><p>Modern electronics and appliances for homes, offices and growing businesses across Kenya.</p></div>
        <div><div className="footer-brand">Quick Links</div><ul className="footer-links"><li><Link to="/">Home</Link></li><li><Link to="/shop">Shop</Link></li><li><Link to="/about">About Us</Link></li><li><Link to="/contact">Contact</Link></li></ul></div>
        <div><div className="footer-brand">Popular Categories</div><ul className="footer-links">{categories().slice(0, 4).map((category) => <li key={category.name}><Link to={`/shop?category=${encodeURIComponent(category.name)}`}>{category.name}</Link></li>)}</ul></div>
        <div><div className="footer-brand">Contact</div><ul className="footer-links"><li>0729725614</li><li>{company().email}</li><li>Kenya</li><li><a href="https://wa.me/254729725614" target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul></div>
      </div>
      <div className="container footer-legal"><a href="privacy.html">Privacy</a><a href="shipping-returns.html">Shipping &amp; Returns</a><a href="terms.html">Terms &amp; Conditions</a><a href="faq.html">FAQs</a><span>© 2026 Kariba Electronics</span></div>
    </footer>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card" aria-label={product.name}>
      <div className="product-image-wrap"><img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" /></div>
      <div className="product-body">
        <div className="product-meta"><span>{product.category}</span><span className="stars" aria-label={`${product.rating} out of 5 stars`}>{stars(product.rating)}</span></div>
        <h3>{product.name}</h3><p>{product.description}</p>
        <div className="product-actions">
          <a className="btn primary-btn" href={whatsappUrl(product.name, 'I would like to enquire about this product.')} target="_blank" rel="noopener noreferrer">WhatsApp Enquiry</a>
          <a className="btn secondary-btn" href={emailUrl(`Product enquiry: ${product.name}`, `Hello Kariba Electronics,\n\nI am interested in ${product.name}. Please share pricing, availability, and delivery details.\n\nThank you.`)} target="_blank" rel="noopener noreferrer">Gmail Enquiry</a>
        </div>
        <Link to={`/product/${product.id}`} className="product-detail-link">View product details</Link>
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

const services = [
  ['📺', 'Electronics Sales', 'Curated products for homes, offices and growing businesses.'],
  ['🔌', 'Electronics Accessories', 'Useful add-ons, charging products and everyday essentials.'],
  ['🏠', 'Home Appliance Solutions', 'Reliable appliance recommendations and practical home upgrades.'],
  ['🛠️', 'Installation Support', 'Setup guidance so customers can get the most from their products.'],
  ['🚚', 'Product Delivery', 'Delivery support across Kenya with availability confirmed directly.'],
  ['⚙️', 'Technical Support', 'Product guidance and basic troubleshooting before and after purchase.']
];

function HomePage() {
  const featured = products().filter((product) => product.featured).slice(0, 8);
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title"><div className="container hero-inner"><div className="hero-copy"><span className="eyebrow">Kenya-based electronics store</span><h1 id="hero-title">QUALITY ELECTRONICS. SMARTER LIVING.</h1><p>Shop quality electronics and accessories at Kariba Electronics, your trusted electronics store in Kenya.</p><div className="hero-actions"><Link to="/shop" className="btn primary-btn">SHOP NOW</Link><a href="#categories" className="btn secondary-btn">VIEW CATEGORIES</a></div></div><div className="hero-panel" aria-label="Quick store facts"><div className="mini-stat"><div><strong>4.9/5</strong><span>Customer trust</span></div><div><strong>1.5k+</strong><span>Products</span></div></div><div className="mini-stat"><div><strong>Same day</strong><span>Dispatch</span></div><div><strong>Nationwide</strong><span>Delivery</span></div></div><div className="mini-stat"><div><strong>Kenya</strong><span>Local service</span></div><div><strong>24/7</strong><span>Support</span></div></div></div></div></section>
      <div className="trust-strip"><div className="container trust-items"><div className="trust-item"><span className="icon">✓</span><span>Quality Products</span></div><div className="trust-item"><span className="icon">✉</span><span>Ask for a Quote</span></div><div className="trust-item"><span className="icon">🚚</span><span>Fast Delivery</span></div><div className="trust-item"><span className="icon">☎</span><span>Customer Support</span></div></div></div>
      <section id="categories"><div className="container"><SectionHeading eyebrow="Shop By Category" title="Explore electronics for every need">From entertainment and computing to home appliances, discover essential technology and everyday convenience.</SectionHeading><div className="category-grid">{categories().map((category) => <article className="category-card" key={category.name}><img src={category.image} alt={`${category.name} products`} loading="lazy" referrerPolicy="no-referrer" /><div className="content"><h3>{category.name}</h3><p>{category.description}</p><details className="category-items"><summary>Browse {category.items.length} product types</summary><ul>{category.items.map((item) => <li key={item}>{item}</li>)}</ul></details><Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="btn secondary-btn">View Category</Link></div></article>)}</div></div></section>
      <section><div className="container"><SectionHeading eyebrow="Featured products" title="Popular picks for modern homes">Discover quality electronics and appliances selected for value and everyday usefulness.</SectionHeading><div className="products-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div><div className="center-action"><Link className="btn secondary-btn" to="/shop">Browse all products</Link></div></div></section>
      <section id="services"><div className="container"><SectionHeading eyebrow="Our Services" title="Complete electronics support for customers in Kenya" /><div className="services-grid">{services.map(([icon, title, description]) => <article className="service-card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
      <section><div className="container"><div className="about-banner"><div className="grid-2"><div><span className="eyebrow">About Kariba Electronics</span><h2>Quality electronics for everyday life in Kenya</h2></div><div><p>Kariba Electronics is a Kenya-based electronics retail business committed to providing quality electronics, appliances and accessories at competitive prices through convenient shopping and reliable customer service.</p><Link to="/about" className="btn ghost-btn">Learn More</Link></div></div></div></div></section>
      <section><div className="container"><SectionHeading eyebrow="Delivery coverage" title="DELIVERY ACROSS KENYA">Contact us to confirm delivery availability, charges and estimated delivery times for your location.</SectionHeading><div className="delivery-hero"><div className="grid-2"><div><h3>Coverage and delivery timelines</h3><p>Delivery coverage varies by location and stock availability. Contact Kariba Electronics to confirm service areas, estimated time, and applicable charges.</p></div><div className="location-pills" aria-label="Locations served">{['Nairobi', 'Nakuru', 'Eldoret', 'Kisumu', 'Kericho', 'Bomet', 'Mombasa', 'Other parts of Kenya'].map((place) => <span key={place}>{place}</span>)}</div></div></div></div></section>
    </main>
  );
}

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [sort, setSort] = useState('featured');
  const normalizedTerm = term.trim().toLowerCase();
  let visible = products().filter((product) => {
    const matchesTerm = !normalizedTerm || [product.name, product.category, product.description].join(' ').toLowerCase().includes(normalizedTerm);
    return matchesTerm && (category === 'All Categories' || product.category === category);
  });
  visible = [...visible].sort((first, second) => {
    if (sort === 'newest') return new Date(second.dateAdded) - new Date(first.dateAdded);
    if (sort === 'popular') return (second.popular || 0) - (first.popular || 0);
    return Number(second.featured) - Number(first.featured);
  });

  function chooseCategory(value) {
    setCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value === 'All Categories') params.delete('category');
    else params.set('category', value);
    setSearchParams(params, { replace: true });
  }

  return <main><section className="page-banner"><div className="container page-banner-inner"><div><span className="eyebrow">Shop all</span><h1>Electronics &amp; appliances</h1></div><p>Browse the latest products for home, work and everyday convenience in Kenya.</p></div></section><section><div className="container"><SectionHeading eyebrow="Browse by category" title="All product categories" /><nav className="location-pills" aria-label="All product categories"><Link to="/shop">All Products</Link>{categories().map((item) => <button type="button" key={item.name} onClick={() => chooseCategory(item.name)}>{item.name}</button>)}</nav><div className="filter-bar"><div className="filter-group"><label htmlFor="shopSearch">Search</label><input id="shopSearch" type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search products, categories, descriptions" /></div><div className="filter-group"><label htmlFor="categoryFilter">Category</label><select id="categoryFilter" value={category} onChange={(event) => chooseCategory(event.target.value)}><option>All Categories</option>{categories().map((item) => <option key={item.name}>{item.name}</option>)}</select></div><div className="filter-group"><label htmlFor="sortSelect">Sort By</label><select id="sortSelect" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="popular">Popularity</option></select></div></div><p className="results-count" aria-live="polite">{visible.length} products</p><div className="products-grid">{visible.length ? visible.map((product) => <ProductCard key={product.id} product={product} />) : <div className="empty-state">No products match your search filters. Please try another keyword or category.</div>}</div></div></section></main>;
}

function ProductPage() {
  const { pathname } = useLocation();
  const id = Number(pathname.split('/').filter(Boolean).pop());
  const product = products().find((item) => Number(item.id) === id);
  if (!product) return <main><section className="container"><div className="empty-state">This product is not available. <Link to="/shop">Browse other items in the shop.</Link></div></section></main>;
  const related = products().filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  return <main><section className="page-banner"><div className="container page-banner-inner"><div><span className="eyebrow">Product details</span><h1>{product.name}</h1></div></div></section><section><div className="container"><div className="product-detail-wrap"><div className="product-gallery"><img src={product.image} alt={product.name} referrerPolicy="no-referrer" /></div><div className="product-info"><div className="product-badge">{product.availability}</div><h1>{product.name}</h1><div className="rating-row"><span className="stars">{stars(product.rating)}</span><span>{product.rating} / 5</span></div><p className="product-description">{product.description}</p><ul className="spec-list">{Object.entries(product.specs).map(([key, value]) => <li key={key}><span>{key}</span><span>{value}</span></li>)}</ul><div className="product-actions-group"><a className="btn primary-btn" href={whatsappUrl(product.name)} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a><a className="btn secondary-btn" href={emailUrl(`Product enquiry: ${product.name}`, `Hello Kariba Electronics,\n\nI am interested in ${product.name}. Please share pricing, availability, and delivery details.\n\nThank you.`)} target="_blank" rel="noopener noreferrer">Email Product Enquiry</a></div></div></div><div className="related-products"><SectionHeading eyebrow="Related products" title="More from this category" /><div className="products-grid">{related.length ? related.map((item) => <ProductCard key={item.id} product={item} />) : <div className="empty-state">More products in this category will appear here soon.</div>}</div></div></div></section></main>;
}

function AboutPage() {
  return <main><section className="page-banner"><div className="container page-banner-inner"><div><span className="eyebrow">About us</span><h1>Kariba Electronics</h1></div><p>Supporting smarter homes and better technology choices across Kenya.</p></div></section><section><div className="container"><div className="about-banner"><div className="grid-2"><div><span className="eyebrow">Our mission</span><h2>Making reliable technology more accessible</h2></div><div><p>Kariba Electronics is a Kenya-based electronics retail business committed to providing quality electronics, appliances and accessories at competitive prices. We aim to make technology more accessible through convenient shopping and reliable customer service.</p></div></div></div></div></section><section><div className="container"><SectionHeading eyebrow="What we stand for" title="Simple, honest retail support" /><div className="why-grid">{[['🌍', 'Kenya-focused', 'Practical technology for Kenyan households and businesses.'], ['📦', 'Affordable quality', 'Value-driven products for homes and businesses.'], ['💬', 'Responsive support', 'Product guidance and straightforward communication.']].map(([icon, title, copy]) => <article className="why-card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section></main>;
}

function ContactPage() {
  const [notice, setNotice] = useState('');
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (Object.values(values).some((value) => !String(value).trim())) {
      setNotice('Please fill in all fields before submitting.');
      return;
    }
    const body = `Full Name: ${values.fullName}\nPhone Number: ${values.phoneNumber}\nEmail: ${values.emailAddress}\n\nSubject: ${values.subject}\n\nMessage:\n${values.message}`;
    window.location.href = emailUrl(values.subject, body);
    setNotice('Your email app is opening with your message.');
    event.currentTarget.reset();
  }
  return <main><section className="page-banner"><div className="container page-banner-inner"><div><span className="eyebrow">Get in touch</span><h1>Contact Kariba Electronics</h1></div><p>Reach out for product enquiries, delivery questions and customer support.</p></div></section><section><div className="container contact-grid"><div className="contact-card"><span className="eyebrow">Contact details</span><h2>We’re ready to help</h2><ul className="contact-list"><li><span className="label">Phone:</span><span>0729725614</span></li><li><span className="label">WhatsApp:</span><span>0729725614</span></li><li><span className="label">Email:</span><span>{company().email}</span></li><li><span className="label">Location:</span><span>Kenya</span></li><li><span className="label">Opening Hours:</span><span>Monday – Saturday: 8:00 AM – 6:00 PM<br />Sunday: 10:00 AM – 4:00 PM</span></li></ul></div><div className="contact-card"><h3>Send us a message</h3><form className="contact-form ready" onSubmit={submit}><div className="form-field"><label htmlFor="fullName">Full Name</label><input id="fullName" name="fullName" required placeholder="Your full name" /></div><div className="form-field"><label htmlFor="phoneNumber">Phone Number</label><input id="phoneNumber" name="phoneNumber" type="tel" required placeholder="0729725614" /></div><div className="form-field"><label htmlFor="emailAddress">Email</label><input id="emailAddress" name="emailAddress" type="email" required placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="subject">Subject</label><input id="subject" name="subject" required placeholder="Inquiry topic" /></div><div className="form-field"><label htmlFor="message">Message</label><textarea id="message" name="message" required placeholder="Tell us what you need" /></div><button className="btn primary-btn" type="submit">Submit</button><div className={`form-success${notice ? ' visible' : ''}`} role="status">{notice}</div></form></div></div></section></main>;
}

function NotFound() {
  return <main><section className="container"><div className="empty-state"><h1>Page not found</h1><Link to="/">Return to the home page</Link></div></section></main>;
}

function AppContent() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const page = location.pathname === '/' ? 'Home' : location.pathname.slice(1).replaceAll('-', ' ');
    document.title = `${page.charAt(0).toUpperCase()}${page.slice(1)} | Kariba Electronics Kenya`;
  }, [location.pathname]);

  return <><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/shop" element={<ShopPage />} /><Route path="/product/:id" element={<ProductPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes><Footer /><a className="icon-button floating-whatsapp" href="https://wa.me/254729725614" target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp">💬</a><div className="toast" role="status" aria-live="polite" /></>;
}

export function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
