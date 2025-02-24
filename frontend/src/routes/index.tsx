import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  /*const [data, setData] = useState("");
  const [err, setError] = useState<string | null>(null);

  useEffect(() => {
        const getData = async () => {
          try {
            const res = await fetch("http://localhost:5000/login");
            if (!res.ok) {
              throw new Error(`Response status: ${res.status}`);
            }
            const json = await res.json();
            setData(json);
          } catch (e) {
            setError(e);
          }
        };
        getData();
        <h2>{data.name} is {data.age}</h2>
          {err && <p>{err}</p>}
      }, []);*/

  return (
    <div className="landing">

    </div>
  );
}
