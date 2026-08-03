"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        e.currentTarget.reset();
      }}
    >
      <label>Name</label>
      <input type="text" required />
      <label>Email</label>
      <input type="email" required />
      <label>Reason</label>
      <select defaultValue="General question">
        <option>General question</option>
        <option>Submit an airdrop</option>
        <option>Report an issue</option>
        <option>Partnership</option>
      </select>
      <label>Message</label>
      <textarea required />
      <button className="btn btn-primary" type="submit" style={{ marginTop: 20 }}>
        Send Message
      </button>
      {sent && (
        <p style={{ color: "var(--accent2)", fontSize: 13, marginTop: 12 }}>
          Thanks — we&apos;ll get back to you soon.
        </p>
      )}
    </form>
  );
}
