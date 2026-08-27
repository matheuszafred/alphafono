import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CrmProvider } from "@/app/crm/_lib/crm-store";
import { AppSidebar } from "@/app/crm/_components/app-sidebar";

// O provider de dados envolve a sidebar também: o contador de "a retornar" que
// aparece no menu sai da mesma lista que as telas usam, então não há como o menu
// dizer um número e a tela mostrar outro.
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden">{children}</SidebarInset>
      </SidebarProvider>
    </CrmProvider>
  );
}
