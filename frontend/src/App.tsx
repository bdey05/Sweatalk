import React from "react";
import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState("");
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
  }, []);

  return (
    <div>
      <h2>Test page</h2>
      <h2>{data.name} is {data.age}</h2>
      {err && <p>{err}</p>}
    </div>
  );
};

export default App;
