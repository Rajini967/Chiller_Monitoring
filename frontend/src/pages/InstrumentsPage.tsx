import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Wrench, Calendar, FileText, Upload, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Instrument {
  id: string;
  name: string;
  make: string;
  model: string;
  serialNumber: string;
  calibrationDate: Date;
  calibrationDueDate: Date;
  certificateUrl?: string;
  status: 'valid' | 'expiring' | 'expired';
}

const mockInstruments: Instrument[] = [
  {
    id: 'INS-001',
    name: 'Anemometer',
    make: 'TSI',
    model: 'VelociCalc 9565',
    serialNumber: 'TSI-2024-001',
    calibrationDate: new Date('2024-06-15'),
    calibrationDueDate: new Date('2025-06-15'),
    status: 'valid',
  },
  {
    id: 'INS-002',
    name: 'Pressure Gauge',
    make: 'Omega',
    model: 'PGM-100',
    serialNumber: 'OMG-2023-042',
    calibrationDate: new Date('2024-01-20'),
    calibrationDueDate: new Date('2025-01-20'),
    status: 'expiring',
  },
  {
    id: 'INS-003',
    name: 'Thermometer',
    make: 'Fluke',
    model: '52-II',
    serialNumber: 'FLK-2023-088',
    calibrationDate: new Date('2023-11-10'),
    calibrationDueDate: new Date('2024-11-10'),
    status: 'expired',
  },
  {
    id: 'INS-004',
    name: 'Particle Counter',
    make: 'Lighthouse',
    model: 'Handheld 3016',
    serialNumber: 'LH-2024-015',
    calibrationDate: new Date('2024-08-01'),
    calibrationDueDate: new Date('2025-08-01'),
    status: 'valid',
  },
  {
    id: 'INS-005',
    name: 'Flow Meter',
    make: 'Dwyer',
    model: 'RMB-85',
    serialNumber: 'DWY-2024-033',
    calibrationDate: new Date('2024-09-15'),
    calibrationDueDate: new Date('2025-09-15'),
    status: 'valid',
  },
];

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    serialNumber: '',
    calibrationDate: '',
    calibrationDueDate: '',
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'valid':
        return { variant: 'success' as const, icon: CheckCircle2, label: 'Valid' };
      case 'expiring':
        return { variant: 'warning' as const, icon: Clock, label: 'Expiring Soon' };
      case 'expired':
        return { variant: 'danger' as const, icon: AlertTriangle, label: 'Expired' };
      default:
        return { variant: 'secondary' as const, icon: Clock, label: 'Unknown' };
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    return differenceInDays(dueDate, new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calibDate = new Date(formData.calibrationDate);
    const dueDate = new Date(formData.calibrationDueDate);
    const daysUntil = getDaysUntilDue(dueDate);
    
    let status: 'valid' | 'expiring' | 'expired' = 'valid';
    if (daysUntil < 0) status = 'expired';
    else if (daysUntil < 30) status = 'expiring';

    const newInstrument: Instrument = {
      id: `INS-${String(instruments.length + 1).padStart(3, '0')}`,
      name: formData.name,
      make: formData.make,
      model: formData.model,
      serialNumber: formData.serialNumber,
      calibrationDate: calibDate,
      calibrationDueDate: dueDate,
      status,
    };

    setInstruments([newInstrument, ...instruments]);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      make: '',
      model: '',
      serialNumber: '',
      calibrationDate: '',
      calibrationDueDate: '',
    });
    toast.success('Instrument registered successfully');
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Instrument Management"
        subtitle="Track calibration status and certificates"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <p className="data-label">Total Instruments</p>
            <p className="reading-display text-2xl">{instruments.length}</p>
          </div>
          <div className="metric-card">
            <p className="data-label">Valid</p>
            <p className="reading-display text-2xl text-success">
              {instruments.filter(i => i.status === 'valid').length}
            </p>
          </div>
          <div className="metric-card">
            <p className="data-label">Expiring Soon</p>
            <p className="reading-display text-2xl text-warning">
              {instruments.filter(i => i.status === 'expiring').length}
            </p>
          </div>
          <div className="metric-card">
            <p className="data-label">Expired</p>
            <p className="reading-display text-2xl text-danger">
              {instruments.filter(i => i.status === 'expired').length}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="success">{instruments.filter(i => i.status === 'valid').length} Valid</Badge>
            <Badge variant="warning">{instruments.filter(i => i.status === 'expiring').length} Expiring</Badge>
            <Badge variant="danger">{instruments.filter(i => i.status === 'expired').length} Expired</Badge>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                Register Instrument
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Register New Instrument
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Instrument Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Anemometer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="e.g., TSI"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., VelociCalc 9565"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g., TSI-2024-001"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Calibration Date
                    </Label>
                    <Input
                      type="date"
                      value={formData.calibrationDate}
                      onChange={(e) => setFormData({ ...formData, calibrationDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Due Date
                    </Label>
                    <Input
                      type="date"
                      value={formData.calibrationDueDate}
                      onChange={(e) => setFormData({ ...formData, calibrationDueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Calibration Certificate
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload PDF or image</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    Register Instrument
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Instruments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((instrument) => {
            const statusInfo = getStatusInfo(instrument.status);
            const StatusIcon = statusInfo.icon;
            const daysUntil = getDaysUntilDue(instrument.calibrationDueDate);

            return (
              <div
                key={instrument.id}
                className={cn(
                  'bg-card rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer',
                  instrument.status === 'expired' && 'border-danger/30',
                  instrument.status === 'expiring' && 'border-warning/30'
                )}
                onClick={() => setSelectedInstrument(instrument)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-accent" />
                  </div>
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>

                <h4 className="font-semibold text-foreground mb-1">{instrument.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {instrument.make} {instrument.model}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Serial</span>
                    <span className="font-mono text-foreground">{instrument.serialNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Calibrated</span>
                    <span className="text-foreground">{format(instrument.calibrationDate, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Due</span>
                    <span className={cn(
                      'font-medium',
                      daysUntil < 0 ? 'text-danger' : daysUntil < 30 ? 'text-warning' : 'text-foreground'
                    )}>
                      {format(instrument.calibrationDueDate, 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>

                {daysUntil >= 0 && daysUntil < 30 && (
                  <div className="mt-3 p-2 rounded bg-warning/10 text-warning text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {daysUntil} days until calibration due
                  </div>
                )}
                {daysUntil < 0 && (
                  <div className="mt-3 p-2 rounded bg-danger/10 text-danger text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Overdue by {Math.abs(daysUntil)} days
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
