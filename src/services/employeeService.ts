// Mock employee data service for testing
import api from '@/lib/api';

export interface Employee {
  id: string;
  name: string;
  age: number;
  position: string;
  salary: number;
  created_at: string;
  updated_at: string;
}

interface EmployeeResponse {
  employees: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface CreateEmployeeResponse {
  jobId: string;
  message: string;
  status: 'processing' | 'completed' | 'failed';
}

class EmployeeService {
  // Get employees with pagination, search, and sort
  async getEmployees(params: {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
  }): Promise<EmployeeResponse> {
    try {
      const response = await api.get<EmployeeResponse>('/employees', {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search || '',
          sort: params.sort || 'created_at:desc',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const response = await api.get<{ employee: Employee }>(`/employees/${id}`);
      return response.employee;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  // Create employee
  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<CreateEmployeeResponse> {
    try {
      const response = await api.post<CreateEmployeeResponse>('/employees', employee);
      return response;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    try {
      const response = await api.put<{ employee: Employee }>(`/employees/${id}`, updates);
      return response.employee;
    } catch (error) {
      console.error('Error updating employee:', error);
      return null;
    }
  }

  // Delete employee
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await api.delete(`/employees/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  }
}

export const employeeService = new EmployeeService();
