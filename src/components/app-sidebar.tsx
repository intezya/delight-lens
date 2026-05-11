import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquareQuote,
  Sparkles,
  Tags,
  TrendingUp,
  Settings,
  Sparkle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { to: "/reviews", label: "Отзывы", icon: MessageSquareQuote, badge: "1.7k" },
  { to: "/insights", label: "Гипотезы", icon: Sparkles, badge: "AI" },
  { to: "/topics", label: "Темы", icon: Tags },
  { to: "/impact", label: "Эффект", icon: TrendingUp },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          to="/"
          className="sidebar-collapse-gap motion-nav-link flex items-center gap-2.5 px-2 py-2"
        >
          <div className="anim-scale-in flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--ai)] to-[var(--ai-foreground)] text-white shadow-[var(--shadow-elev-2)]">
            <Sparkle className="h-4 w-4" />
          </div>
          <div className="sidebar-copy-motion flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Voicelens</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Review Intelligence
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Рабочее пространство</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = isActive(item.to, "exact" in item ? item.exact : false);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} className="motion-nav-link">
                        <Icon className="h-4 w-4" />
                        <span className="sidebar-copy-motion">{item.label}</span>
                        {"badge" in item && item.badge && (
                          <Badge
                            variant="secondary"
                            className="sidebar-menu-badge-motion ml-auto h-5 px-1.5 text-[10px] font-medium"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Аккаунт</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path === "/settings"} tooltip="Настройки">
                  <Link to="/settings" className="motion-nav-link">
                    <Settings className="h-4 w-4" />
                    <span className="sidebar-copy-motion">Настройки</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="sidebar-collapse-gap flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            МВ
          </div>
          <div className="sidebar-copy-motion flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-medium">Мария Воронина</span>
            <span className="truncate text-[10px] text-muted-foreground">Продуктовый аналитик</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
