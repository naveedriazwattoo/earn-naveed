import { WorldScanTransaction } from '../../hooks/useTransactions';

type PastTransactionsProps = {
  transactions: WorldScanTransaction[];
  loading: boolean;
  error: string | null;
  onCheck: () => void;
}

export function PastTransactions({ transactions, loading, error, onCheck }: PastTransactionsProps) {
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">Transaction Checker</h1>
      
      <button
        onClick={onCheck}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Check Transactions'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 space-y-4">
          {transactions.map((tx: WorldScanTransaction) => (
            <div key={tx.hash} className="p-4 text-black bg-gray-100 rounded">
              <div>Hash: {tx.hash}</div>
              <div>From: {tx.from}</div>
              <div>To: {tx.to}</div>
              <div>Value: {tx.value}</div>
              <div>Time: {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}</div>
              <div>Gas: {tx.gas}</div>
              <div>Gas Price: {tx.gasPrice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 