import { listClients } from "@/lib/documents/server";
import { ClientList } from "./_components/ClientList";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  return <ClientList clients={await listClients()} />;
}
