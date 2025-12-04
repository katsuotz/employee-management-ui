'use client';

import { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Button } from './button';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';

// Types
export interface VirtualizedDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
  total?: number;
  onFetchData?: (params: {
    page: number;
    limit: number;
    search: string;
    sort: string;
  }) => Promise<void>;
  searchPlaceholder?: string;
  height?: number;
  rowHeight?: number;
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  pageSizeOptions?: number[];
}

export function VirtualizedDataTable<TData, TValue>({
  data,
  columns,
  loading = false,
  total = data.length,
  onFetchData,
  searchPlaceholder = 'Search...',
  height = 600,
  rowHeight = 60,
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  pageSizeOptions = [10, 25, 50, 100, 1000, 10000],
}: VirtualizedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting: enableSorting ? sorting : [],
      globalFilter,
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
    },
    manualPagination: !!onFetchData,
    manualSorting: !!onFetchData,
    manualFiltering: !!onFetchData,
    pageCount: enablePagination ? Math.ceil(total / pagination.pageSize) : 1,
  });

  // Virtual scrolling setup
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  // Debounced search effect
  useEffect(() => {
    if (!onFetchData) return;

    const timer = setTimeout(() => {
      const sortField = sorting[0]?.id || 'name';
      const sortDirection = sorting[0]?.desc ? 'desc' : 'asc';
      const sortParam = `${sortField}:${sortDirection}`;

      onFetchData({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [globalFilter, sorting, pagination.pageIndex, pagination.pageSize]);

  return (
    <div className="space-y-4">
      {/* Search and Limit Controls */}
      {(enableSearch || enablePagination) && (
        <div className="flex items-center space-x-2 mb-4 justify-between">
          {enablePagination && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Show</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value: string) => {
                  setPagination(prev => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={String(pagination.pageSize)} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map(size => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium">entries</span>
            </div>
          )}
          
          {enableSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
                className="pl-8"
              />
            </div>
          )}
        </div>
      )}

      {/* Virtualized Table */}
      <div className="border rounded-md">
        {/* Fixed Header */}
        <div className="overflow-x-auto">
          <div className="w-full">
            <div className="sticky top-0 z-10 bg-background border-b flex">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="px-4 h-12 text-left align-middle font-medium text-muted-foreground flex items-center justify-start flex-1"
                    style={{ minWidth: '0', flex: String(header.getSize()) }}
                  >
                      {header.isPlaceholder
                        ? null
                        : enableSorting && header.column.getCanSort()
                        ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => header.column.toggleSorting(header.column.getIsSorted() === 'asc')}
                            className="px-0!"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="ml-2 h-4 w-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        )
                        : (
                          <div className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-0 py-2 text-sm font-medium transition-colors">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )
                      }
                      </div>
                )))}
                </div>
            </div>
        </div>

        {/* Virtualized Body */}
        <div
          ref={tableContainerRef}
          className="relative"
          style={{ height: `${height}px`, overflow: 'auto' }}
        >
          {rows.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <div className="text-lg font-medium">No results found</div>
                <div className="text-sm">
                  {globalFilter ? 'Try adjusting your search criteria' : 'No data available'}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
              className={loading ? 'opacity-50' : ''}
            >
              <table className="w-full">
                <tbody>
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const row = rows[virtualItem.index];
                    return (
                      <tr
                        key={row.id}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                          display: 'flex',
                        }}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-4 align-middle [&:has([role=checkbox])]:pr-0 flex-1"
                            style={{ minWidth: '0', flex: cell.column.getSize() }}
                          >
                            <div className="truncate">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Loading Overlay for Refetch Operations */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of{' '}
            {total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
