import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Link href="/tyrees">View the Tyrees showcase profile</Link>
    </main>
  );
}
