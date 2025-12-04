import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import EmployeesPage from './page'
import { employeeService, Employee } from '@/services/employeeService'

// Mock the employeeService
vi.mock('@/services/employeeService', () => ({
  employeeService: {
    getEmployees: vi.fn(),
    deleteEmployee: vi.fn(),
  },
  Employee: {
    fromJSON: vi.fn(),
  },
}))

// Mock VirtualizedDataTable
vi.mock('@/components/ui/virtualized-data-table', () => ({
  VirtualizedDataTable: ({ 
    data, 
    columns, 
    loading, 
    onFetchData, 
    height = 600 
  }: any) => (
    <div data-testid="virtualized-table">
      <div data-testid="table-loading">{loading ? 'Loading...' : 'Loaded'}</div>
      <div data-testid="table-data-count">{data?.length || 0} rows</div>
      <div data-testid="table-height">{height}px</div>
      <button 
        data-testid="fetch-more-data"
        onClick={() => onFetchData({ page: 1, limit: 10, search: '', sort: 'created_at:desc' })}
      >
        Fetch Data
      </button>
    </div>
  ),
}))

describe('EmployeesPage', () => {
  const mockGetEmployees = vi.mocked(employeeService.getEmployees)

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 30,
      position: 'Software Engineer',
      salary: 75000,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      position: 'Product Manager',
      salary: 85000,
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetEmployees.mockResolvedValue({
      employees: mockEmployees,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: mockEmployees.length,
        itemsPerPage: 10,
      },
    })
  })

  it('renders employee management page with correct title', () => {
    render(<EmployeesPage />)
    
    expect(screen.getByText('Employee Management')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Employee' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Import CSV' })).toBeInTheDocument()
  })

  it('renders create employee button with correct styling', () => {
    render(<EmployeesPage />)
    
    const createButton = screen.getByRole('button', { name: 'Create Employee' })
    expect(createButton).toBeInTheDocument()
    expect(createButton).toBeEnabled()
  })

  it('renders import CSV button with correct styling', () => {
    render(<EmployeesPage />)
    
    const importButton = screen.getByRole('button', { name: 'Import CSV' })
    expect(importButton).toBeInTheDocument()
    expect(importButton).toBeEnabled()
  })
})
