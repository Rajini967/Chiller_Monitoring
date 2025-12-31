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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Thermometer, Gauge, Droplets, Save, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface UtilityLog {
  id: string;
  equipmentType: string;
  equipmentId: string;
  t1: number;
  t2: number;
  p1: number;
  p2: number;
  flowRate: number;
  remarks: string;
  operator: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const mockLogs: UtilityLog[] = [
  { id: '1', equipmentType: 'chiller', equipmentId: 'CH-001', t1: 7.2, t2: 12.5, p1: 2.4, p2: 1.8, flowRate: 45.2, remarks: 'Normal operation', operator: 'James Wilson', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'pending' },
  { id: '2', equipmentType: 'boiler', equipmentId: 'BL-001', t1: 185.0, t2: 92.0, p1: 8.5, p2: 7.2, flowRate: 120.0, remarks: 'High temp warning', operator: 'James Wilson', timestamp: new Date(Date.now() - 1000 * 60 * 150), status: 'pending' },
  { id: '3', equipmentType: 'compressor', equipmentId: 'AC-001', t1: 45.0, t2: 38.0, p1: 7.0, p2: 6.5, flowRate: 85.0, remarks: '', operator: 'Sarah Chen', timestamp: new Date(Date.now() - 1000 * 60 * 240), status: 'approved' },
];

const equipmentList = {
  chiller: ['CH-001', 'CH-002', 'CH-003'],
  boiler: ['BL-001', 'BL-002'],
  compressor: ['AC-001', 'AC-002', 'AC-003'],
};

export default function UtilityLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<UtilityLog[]>(mockLogs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    equipmentType: '',
    equipmentId: '',
    t1: '',
    t2: '',
    p1: '',
    p2: '',
    flowRate: '',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: UtilityLog = {
      id: Date.now().toString(),
      equipmentType: formData.equipmentType,
      equipmentId: formData.equipmentId,
      t1: parseFloat(formData.t1),
      t2: parseFloat(formData.t2),
      p1: parseFloat(formData.p1),
      p2: parseFloat(formData.p2),
      flowRate: parseFloat(formData.flowRate),
      remarks: formData.remarks,
      operator: user?.name || 'Unknown',
      timestamp: new Date(),
      status: 'pending',
    };

    setLogs([newLog, ...logs]);
    setIsDialogOpen(false);
    setFormData({
      equipmentType: '',
      equipmentId: '',
      t1: '',
      t2: '',
      p1: '',
      p2: '',
      flowRate: '',
      remarks: '',
    });
    toast.success('Utility log entry saved successfully');
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Utility Logbook"
        subtitle="Manual readings for Chillers, Boilers, and Compressors"
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="pending">{logs.filter(l => l.status === 'pending').length} Pending</Badge>
            <Badge variant="success">{logs.filter(l => l.status === 'approved').length} Approved</Badge>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Utility Log Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Digital Signature Info */}
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{format(new Date(), 'PPpp')}</p>
                    <p className="text-xs text-muted-foreground">Logged by: {user?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Equipment Type</Label>
                    <Select
                      value={formData.equipmentType}
                      onValueChange={(v) => setFormData({ ...formData, equipmentType: v, equipmentId: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chiller">Chiller</SelectItem>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="compressor">Air Compressor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Equipment ID</Label>
                    <Select
                      value={formData.equipmentId}
                      onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}
                      disabled={!formData.equipmentType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.equipmentType && equipmentList[formData.equipmentType as keyof typeof equipmentList]?.map((id) => (
                          <SelectItem key={id} value={id}>{id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Temperature T1 (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.t1}
                      onChange={(e) => setFormData({ ...formData, t1: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Temperature T2 (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.t2}
                      onChange={(e) => setFormData({ ...formData, t2: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" /> Pressure P1 (bar)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.p1}
                      onChange={(e) => setFormData({ ...formData, p1: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" /> Pressure P2 (bar)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.p2}
                      onChange={(e) => setFormData({ ...formData, p2: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> Flow Rate (L/min)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.flowRate}
                    onChange={(e) => setFormData({ ...formData, flowRate: e.target.value })}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Add any observations or notes..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Logs Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">T1/T2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">P1/P2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Flow</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Operator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">{log.equipmentType}</p>
                        <p className="text-xs text-muted-foreground font-mono">{log.equipmentId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">{log.t1}°C / {log.t2}°C</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">{log.p1} / {log.p2} bar</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">{log.flowRate} L/min</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{log.operator}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{format(log.timestamp, 'dd/MM HH:mm')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={log.status === 'approved' ? 'success' : log.status === 'rejected' ? 'danger' : 'pending'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
