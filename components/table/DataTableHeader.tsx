import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowUpDown as CaretSortIcon,
  } from "lucide-react"
  import { Column } from "@tanstack/react-table"
  
  import { cn } from "@/lib/utils"
  import { Button } from "../ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu"
  
  interface DataTableHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
  }
  
  export function DataTableHeader<TData, TValue>({
    column,
    title,
    className,
  }: DataTableHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
    }

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span className="text-xs">{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-3 w-3" />
              ) : (
                <CaretSortIcon className="ml-2 h-3 w-3" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }