import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Bell, HelpCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <div className="ml-auto flex items-center gap-1.5">
              <Select defaultValue="30d">
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Последние 7 дней</SelectItem>
                  <SelectItem value="30d">Последние 30 дней</SelectItem>
                  <SelectItem value="90d">Последние 90 дней</SelectItem>
                  <SelectItem value="ytd">С начала года</SelectItem>
                </SelectContent>
              </Select>
              {actions}
              <Button variant="ghost" size="icon" className="h-8 w-8"><Bell className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><HelpCircle className="h-4 w-4" /></Button>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
