import React, { useEffect, useState } from "react";
import { DEMO_USD_TO_INR, getDashboardData } from "./database.js";

const navigation = [
  { label: "Overview", icon: "grid" },
  { label: "Orders", icon: "receipt" },
  { label: "Customers", icon: "users" },
  { label: "Sellers", icon: "store" },
  { label: "Riders", icon: "truck" },
  { label: "Admin Profile", icon: "user" },
];

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></>,
    receipt: <><path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    store: <><path d="M3 10h18M5 10v10h14V10M3 10l2-6h14l2 6" /><path d="M9 20v-6h6v6" /></>,
    truck: <><path d="M3 6h12v12H3zM15 10h4l3 3v5h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="18.5" cy="19" r="1.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 20c2-5 6-8 11-10" /></>,
    meat: <><path d="M7.1 7.2c2.2-2.1 4.6-2.3 6.4-1.2 1.6-.9 3.7-.3 4.2 1.4 1.7.7 2.4 2.3 1.5 4-.1 3.4-2.1 6.8-5.3 7.1-1.5.1-2.5-.6-3.3-1.4-2.2.8-4.7-.6-4.7-2.8-1.3-1.8-.4-4.6 1.2-7.1Z" /><path d="M10 9.2c.8-1 2.5-.8 2.8.2.5 1.2-.9 2.1-1.9 1.5-.7-.4-1-1.2-.9-1.7ZM14.4 14.1c.7-.6 1.8-.2 1.7.7-.1.8-1.1 1.2-1.7.6" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] ?? paths.grid}
    </svg>
  );
}

const money = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
}).format(amount);

