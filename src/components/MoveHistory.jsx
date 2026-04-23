import { useEffect, useRef } from "react";

export default function MoveHistory({ moves }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [moves]);

  const pairs = [];
  for (let i = 0; i < moves.length; i += 2)
    pairs.push([moves[i], moves[i + 1] ?? ""]);

  return (
    <div className="move-history" ref={ref}>
      {pairs.map(([w, b], i) => (
        <div key={i} className="move-pair">
          <span className="move-num">{i + 1}.</span>
          <span>{w}</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}
