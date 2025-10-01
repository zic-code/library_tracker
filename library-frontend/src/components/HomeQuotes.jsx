import { useEffect, useState } from "react";

const FALLBACK = [
  { content: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { content: "A room without books is like a body without a soul.", author: "Cicero" },
];

export default function HomeQuotes() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    (async () => {
      try {
        // Quotable: random quotes (limit=3)
        const res = await fetch("https://api.quotable.io/quotes/random?limit=3");
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json(); // [{content, author, ...}]
        if (Array.isArray(data) && data.length) setItems(data);
      } catch (e) {e}
    })();
  }, []);

  return (
    <section className="max-w-3xl mx-auto mt-6 grid gap-3">
      {items.map((q, i) => (
        <blockquote key={i} className="rounded-xl p-4 bg-white/80 backdrop-blur shadow">
          <p className="text-lg">“{q.content}”</p>
          <footer className="mt-2 text-sm text-gray-600">— {q.author || "Unknown"}</footer>
        </blockquote>
      ))}
    </section>
  );
}

export default HomeQuotes;