function App() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [activePage, setActivePage] = useState("Overview");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  async function refreshData() {
    setError("");
    try {
      const data = await getDashboardData();
      setOrders(data.orders);
      setCustomers(data.customers);
      setSellers(data.sellers);
      setRiders(data.riders);
    } catch (loadError) {
      setError(loadError.message || "Could not load your local shop data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshData(); }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActivePage("Overview"); }}>
          <span className="brand-mark"><Icon name="meat" size={23} /></span>
          <span className="brand-copy"><strong>premium fresh meat</strong><small>MEAT & PROVISIONS</small></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button key={item.label} className={`nav-item ${activePage === item.label ? "active" : ""}`} onClick={() => setActivePage(item.label)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "Orders" && <span className="nav-badge">{orders.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon"><Icon name="leaf" size={17} /></span>
            <strong>Good food, thoughtfully sourced.</strong>
            <span>Your daily operations, all in one place.</span>
          </div>
          <button className={`nav-item settings-link ${activePage === "Settings" ? "active" : ""}`} onClick={() => setActivePage("Settings")}><Icon name="settings" /><span>Settings</span></button>
          <button className="profile profile-button" aria-label="Open admin profile" onClick={() => setActivePage("Admin Profile")}>
            <div className="avatar">JD</div>
            <div className="profile-copy"><strong>Jordan Davis</strong><span>Store administrator</span></div>
            <span className="profile-more" aria-hidden="true">•••</span>
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Premium Fresh Meat</span><Icon name="chevron" size={14} /><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <div className="store-status"><span className="status-dot" /> Store open</div>
            <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={19} /><i /></button>
            <div className="topbar-date">{formattedDate}</div>
          </div>
        </header>

        <div className="content">
          {error && <div className="alert" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
          {loading ? <div className="loading-state">Preparing your shop dashboard…</div> : (
            <>
              {activePage === "Overview" && <Overview orders={orders} customers={customers} sellers={sellers} date={formattedDate} onNavigate={setActivePage} />}
              {activePage === "Orders" && <Orders orders={orders} />}
              {activePage === "Customers" && <Customers customers={customers} />}
              {activePage === "Sellers" && <Sellers sellers={sellers} />}
              {activePage === "Riders" && <Riders riders={riders} />}
              {activePage === "Admin Profile" && <AdminProfile />}
              {activePage === "Settings" && <EmptyPage title="Store settings" description="Your shop preferences and account settings are coming soon." icon="settings" />}
            </>
          )}
        </div>
      </main>

    </div>
  );
}

function Overview({ orders, customers, sellers, date, onNavigate }) {
  const dateLabel = date.replace(/, \d{4}$/, "").toUpperCase();
  return (
    <>
      <section className="welcome-row">
        <div><span className="eyebrow">{dateLabel}</span><h1>Good morning, Jordan <span className="wave">✳</span></h1><p>Here’s what’s happening at your shop today.</p></div>
      </section>

      <section className="stats-grid" aria-label="Store summary">
        <StatCard label="Today’s sales" value={money(2840.5 * DEMO_USD_TO_INR)} change="+12.8%" caption="vs. yesterday" icon="receipt" tone="cream" />
        <StatCard label="Total orders" value={orders.length} change="Order records" caption="in local database" icon="box" tone="rose" />
        <StatCard label="Customers" value={customers.length} change="Registered" caption="customer records" icon="users" tone="sage" />
        <StatCard label="Sellers" value={sellers.length} change="Active" caption="seller records" icon="store" tone="sand" />
      </section>

      <section className="overview-grid">
        <div className="panel sales-panel">
          <div className="panel-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>Sales overview</h2></div><button className="select-button">This week <span>⌄</span></button></div>
          <div className="sales-total"><strong>{money(14280 * DEMO_USD_TO_INR)}</strong><span className="positive-change"><Icon name="arrow" size={14} /> 8.4%</span><small> compared to last week</small></div>
          <div className="chart" role="img" aria-label="Sales chart, rising throughout the week">
            <div className="chart-y-labels"><span>₹4L</span><span>₹3L</span><span>₹2L</span><span>₹1L</span><span>₹0</span></div>
            <div className="chart-area">
              <div className="chart-grid"><i /><i /><i /><i /><i /></div>
              <svg viewBox="0 0 700 180" preserveAspectRatio="none" className="sales-line">
                <defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8e4751" stopOpacity=".19" /><stop offset="100%" stopColor="#8e4751" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 137 C38 129 49 103 91 112 S145 124 185 92 S239 106 278 82 S329 94 369 60 S423 80 462 48 S515 64 555 34 S607 55 646 24 S678 32 700 15 L700 180 L0 180Z" fill="url(#salesFill)" />
                <path d="M0 137 C38 129 49 103 91 112 S145 124 185 92 S239 106 278 82 S329 94 369 60 S423 80 462 48 S515 64 555 34 S607 55 646 24 S678 32 700 15" fill="none" stroke="#7b303d" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="chart-x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </div>
          </div>
        </div>

        <div className="panel orders-panel">
          <div className="panel-heading"><div><span className="eyebrow">FRESH OFF THE BLOCK</span><h2>Recent orders</h2></div><button className="text-link" onClick={() => onNavigate("Orders")}>View all <Icon name="chevron" size={15} /></button></div>
          <div className="compact-orders">
            {orders.slice(0, 4).map((order) => <div className="compact-order" key={order.id}>
              <div className="order-initial">{order.customer.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
              <div className="order-person"><strong>{order.customer}</strong><span>{order.id} · {order.items} items</span></div>
              <div className="order-amount"><strong>{money(order.total)}</strong><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></div>
            </div>)}
          </div>
          <div className="orders-foot"><span><span className="status-dot" /> Orders are up to date</span><span><Icon name="clock" size={14} /> Updated just now</span></div>
        </div>
      </section>

      <footer className="footer-note"><Icon name="leaf" size={15} /> Thoughtfully sourced. Expertly cut. Always fresh.</footer>
    </>
  );
}

function StatCard({ label, value, change, caption, icon, tone, alert }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon name={icon} size={17} /></span></div><strong className="stat-value">{value}</strong><div className={`stat-caption ${alert ? "alert-caption" : ""}`}><b>{change}</b><span>{caption}</span></div></article>;
}

function Orders({ orders }) {
  return <section className="page-section"><div className="page-title-row"><div><span className="eyebrow">THE DAILY CUT</span><h1>Orders</h1><p>Every order, prepared with care.</p></div><div className="orders-count"><span className="status-dot" /> {orders.length} recent orders</div></div>  <div className="panel data-panel"><div className="data-toolbar"><div><h2>Recent orders <span className="count-pill">{orders.length}</span></h2><p>Review your latest customer orders.</p></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th><th>TIME</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.items} items</td><td><strong>{money(order.total)}</strong></td><td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td><td>{order.time}</td></tr>)}</tbody></table></div></div></section>;
}

function Customers({ customers }) {
  return <section className="page-section">
    <div className="page-title-row"><div><span className="eyebrow">CUSTOMER DIRECTORY</span><h1>Customers</h1><p>Contact details and order history.</p></div><div className="orders-count">{customers.length} customers</div></div>
    <div className="panel data-panel">
      <div className="data-toolbar"><div><h2>Customer records <span className="count-pill">{customers.length}</span></h2><p>Password credentials are never stored or shown here; use a secure reset flow.</p></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>CUSTOMER</th><th>EMAIL</th><th>PHONE NUMBER</th><th>NUMBER OF ORDERS</th><th>PASSWORD</th></tr></thead><tbody>
        {customers.map((customer) => <tr key={customer.id}><td><strong>{customer.name}</strong></td><td>{customer.email}</td><td>{customer.phone}</td><td>{customer.orders}</td><td><span className="protected-label">Protected</span></td></tr>)}
      </tbody></table></div>
    </div>
  </section>;
}

function Sellers({ sellers }) {
  return <section className="page-section">
    <div className="page-title-row"><div><span className="eyebrow">PARTNER DIRECTORY</span><h1>Sellers</h1><p>Shop details, available cuts, and revenue.</p></div><div className="orders-count">{sellers.length} sellers</div></div>
    <div className="panel data-panel">
      <div className="data-toolbar"><div><h2>Seller records <span className="count-pill">{sellers.length}</span></h2><p>All revenue amounts are displayed in Indian rupees.</p></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>SELLER / SHOP</th><th>SHOP ADDRESS</th><th>EMAIL</th><th>PHONE NUMBER</th><th>TYPE OF MEAT AVAILABLE</th><th>REVENUE</th></tr></thead><tbody>
        {sellers.map((seller) => <tr key={seller.id}><td><strong>{seller.name}</strong></td><td>{seller.address}</td><td>{seller.email}</td><td>{seller.phone}</td><td><div className="meat-tags">{seller.meatTypes.map((type) => <span className="category-label" key={type}>{type}</span>)}</div></td><td><strong>{money(seller.revenue)}</strong></td></tr>)}
      </tbody></table></div>
    </div>
  </section>;
}

function Riders({ riders }) {
  return <section className="page-section">
    <div className="page-title-row"><div><span className="eyebrow">DELIVERY TEAM</span><h1>Riders</h1><p>Rider contact details, licence IDs, and delivery activity.</p></div><div className="orders-count">{riders.length} riders</div></div>
    <div className="panel data-panel">
      <div className="data-toolbar"><div><h2>Rider records <span className="count-pill">{riders.length}</span></h2><p>All revenue amounts are displayed in Indian rupees.</p></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>RIDER</th><th>LICENCE NUMBER</th><th>EMAIL</th><th>PHONE NUMBER</th><th>NUMBER OF RIDES</th><th>REVENUE</th></tr></thead><tbody>
        {riders.map((rider) => <tr key={rider.id}><td><strong>{rider.name}</strong></td><td>{rider.licenceNumber}</td><td>{rider.email}</td><td>{rider.phone}</td><td>{rider.rides}</td><td><strong>{money(rider.revenue)}</strong></td></tr>)}
      </tbody></table></div>
    </div>
  </section>;
}

function AdminProfile() {
  return <section className="page-section">
    <div className="page-title-row"><div><span className="eyebrow">ACCOUNT</span><h1>Admin Profile</h1><p>Your administrator account and store access.</p></div></div>
    <div className="profile-page-grid">
      <section className="panel profile-summary">
        <div className="profile-avatar-large">JD</div>
        <h2>Jordan Davis</h2>
        <p>Store administrator</p>
        <span className="profile-active"><i /> Active account</span>
      </section>
      <section className="panel profile-details">
        <div><span className="eyebrow">PERSONAL DETAILS</span><h2>Account information</h2></div>
        <dl>
          <div><dt>Full name</dt><dd>Jordan Davis</dd></div>
          <div><dt>Email address</dt><dd>jordan.davis@premiumfreshmeat.example</dd></div>
          <div><dt>Phone number</dt><dd>+91 90000 00010</dd></div>
          <div><dt>Role</dt><dd>Store administrator</dd></div>
          <div><dt>Store</dt><dd>Premium Fresh Meat</dd></div>
          <div><dt>Access level</dt><dd>Full store access</dd></div>
        </dl>
      </section>
    </div>
  </section>;
}

function EmptyPage({ title, description, icon }) {
  return <section className="page-section"><div className="page-title-row"><div><span className="eyebrow">PREMIUM FRESH MEAT</span><h1>{title}</h1></div></div><div className="panel empty-page"><span className="empty-icon"><Icon name={icon} size={24} /></span><h2>A little more time on the block</h2><p>{description}</p></div></section>;
}

export default App;
