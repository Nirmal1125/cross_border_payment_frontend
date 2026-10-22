
import { Eye } from "lucide-react";
import Badge from "./Badge";

function TransactionTable({ rows, onSelect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Sender / Receiver</th>
            <th>Amount</th>
            <th>Risk level</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <strong className="txn-id">{transaction.id}</strong>
                <small className="table-sub">
                  {transaction.country}
                </small>
              </td>

              <td>
                <div className="sender-name">
                  {transaction.sender}
                </div>
                <small className="table-sub">
                  To {transaction.receiver}
                </small>
              </td>

              <td>
                <strong>
                  {transaction.amount.toLocaleString()}{" "}
                  {transaction.currency}
                </strong>
              </td>

              <td><Badge>{transaction.risk}</Badge></td>
              <td><Badge>{transaction.status}</Badge></td>

              <td>
                <button
                  className="view-button"
                  onClick={() => onSelect(transaction)}
                  title="View transaction"
                >
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="6" className="empty-state">
                No transactions match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
