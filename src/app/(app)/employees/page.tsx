'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VirtualizedDataTable } from '@/components/ui/virtualized-data-table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { employeeService, Employee } from '@/services/employeeService';
import { Trash2, Edit } from 'lucide-react';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<{
    page: number;
    limit: number;
    search: string;
    sort: string;
  }>({
    page: 0,
    limit: 10,
    search: '',
    sort: 'created_at:desc'
  });

  // Fetch employees from API
  const fetchEmployees = async (params: { page: number; limit: number; search: string; sort: string }) => {
    try {
      setLoading(true);
      setCurrentParams(params);
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

  // Delete employee
  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      setDeleteLoading(employee.id);
      await employeeService.deleteEmployee(employee.id);
      toast.success(`Employee "${employee.name}" deleted successfully`);

      // Refresh the employee list with current parameters
      await fetchEmployees(currentParams);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(null);
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
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(row.getValue("salary"))}
          </div>
        ),
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/employees/${employee.id}/edit`)}
                disabled={deleteLoading === employee.id}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deleteLoading === employee.id}
                  >
                    {deleteLoading === employee.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the employee
                      <span className="font-semibold"> &#34;{employee.name}&#34; </span>
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEmployee(employee)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
      },
    ],
    [deleteLoading, router]
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>Employee Management</span>
              <Button
                onClick={() => router.push('/employees/create')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Employee</span>
              </Button>
            </div>
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
