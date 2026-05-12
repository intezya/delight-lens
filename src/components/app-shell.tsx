import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingModal, useOnboarding } from "./onboarding-modal";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const { open, close, reopen } = useOnboarding();
  const hasHeaderCopy = Boolean(title || subtitle);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <header className="anim-drop sticky top-0 z-20 flex min-h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-3">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-1 flex min-w-0 flex-1 items-center gap-3">
              {hasHeaderCopy && (
                <div className="flex min-w-0 flex-col leading-tight">
                  {title && (
                    <h1 className="truncate text-sm font-semibold tracking-tight">{title}</h1>
                  )}
                  {subtitle && (
                    <span className="truncate text-[10px] text-muted-foreground">{subtitle}</span>
                  )}
                </div>
              )}
            </div>
            <div className="ml-auto flex min-w-0 items-center justify-end gap-1.5">
              {actions && (
                <div className="hidden min-w-0 items-center justify-end gap-1.5 sm:flex">
                  {actions}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={reopen}
                className="h-8 gap-1.5 px-2 text-xs"
                aria-label="Как пользоваться"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Как пользоваться</span>
              </Button>
            </div>
          </header>
          <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
        </SidebarInset>
      </div>
      <OnboardingModal open={open} onClose={close} />
    </SidebarProvider>
  );
}
