'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EmployeeForm } from '@/components/employees/employee-form';
import { employeeService, Employee } from '@/services/employeeService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const id = params.id as string;
        const employeeData = await employeeService.getEmployeeById(id);
        
        if (!employeeData) {
          toast.error('Employee not found');
          router.push('/employees');
          return;
        }
        
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Failed to fetch employee details');
        router.push('/employees');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-lg font-medium">Employee not found</h2>
          <p className="text-muted-foreground">The employee you&#39;re looking for doesn&#39;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <EmployeeForm employee={employee} />
    </div>
  );
}
