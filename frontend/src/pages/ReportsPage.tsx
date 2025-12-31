import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  Search,
  Eye,
  Printer,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  type: 'utility' | 'chemical' | 'validation';
  title: string;
  site: string;
  createdBy: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    type: 'utility',
    title: 'Daily Chiller Log - Line A',
    site: 'Site Alpha',
    createdBy: 'James Wilson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'pending',
  },
  {
    id: 'RPT-002',
    type: 'validation',
    title: 'ISO 7 Clean Room Validation - Q4',
    site: 'Site Alpha',
    createdBy: 'Sarah Chen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    approvedBy: 'Sarah Chen',
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'approved',
  },
  {
    id: 'RPT-003',
    type: 'chemical',
    title: 'CIP Chemical Prep Log - Week 48',
    site: 'Site Alpha',
    createdBy: 'James Wilson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    approvedBy: 'Sarah Chen',
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'approved',
  },
  {
    id: 'RPT-004',
    type: 'utility',
    title: 'Boiler Maintenance Log - BL-001',
    site: 'Site Beta',
    createdBy: 'James Wilson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'rejected',
    remarks: 'Missing pressure readings for 14:00 shift',
  },
];

const typeIcons = {
  utility: FileText,
  chemical: FileText,
  validation: FileText,
};

const typeLabels = {
  utility: 'Utility Log',
  chemical: 'Chemical Prep',
  validation: 'Air Validation',
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isSupervisor = user?.role === 'supervisor' || user?.role === 'super_admin';
  const isCustomer = user?.role === 'customer';

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Customers only see approved reports
    if (isCustomer && report.status !== 'approved') return false;
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleApprove = () => {
    if (!selectedReport) return;
    
    setReports(reports.map(r => 
      r.id === selectedReport.id 
        ? { ...r, status: 'approved', approvedBy: user?.name, approvedAt: new Date(), remarks: approvalRemarks }
        : r
    ));
    setIsApprovalDialogOpen(false);
    setSelectedReport(null);
    setApprovalRemarks('');
    toast.success('Report approved and moved to approved folder');
  };

  const handleReject = () => {
    if (!selectedReport || !approvalRemarks) {
      toast.error('Please provide remarks for rejection');
      return;
    }
    
    setReports(reports.map(r => 
      r.id === selectedReport.id 
        ? { ...r, status: 'rejected', remarks: approvalRemarks }
        : r
    ));
    setIsApprovalDialogOpen(false);
    setSelectedReport(null);
    setApprovalRemarks('');
    toast.error('Report rejected');
  };

  const handleExport = (reportId: string) => {
    toast.success(`Exporting ${reportId} to PDF...`);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Reports"
        subtitle={isCustomer ? 'View approved reports for your site' : 'Review, approve, and export reports'}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <p className="data-label">Total Reports</p>
            <p className="reading-display text-2xl">{reports.length}</p>
          </div>
          <div className="metric-card">
            <p className="data-label">Pending Review</p>
            <p className="reading-display text-2xl text-warning">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="metric-card">
            <p className="data-label">Approved</p>
            <p className="reading-display text-2xl text-success">
              {reports.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="metric-card">
            <p className="data-label">Rejected</p>
            <p className="reading-display text-2xl text-danger">
              {reports.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="utility">Utility Logs</SelectItem>
                <SelectItem value="chemical">Chemical Prep</SelectItem>
                <SelectItem value="validation">Validations</SelectItem>
              </SelectContent>
            </Select>

            {!isCustomer && (
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Report</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{report.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">{report.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="accent">{typeLabels[report.type]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{report.site}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{report.createdBy}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(report.createdAt, 'dd/MM/yy HH:mm')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        report.status === 'approved' ? 'success' : 
                        report.status === 'rejected' ? 'danger' : 'pending'
                      }>
                        {report.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {report.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {report.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {report.status === 'approved' && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleExport(report.id)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Printer className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {isSupervisor && report.status === 'pending' && (
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsApprovalDialogOpen(true);
                            }}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Dialog */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Review Report</DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">{selectedReport.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created by {selectedReport.createdBy} on {format(selectedReport.createdAt, 'PPpp')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Remarks / Notes</Label>
                  <Textarea
                    value={approvalRemarks}
                    onChange={(e) => setApprovalRemarks(e.target.value)}
                    placeholder="Add remarks (required for rejection)..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleReject}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="success" onClick={handleApprove}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
