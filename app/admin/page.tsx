import { profiles } from "../../data/profiles";
import { AdminForm } from "./admin-form";

export const metadata = {
  title: "Edit Tyrees | Suds.to",
  description: "Local profile editor for the Tyrees Suds.to showcase.",
};

export default function AdminPage() {
  return <AdminForm defaultProfile={profiles.tyrees} />;
}
