"use client";

import { useState } from "react";
import type { Faq } from "@/lib/types";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {faqs.map((f, i) => (
        <div className={`faq-item${openIndex === i ? " open" : ""}`} key={f.q}>
          <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {f.q}
            <span className="chev">⌄</span>
          </button>
          <div className="faq-a">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
