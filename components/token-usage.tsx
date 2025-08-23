import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenUsageProps {
  used: number
  total: number
  plan: "free" | "pro" | "business"
}

export function TokenUsage({ used, total, plan }: TokenUsageProps) {
  const percentage = (used / total) * 100
  const isNearLimit = percentage > 80

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Progress value={percentage} className="h-2" aria-label={`Uso de tokens: ${used} de ${total}`} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {used.toLocaleString()}/{total.toLocaleString()}
              </span>
              <Badge variant={isNearLimit ? "destructive" : "secondary"}>
                {plan === "free" ? "Gratis" : plan === "pro" ? "Pro" : "Business"}
              </Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Has usado {percentage.toFixed(1)}% de tus tokens mensuales</p>
          {isNearLimit && <p className="text-destructive">¡Cerca del límite!</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
