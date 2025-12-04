'use client';

import { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VirtualizedDataTable } from '@/components/ui/virtualized-data-table';
import { toast } from 'sonner';
import { employeeService, Employee } from '@/services/employeeService';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Fetch employees from API
  const fetchEmployees = async (params: { page: number; limit: number; search: string; sort: string }) => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployees({
        page: params.page + 1,
        limit: params.limit,
        search: params.search,
        sort: params.sort,
      });
      
      setEmployees(response.employees);
      setTotal(response.pagination.totalItems);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define columns
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No.',
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const rowNumber = pageIndex * pageSize + row.index + 1;
          return <div className="font-medium">{rowNumber}</div>;
        },
        enableSorting: false,
        minSize: 50,
        maxSize: 50,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: ({ row }) => <div>{row.getValue('age')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'position',
        header: 'Position',
        cell: ({ row }) => <div>{row.getValue('position')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        cell: ({ row }) => (
          <div className="font-medium">
            ${row.getValue('salary')?.toLocaleString()}
          </div>
        ),
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Employee Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedDataTable
            data={employees}
            columns={columns}
            loading={loading}
            total={total}
            onFetchData={fetchEmployees}
            searchPlaceholder="Search employees..."
            height={600}
            rowHeight={60}
            enableSearch={true}
            enablePagination={true}
            enableSorting={true}
            pageSizeOptions={[10, 25, 50, 100, 1000, 10000]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
