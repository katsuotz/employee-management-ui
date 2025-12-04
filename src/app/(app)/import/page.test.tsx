import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {vi} from 'vitest'
import ImportPage from './page'
import {importApiService, ImportResponse, ImportProgress} from '@/services/importApiService'

// Mock the importApiService
vi.mock('@/services/importApiService', () => ({
  importApiService: {
    uploadCSV: vi.fn(),
    getImportStatus: vi.fn(),
  },
}))

// Mock Dialog component
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({children, open, onOpenChange}: any) => (
    open ? (
      <div data-testid="import-dialog">
        <div data-testid="dialog-content">{children}</div>
        <button data-testid="close-dialog" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    ) : null
  ),
  DialogContent: ({children, hideCloseButton}: any) => (
    <div data-testid="dialog-content-inner">
      {hideCloseButton && <div data-testid="close-button-hidden">Close button hidden</div>}
      {children}
    </div>
  ),
  DialogHeader: ({children}: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({children}: any) => <div data-testid="dialog-title">{children}</div>,
}))

describe('ImportPage', () => {
  const mockUploadCSV = vi.mocked(importApiService.uploadCSV)
  const mockGetImportStatus = vi.mocked(importApiService.getImportStatus)

  const mockImportResponse: ImportResponse = {
    jobId: 'test-job-123',
    totalRows: 100,
    totalBatches: 2,
    batchSize: 50,
  }

  const mockImportProgress: ImportProgress = {
    progress: 50,
    processed: 50,
    totalBatches: 100,
    status: 'processing',
    error: null,
    createdAt: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-01-01T00:01:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock setTimeout for polling
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders import page with correct title and upload area', () => {
    render(<ImportPage/>)

    expect(screen.getAllByText('Import Employees')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Click to upload CSV file')[0]).toBeInTheDocument()
    expect(screen.getAllByText('CSV files up to 10MB')[0]).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Import Employees'})).toBeInTheDocument()
  })

  it('rejects non-CSV files by not setting selected file', async () => {
    render(<ImportPage/>);

    const fileInput = screen.getByTestId("csv-input");

    const invalidFile = new File(['test'], 'test.txt', {type: 'text/plain'});

    // manually assign file to hidden input
    Object.defineProperty(fileInput, "files", {
      value: [invalidFile]
    });

    fireEvent.change(fileInput);

    expect(screen.queryByTestId("file-selected")).not.toBeInTheDocument();
  });


  it('rejects files larger than 10MB', async () => {
    render(<ImportPage/>);

    const input = screen.getByTestId('csv-input');
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.csv', {type: 'text/csv'});

    Object.defineProperty(input, "files", {value: [largeFile]});
    fireEvent.change(input);

    // File should not be accepted
    expect(screen.queryByTestId('file-selected')).not.toBeInTheDocument();
  });


  it('accepts valid CSV and shows info', () => {
    render(<ImportPage/>);

    const input = screen.getByTestId('csv-input');
    const csv = new File(['a,b'], 'test.csv', {type: 'text/csv'});

    Object.defineProperty(input, "files", {value: [csv]});
    fireEvent.change(input);

    const el = screen.getByTestId('file-selected');
    expect(el).toHaveTextContent('Selected: test.csv');
  });


  it('does nothing when clicking upload without file', () => {
    render(<ImportPage/>);

    const button = screen.getByRole('button', {name: 'Import Employees'});

    // Sync click — no await
    fireEvent.click(button);

    // Modal must NOT open
    expect(screen.queryByTestId('progress-dialog')).not.toBeInTheDocument();
  });
})
