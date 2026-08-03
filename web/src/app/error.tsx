"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap error-page">
      <div className="code danger">500</div>
      <h1>Something went wrong on our end</h1>
      <p>We&apos;re aware of the issue and working to fix it. Please try again in a moment.</p>
      <button className="btn btn-primary" onClick={() => unstable_retry()}>
        Try Again
      </button>
    </div>
  );
}
