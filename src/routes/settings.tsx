import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SettingsSkeleton } from "@/components/skeletons/settings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/atoms";
import { CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/settings")({
  pendingComponent: SettingsSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: () => ({
    meta: [
      { title: "Settings — Voicelens" },
      { name: "description", content: "Источники, команда, AI-настройки и уведомления." },
    ],
  }),
  component: SettingsPage,
});

const SOURCES = [
  { name: "Я.Маркет", status: "connected", count: "423 отзыва/нед" },
  { name: "Otzovik", status: "connected", count: "186 отзывов/нед" },
  { name: "2GIS", status: "connected", count: "94 отзыва/нед" },
  { name: "Google Maps", status: "connected", count: "212 отзывов/нед" },
  { name: "Trustpilot", status: "disconnected", count: "—" },
  { name: "App Store", status: "connected", count: "67 отзывов/нед" },
];

const TEAM = [
  { name: "Мария Воронина", role: "Product Analyst", email: "m.voronina@voicelens.ai" },
  { name: "Дмитрий Петров", role: "Logistics Lead", email: "d.petrov@voicelens.ai" },
  { name: "Иван Новиков", role: "Customer Care", email: "i.novikov@voicelens.ai" },
  { name: "Ольга Соколова", role: "Marketing", email: "o.sokolova@voicelens.ai" },
];

function SettingsPage() {
  return (
    <AppShell title="Настройки" subtitle="Источники, команда, AI и уведомления">
      <div className="motion-page grid grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-3">
        <Card className="motion-surface p-5 lg:col-span-2">
          <SectionHeader title="Источники отзывов" subtitle="Подключённые площадки парсинга" action={<Button size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3.5 w-3.5" /> Добавить</Button>} />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {SOURCES.map(s => (
              <div key={s.name} className="motion-row flex items-center justify-between rounded-lg border bg-card p-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="num text-[11px] text-muted-foreground">{s.count}</p>
                </div>
                {s.status === "connected" ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-positive-soft px-1.5 py-0.5 text-[10px] font-medium text-positive-foreground"><CheckCircle2 className="h-3 w-3" /> Активен</span>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-xs">Подключить</Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="motion-surface p-5">
          <SectionHeader title="AI-настройки" subtitle="Параметры генерации гипотез" />
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between"><Label className="text-xs">Порог confidence</Label><span className="num text-xs font-medium">75%</span></div>
              <Slider defaultValue={[75]} max={100} step={1} />
              <p className="mt-1 text-[10px] text-muted-foreground">Гипотезы ниже порога не показываются.</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between"><Label className="text-xs">Минимальная сила сигнала</Label><span className="num text-xs font-medium">50</span></div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <Separator />
            <div className="flex items-center justify-between"><Label className="text-xs">Авто-кластеризация</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Учитывать сарказм</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Обогащать сегментами</Label><Switch /></div>
          </div>
        </Card>

        <Card className="motion-surface p-5 lg:col-span-2">
          <SectionHeader title="Команда" subtitle="Назначение владельцев и доступы" action={<Button size="sm" variant="outline" className="h-8 text-xs"><Plus className="mr-1 h-3.5 w-3.5" /> Пригласить</Button>} />
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-xs">
              <thead className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2 text-left font-medium">Имя</th><th className="px-2 py-2 text-left font-medium">Роль</th><th className="px-2 py-2 text-left font-medium">Email</th><th className="px-2 py-2 text-right font-medium"></th></tr>
              </thead>
              <tbody>
                {TEAM.map(m => (
                  <tr key={m.email} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-medium">{m.name}</td>
                    <td className="px-2 py-2.5 text-muted-foreground">{m.role}</td>
                    <td className="px-2 py-2.5 text-muted-foreground">{m.email}</td>
                    <td className="px-2 py-2.5 text-right"><Button size="sm" variant="ghost" className="h-7 text-xs">Управлять</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="motion-surface p-5">
          <SectionHeader title="Уведомления" subtitle="Что и куда присылать" />
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Email для алертов</Label>
              <Input defaultValue="alerts@voicelens.ai" className="mt-1.5 h-8 text-xs" />
            </div>
            <Separator />
            <div className="flex items-center justify-between"><Label className="text-xs">Аномалии тем</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Новые critical-инсайты</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Еженедельный дайджест</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Slack-интеграция</Label><Switch /></div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
