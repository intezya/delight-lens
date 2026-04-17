import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { GlobalFiltersBar } from "./global-filters";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-1 flex min-w-0 flex-1 items-center gap-3">
              <div className="flex min-w-0 flex-col leading-tight">
                <h1 className="truncate text-sm font-semibold tracking-tight">{title}</h1>
                {subtitle && <span className="truncate text-[10px] text-muted-foreground">{subtitle}</span>}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {actions}
              <Button variant="ghost" size="icon" className="h-8 w-8"><Bell className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><HelpCircle className="h-4 w-4" /></Button>
            </div>
          </header>
          <GlobalFiltersBar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
