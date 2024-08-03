import { Table } from "@tanstack/react-table"
import { Input } from "../ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RxMixerVertical as FaMixer } from 'react-icons/rx'
import { Button } from "../ui/button"
import { DataTableFaceted } from "./DataTableFaceted"
import { X as Cross2Icon } from 'lucide-react'

interface DataTableToolbarProps<TData> {
    table: Table<TData>,
    filterTarget?: string,
    facetedFilterOption?: {
        value: string,
        label: string
    }[],
    facetedTarget?: string,
    faceteColumn: boolean,
    enableSearchFilter?: boolean,
    enableHiddenColumn?: boolean
}

function DataTableToolbar<TData>({
    table,
    filterTarget,
    facetedFilterOption,
    facetedTarget,
    faceteColumn,
    enableSearchFilter = true,
    enableHiddenColumn = true
}: DataTableToolbarProps<TData>) {
    const target = (enableSearchFilter && (filterTarget?.match(/(product|category|user|stock|supplier|customer|role)/gi) ?? '')) as any[];
    const targetString = enableSearchFilter && ((target[0] as string).toLowerCase());
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex lg:justify-between lg:items-center lg:flex-row lg:mb-0 justify-start flex-col items-start mb-6">
            <div className="flex lg:items-center items-start flex-col lg:flex-row py-4 gap-2">
                {
                    enableSearchFilter && (
                        <Input
                            placeholder={`Filter ${targetString} Name ...`}
                            value={(table.getColumn(filterTarget || '')?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(filterTarget || '')?.setFilterValue(event.target.value)
                            }
                            className="w-[86vw] lg:w-72 placeholder:capitalize ml-1 lg:ml-0"
                        />
                    )
                }
                <div className="flex-start flex-row">
                    {(faceteColumn && facetedTarget && facetedFilterOption) && (
                        <DataTableFaceted
                            column={table.getColumn(facetedTarget)}
                            title={'Category'}
                            options={facetedFilterOption}
                        />
                    )}
                    {isFiltered && (
                        <Button
                            variant="outline"
                            onClick={() => table.resetColumnFilters()}
                            className="pl-6 border-dashed"
                        >
                            Reset
                            <Cross2Icon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            {
                enableHiddenColumn && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="lg:ml-auto lg:mr-0 mr-auto border-dashed lg:border-solid">
                                <FaMixer className="mr-2" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize text-xs"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </div>
    )
}

export default DataTableToolbar