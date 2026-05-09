import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Send, Target } from "lucide-react";

export function OwnerTeamCard({
  team,
  owner,
  recommendedAction,
  taskDescription,
}: {
  team: string;
  owner: string;
  recommendedAction: string;
  taskDescription: string;
}) {
  return (
    <Card className="p-6 md:p-7">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Команда-владелец</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-soft text-ai-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold">{team}</p>
                <p className="text-xs text-muted-foreground">Ответственный: {owner}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Рекомендованное действие</p>
            <p className="mt-1.5 inline-flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-ai" />
              {recommendedAction}
            </p>
          </div>

          <div className="rounded-lg border-l-2 border-ai/50 bg-muted/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Задача</p>
            <p className="mt-1 text-sm leading-snug">{taskDescription}</p>
          </div>
        </div>

        <Button size="sm" className="press h-9 text-xs">
          <Send className="mr-1.5 h-3.5 w-3.5" /> Создать задачу
        </Button>
      </div>
    </Card>
  );
}
