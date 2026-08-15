import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { FAQS } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about crypto airdrops, how to farm them, and how to stay safe.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div className="breadcrumb">
          <Link href="/">Home</Link> / FAQ
        </div>
        <div className="section-head">
          <div>
            <h2>Frequently Asked Questions</h2>
          </div>
        </div>
        <FaqAccordion faqs={FAQS} />
      </div>
    </section>
  );
}
