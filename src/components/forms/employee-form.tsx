'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { employeeService, Employee } from '@/services/employeeService';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import * as z from 'zod';

interface EmployeeFormData {
  name: string;
  age: number | null;
  position: string;
  salary: number | null;
}

// Zod validation schema (matches backend validation)
const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name maximum length is 100 characters'),
  age: z.number().nullable().refine((val) => val !== null, {
    message: 'Age is required',
  }).refine((val) => val !== null && Number.isInteger(val), {
    message: 'Age must be a whole number',
  }),
  position: z.string().min(1, 'Position is required').max(50, 'Position maximum length is 50 characters'),
  salary: z.number().nullable().refine((val) => val !== null, {
    message: 'Salary is required',
  }).refine((val) => val !== null && val >= 0, {
    message: 'Salary must be a positive number',
  }),
});

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

export function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: employee?.name || '',
    age: employee?.age || null,
    position: employee?.position || '',
    salary: employee?.salary ? parseInt(employee.salary.toString()) : null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const validateForm = (): boolean => {
    const result = employeeSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};
      
      // Map Zod errors to our error format
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EmployeeFormData;
        newErrors[field] = issue.message;
      });
      
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleInputChange = (field: keyof EmployeeFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'salary' ? (value === '' ? null : parseInt(String(value)) || null) : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Convert null values to numbers for API submission
      const submissionData = {
        ...formData,
        age: formData.age || 0,
        salary: formData.salary === null ? 0 : formData.salary,
      };
      
      if (employee) {
        // Update existing employee
        const updatedEmployee = await employeeService.updateEmployee(employee.id, submissionData);
        if (updatedEmployee) {
          toast.success(`Employee "${updatedEmployee.name}" updated successfully`);
        } else {
          throw new Error('Failed to update employee');
        }
      } else {
        // Create new employee
        const response = await employeeService.createEmployee(submissionData);
        toast.success(`Employee creation started! Job ID: ${response.jobId}`, {
          description: 'Your employee is being processed in the background.',
          duration: 5000,
        });
      }
      
      // Call success callback or navigate back
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/employees');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(`Failed to ${employee ? 'update' : 'create'} employee. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Create New Employee'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter employee name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={errors.age ? 'border-red-500' : ''}
                step="1"
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="salary"
                type="number"
                placeholder="Enter salary"
                value={formData.salary || ''}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                className={errors.salary ? 'border-red-500' : ''}
                step="1"
              />
              {errors.salary && (
                <p className="text-sm text-red-500">{errors.salary}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Position <span className="text-red-500">*</span>
            </Label>
            <Input
              id="position"
              placeholder="Enter job position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/employees')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (employee ? 'Updating...' : 'Creating...') : (employee ? 'Update Employee' : 'Create Employee')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
