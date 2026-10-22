
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, ArrowLeftRight, ShieldCheck, Search,
  Bell, Menu, TrendingUp, AlertTriangle, Users, Wallet,
  CheckCircle, Clock, XCircle, ChevronDown, Globe,
  Activity, Eye, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";
import "./App.css";
import Badge from "./components/Badge";
import TransactionTable from "./components/TransactionTable";
import Dashboard from "./pages/Dashboard";

const API_URL = "http://127.0.0.1:5000/api";

const initialTransactions = [
  { id: "TXN-1001", sender: "Arun Kumar", receiver: "John Smith", amount: 2500, currency: "USD", country: "USA", risk: "Low", status: "Completed" },
  { id: "TXN-1002", sender: "Riya Nair", receiver: "Emma Wilson", amount: 7800, currency: "EUR", country: "Germany", risk: "High", status: "Flagged" },
  { id: "TXN-1003", sender: "Rahul Das", receiver: "Olivia Brown", amount: 1200, currency: "GBP", country: "UK", risk: "Low", status: "Processing" },
  { id: "TXN-1004", sender: "Meera Joseph", receiver: "Noah Miller", amount: 9500, currency: "USD", country: "USA", risk: "Medium", status: "Pending" },
  { id: "TXN-1005", sender: "Ananya Roy", receiver: "Lucas Martin", amount: 6200, currency: "AED", country: "UAE", risk: "High", status: "Under Review" },
  { id: "TXN-1006", sender: "Kiran Shah", receiver: "Sophia Taylor", amount: 3400, currency: "EUR", country: "France", risk: "Low", status: "Completed" },
];

const initialKyc = [
  { id: 1, name: "Arun Kumar", country: "India", document: "Passport", status: "Verified" },
  { id: 2, name: "Riya Nair", country: "India", document: "National ID", status: "Pending" },
  { id: 3, name: "Rahul Das", country: "India", document: "Passport", status: "Pending" },
  { id: 4, name: "Meera Joseph", country: "India", document: "National ID", status: "Verified" },
  { id: 5, name: "Ananya Roy", country: "India", document: "Passport", status: "Rejected" },
];

const chartData = [
  { day: "Mon", payments: 12 },
  { day: "Tue", payments: 19 },
  { day: "Wed", payments: 15 },
  { day: "Thu", payments: 28 },
  { day: "Fri", payments: 22 },
  { day: "Sat", payments: 34 },
  { day: "Sun", payments: 29 },
];


