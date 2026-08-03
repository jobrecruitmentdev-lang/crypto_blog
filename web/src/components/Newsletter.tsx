"use client";

import { useState } from "react";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="newsletter">
      <div>
        <h3>Never miss an airdrop</h3>
        <p>Get the hottest opportunities delivered to your inbox weekly.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubscribed(true);
          e.currentTarget.reset();
        }}
      >
        <input
          type="email"
          placeholder={subscribed ? "Thanks, you're subscribed!" : "Enter your email..."}
          required
        />
        <button className="btn btn-primary" type="submit">
          Subscribe
        </button>
      </form>
    </div>
  );
}
