import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap error-page">
      <div className="code gradient">404</div>
      <h1>This page doesn&apos;t exist</h1>
      <p>The airdrop or page you&apos;re looking for may have moved or been removed.</p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
