
import {
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Wallet,
  CheckCircle,
  ShieldCheck,
  Activity,
  Globe,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import TransactionTable from "../components/TransactionTable";
import { chartData } from "../data/demoData";

function Dashboard({
  transactions = [],
  pendingKyc = 0,
  highRisk = 0,
  volume = 0,
  loading = false,
  loadData,
  navigate,
  setSelected,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PAYMENT INTELLIGENCE</p>
          <h1>Dashboard Overview</h1>
          <p>
            Monitor cross-border activity, transaction risk
            and customer verification.
          </p>
        </div>

        <button
          className="outline-button"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={16} /> Refresh view
        </button>
      </div>

      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">
            <Activity size={14} /> LIVE MONITORING · DEMO
          </span>

          <h2>
            Global payments,<br />one clear view.
          </h2>

          <p>
            Monitor transactions and manage compliance
            from one workspace.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("Transactions")}
          >
            Explore transactions <span>→</span>
          </button>
        </div>

        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="globe">
            <Globe size={72} strokeWidth={1.1} />
          </div>

          <div className="float-chip chip-one">
            <CheckCircle size={15} /> Payment tracked
          </div>

          <div className="float-chip chip-two">
            <ShieldCheck size={15} /> Risk monitoring
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span>Total transactions</span>
            <span className="stat-icon blue">
              <ArrowLeftRight size={19} />
            </span>
          </div>
          <h2>{transactions.length.toLocaleString()}</h2>
          <small>Recorded demo payments</small>
          <div className="stat-foot">
            <TrendingUp size={14} /> Monitoring activity
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Sample payment volume</span>
            <span className="stat-icon purple">
              <Wallet size={19} />
            </span>
          </div>
          <h2>{volume.toLocaleString()}</h2>
          <small>Amounts across mixed currencies</small>
          <div className="stat-foot neutral">
            Currency totals are not converted
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Risk alerts</span>
            <span className="stat-icon red">
              <AlertTriangle size={19} />
            </span>
          </div>
          <h2>{highRisk}</h2>
          <small>High-risk or flagged records</small>
          <div className="stat-foot warning">
            Requires review
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Pending KYC</span>
            <span className="stat-icon green">
              <Users size={19} />
            </span>
          </div>
          <h2>{pendingKyc}</h2>
          <small>Profiles awaiting verification</small>
          <div className="stat-foot">
            <ShieldCheck size={14} /> Compliance overview
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Payment activity</h3>
              <p>Illustrative activity over seven days</p>
            </div>
            <span className="mini-tag">7 DAYS</span>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 8,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="paymentFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#536dfe"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#536dfe"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#edf0f7"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8792a7", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8792a7", fontSize: 12 }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="payments"
                  name="Payments"
                  stroke="#536dfe"
                  strokeWidth={3}
                  fill="url(#paymentFill)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <h3>Risk overview</h3>
              <p>Sample risk classifications</p>
            </div>
            <ShieldCheck size={20} color="#536dfe" />
          </div>

          {["High", "Medium", "Low"].map((level) => {
            const count = transactions.filter(
              (transaction) => transaction.risk === level
            ).length;

            const percent = transactions.length
              ? (count / transactions.length) * 100
              : 0;

            return (
              <div className="risk-row" key={level}>
                <div className="risk-label">
                  <span>{level} risk</span>
                  <strong>{count}</strong>
                </div>

                <div className="progress">
                  <div
                    className={`progress-fill ${level.toLowerCase()}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="risk-note">
            <AlertTriangle size={17} />
            <span>
              Risk levels are illustrative sample labels,
              not real ML predictions.
            </span>
          </div>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent transactions</h3>
            <p>Latest records in the demo environment</p>
          </div>

          <button
            className="text-button"
            onClick={() => navigate("Transactions")}
          >
            View all transactions →
          </button>
        </div>

        <TransactionTable
          rows={transactions.slice(0, 4)}
          onSelect={setSelected}
        />
      </section>

      <p className="disclaimer">
        Academic prototype · Fictional data · No live blockchain
        or banking connection
      </p>
    </>
  );
}

export default Dashboard;
