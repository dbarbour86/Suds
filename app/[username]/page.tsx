import { notFound } from "next/navigation";
import { profiles, type ProfileUsername } from "../../data/profiles";
import { ProfileView } from "./profile-view";

export function generateStaticParams() {
  return Object.keys(profiles).map((username) => ({ username }));
}

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = profiles[username as ProfileUsername];

  if (!profile) {
    notFound();
  }

  return <ProfileView defaultProfile={profile} />;
}
