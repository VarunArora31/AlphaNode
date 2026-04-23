export default function StatsPanel({ depth, setDepth, stats }) {
  return (
    <div className="stats-panel">
      <label>
        Search Depth:
        <select
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      {stats && (
        <>
          <p>
            Positions evaluated: <strong>{stats.positionCount}</strong>
          </p>
          <p>
            Time: <strong>{(stats.timeMs / 1000).toFixed(2)}s</strong>
          </p>
          <p>
            Positions/s: <strong>{stats.positionsPerSec}</strong>
          </p>
        </>
      )}
    </div>
  );
}
