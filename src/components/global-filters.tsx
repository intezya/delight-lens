import { Calendar, Filter, Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function GlobalFiltersBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-background/60 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Поиск отзывов, тем, инсайтов…" className="h-8 w-[280px] pl-8 text-xs" />
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Select defaultValue="30d">
          <SelectTrigger className="h-8 w-[130px] text-xs">
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

        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Источники" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все источники</SelectItem>
            <SelectItem value="ym">Я.Маркет</SelectItem>
            <SelectItem value="otz">Otzovik</SelectItem>
            <SelectItem value="2gis">2GIS</SelectItem>
            <SelectItem value="gm">Google Maps</SelectItem>
            <SelectItem value="tp">Trustpilot</SelectItem>
            <SelectItem value="as">App Store</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="el">Электроника</SelectItem>
            <SelectItem value="bt">Бытовая техника</SelectItem>
            <SelectItem value="au">Аудио</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Filter className="mr-1.5 h-3.5 w-3.5" /> Фильтры
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">2</Badge>
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Виды
        </Button>
      </div>
    </div>
  );
}