function App() {
  const [page, setPage] = useState("Dashboard");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [kyc, setKyc] = useState(initialKyc);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [savingKycId, setSavingKycId] = useState(null);

  // Load transactions and KYC profiles from the Flask API.
  async function loadData() {
    setLoading(true);

    try {
      const [transactionsResponse, kycResponse] = await Promise.all([
        fetch(`${API_URL}/transactions`),
        fetch(`${API_URL}/kyc`),
      ]);

      if (!transactionsResponse.ok || !kycResponse.ok) {
        throw new Error("The backend could not load the records.");
      }

      const [transactionData, kycData] = await Promise.all([
        transactionsResponse.json(),
        kycResponse.json(),
      ]);

      setTransactions(transactionData);
      setKyc(kycData);
      setNotice("");
    } catch (error) {
      console.error("Data loading error:", error);
      setNotice(
        "Could not load database records. Make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const highRisk = transactions.filter(
    t => t.risk === "High" || t.status === "Flagged"
  ).length;

  const pendingKyc = kyc.filter(
    p => p.status === "Pending"
  ).length;

  const volume = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(t => {
        const term = search.toLowerCase();

        const matchesSearch = [
          t.id,
          t.sender,
          t.receiver,
          t.country,
        ].some(value =>
          String(value).toLowerCase().includes(term)
        );

        const matchesFilter =
          filter === "All" || t.status === filter;

        return matchesSearch && matchesFilter;
      }),
    [transactions, search, filter]
  );

  // Update a transaction in MongoDB through Flask.
  async function updateTransaction(id, status) {
    setSavingTransaction(true);

    try {
      const response = await fetch(
        `${API_URL}/transactions/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction update failed.");
      }

      setTransactions(current =>
        current.map(t => t.id === id ? result : t)
      );

      setSelected(null);
      setNotice(`${id} status saved to MongoDB.`);
    } catch (error) {
      console.error("Transaction update error:", error);
      setNotice(error.message || "Could not update transaction.");
    } finally {
      setSavingTransaction(false);
    }
  }

  // Update a KYC profile in MongoDB through Flask.
  async function updateKyc(id, status) {
    setSavingKycId(id);

    try {
      const response = await fetch(
        `${API_URL}/kyc/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "KYC update failed.");
      }

      setKyc(current =>
        current.map(p => p.id === id ? result : p)
      );

      setNotice("KYC status saved to MongoDB.");
    } catch (error) {
      console.error("KYC update error:", error);
      setNotice(error.message || "Could not update KYC profile.");
    } finally {
      setSavingKycId(null);
    }
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setSelected(null);
    setMobileMenu(false);
    setSearch("");
    setFilter("All");
  }

  const pageTitles = {
    Dashboard: "Dashboard Overview",
    Transactions: "Transaction Monitoring",
    KYC: "KYC Management",
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <ArrowLeftRight size={22} />
          </div>
          <div>
            CrossBorder<span>PAYMENT SYSTEM</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button
          className={`nav-item ${page === "Dashboard" ? "active" : ""}`}
          onClick={() => navigate("Dashboard")}
        >
          <LayoutDashboard size={19} /> Dashboard
        </button>

        <button
          className={`nav-item ${page === "Transactions" ? "active" : ""}`}
          onClick={() => navigate("Transactions")}
        >
          <ArrowLeftRight size={19} /> Transactions
        </button>

        <button
          className={`nav-item ${page === "KYC" ? "active" : ""}`}
          onClick={() => navigate("KYC")}
        >
          <ShieldCheck size={19} /> KYC Profiles
          {pendingKyc > 0 && (
            <span className="nav-count">{pendingKyc}</span>
          )}
        </button>

        <div className="sidebar-bottom">
          <div className="secure-card">
            <ShieldCheck size={20} />
            <strong>Secure workspace</strong>
            <p>Academic demonstration environment</p>
            <span><i /> Demo mode active</span>
          </div>

          <div className="user-profile">
            <div className="avatar">AD</div>
            <div>
              <strong>Admin User</strong>
              <small>System Administrator</small>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {selected
                ? "Transaction Details"
                : pageTitles[page]}
            </strong>
          </div>

          <div className="top-actions">
            <span className="system-status">
              <i /> System online
            </span>
            <button className="icon-button" title="Notifications">
              <Bell size={19} /><i />
            </button>
            <div className="avatar top-avatar">AD</div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice">
              <CheckCircle size={17} />
              {notice}
            </div>
          )}

          {loading && (
            <div className="notice">
              Loading records from MongoDB...
            </div>
          )}

          {selected ? (
            <section>
              <button
                className="back-button"
                onClick={() => setSelected(null)}
              >
                ← Back to transactions
              </button>

              <div className="page-heading">
                <div>
                  <p className="eyebrow">TRANSACTION DETAILS</p>
                  <h1>{selected.id}</h1>
                  <p>
                    Review payment information and update its status.
                  </p>
                </div>
                <Badge>{selected.status}</Badge>
              </div>

              <div className="detail-grid">
                <div className="panel detail-panel">
                  <h3>Payment information</h3>

                  {[
                    ["Transaction ID", selected.id],
                    ["Sender", selected.sender],
                    ["Receiver", selected.receiver],
                    [
                      "Amount",
                      `${selected.amount.toLocaleString()} ${selected.currency}`,
                    ],
                    ["Destination", selected.country],
                    ["Risk level", selected.risk],
                  ].map(([label, value]) => (
                    <div className="detail-row" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="panel">
                  <h3>Administrative action</h3>
                  <p className="muted">
                    Choose a status for this demonstration transaction.
                  </p>

                  <label className="field-label">
                    Transaction status
                  </label>

                  <select
                    className="full-select"
                    value={selected.status}
                    disabled={savingTransaction}
                    onChange={e =>
                      updateTransaction(selected.id, e.target.value)
                    }
                  >
                    {[
                      "Pending",
                      "Processing",
                      "Completed",
                      "Flagged",
                      "Under Review",
                      "Failed",
                    ].map(status => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <div className="info-box">
                    <AlertTriangle size={18} />
                    <p>
                      Status changes are sent to the backend and saved
                      in MongoDB. Risk labels remain illustrative demo
                      data.
                    </p>
                  </div>
                </div>
              </div>
            </section>
         
    ) : page === "Dashboard" ? (
  <Dashboard
    transactions={transactions}
    pendingKyc={pendingKyc}
    highRisk={highRisk}
    volume={volume}
    loading={loading}
    loadData={loadData}
    navigate={navigate}
    setSelected={setSelected}
  />
) : page === "Transactions" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">PAYMENT OPERATIONS</p>
                  <h1>Transaction Monitoring</h1>
                  <p>
                    Search payments, review risk labels and manage statuses.
                  </p>
                </div>
                <span className="record-count">
                  {filteredTransactions.length} records
                </span>
              </div>

              <section className="panel table-panel">
                <div className="toolbar">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      placeholder="Search ID, sender, receiver or country..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="filter-select"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  >
                    <option>All</option>
                    {[
                      "Pending",
                      "Processing",
                      "Completed",
                      "Flagged",
                      "Under Review",
                      "Failed",
                    ].map(status => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <TransactionTable
                  rows={filteredTransactions}
                  onSelect={setSelected}
                />
              </section>

              <p className="disclaimer">
                Transaction status updates are saved through the backend.
              </p>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">COMPLIANCE WORKSPACE</p>
                  <h1>KYC Management</h1>
                  <p>
                    Review sample customer profiles and update verification
                    status.
                  </p>
                </div>
                <div className="record-count">
                  <ShieldCheck size={16} /> {kyc.length} profiles
                </div>
              </div>

              <section className="stats-grid kyc-stats">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Verified</span>
                    <span className="stat-icon green">
                      <CheckCircle size={19} />
                    </span>
                  </div>
                  <h2>
                    {kyc.filter(p => p.status === "Verified").length}
                  </h2>
                  <small>Approved demo profiles</small>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Pending review</span>
                    <span className="stat-icon purple">
                      <Clock size={19} />
                    </span>
                  </div>
                  <h2>{pendingKyc}</h2>
                  <small>Awaiting admin action</small>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Rejected</span>
                    <span className="stat-icon red">
                      <XCircle size={19} />
                    </span>
                  </div>
                  <h2>
                    {kyc.filter(p => p.status === "Rejected").length}
                  </h2>
                  <small>Rejected demo profiles</small>
                </div>
              </section>

              <section className="panel table-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Customer verification profiles</h3>
                    <p>
                      Use the status selector to simulate an administrative
                      review.
                    </p>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Country</th>
                        <th>Document type</th>
                        <th>Status</th>
                        <th>Update status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {kyc.map(profile => (
                        <tr key={profile.id}>
                          <td>
                            <div className="customer-cell">
                              <div className="avatar">
                                {profile.name
                                  .split(" ")
                                  .map(n => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <strong>{profile.name}</strong>
                            </div>
                          </td>

                          <td>{profile.country}</td>
                          <td>{profile.document}</td>
                          <td><Badge>{profile.status}</Badge></td>
                          <td>
                            <select
                              className="filter-select"
                              value={profile.status}
                              disabled={savingKycId === profile.id}
                              onChange={e =>
                                updateKyc(profile.id, e.target.value)
                              }
                            >
                              <option>Pending</option>
                              <option>Verified</option>
                              <option>Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <p className="disclaimer">
                Fictional profiles only. No real identity documents are
                collected or verified.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


export default App;
