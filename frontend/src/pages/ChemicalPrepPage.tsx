import React, { useState, useEffect } from 'react';
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
import { Plus, Beaker, Calculator, Save, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ChemicalPrep {
  id: string;
  chemicalName: string;
  equipmentId: string;
  concentration: number;
  waterVolume: number;
  chemicalQuantity: number;
  operator: string;
  timestamp: Date;
  remarks: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockPreps: ChemicalPrep[] = [
  { id: '1', chemicalName: 'Sodium Hydroxide (NaOH)', equipmentId: 'RE0001', concentration: 5, waterVolume: 100, chemicalQuantity: 5.26, operator: 'James Wilson', timestamp: new Date(Date.now() - 1000 * 60 * 45), remarks: 'For CIP cycle', status: 'approved' },
  { id: '2', chemicalName: 'Hydrochloric Acid (HCl)', equipmentId: 'RE0002', concentration: 2, waterVolume: 50, chemicalQuantity: 1.02, operator: 'James Wilson', timestamp: new Date(Date.now() - 1000 * 60 * 120), remarks: '', status: 'pending' },
];

const chemicals = [
  { name: 'Sodium Hydroxide (NaOH)', stockConcentration: 98, formula: 'NaOH' },
  { name: 'Hydrochloric Acid (HCl)', stockConcentration: 37, formula: 'HCl' },
  { name: 'Sulfuric Acid (H2SO4)', stockConcentration: 98, formula: 'H2SO4' },
  { name: 'Nitric Acid (HNO3)', stockConcentration: 70, formula: 'HNO3' },
  { name: 'Phosphoric Acid (H3PO4)', stockConcentration: 85, formula: 'H3PO4' },
];

const equipmentIds = ['RE0001', 'RE0002', 'RE0003', 'RE0004', 'RE0005'];

export default function ChemicalPrepPage() {
  const { user } = useAuth();
  const [preps, setPreps] = useState<ChemicalPrep[]>(mockPreps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    chemicalName: '',
    equipmentId: '',
    targetConcentration: '',
    waterVolume: '',
    remarks: '',
  });
  const [calculatedQuantity, setCalculatedQuantity] = useState<number | null>(null);

  // Auto-calculate chemical quantity when inputs change
  useEffect(() => {
    if (formData.chemicalName && formData.targetConcentration && formData.waterVolume) {
      const chemical = chemicals.find(c => c.name === formData.chemicalName);
      if (chemical) {
        const targetConc = parseFloat(formData.targetConcentration);
        const waterVol = parseFloat(formData.waterVolume);
        const stockConc = chemical.stockConcentration;

        // Formula: V1 = (C2 * V2) / C1
        // Where C1 = stock concentration, C2 = target concentration, V2 = final volume
        const chemicalQty = (targetConc * waterVol) / stockConc;
        setCalculatedQuantity(Math.round(chemicalQty * 100) / 100);
      }
    } else {
      setCalculatedQuantity(null);
    }
  }, [formData.chemicalName, formData.targetConcentration, formData.waterVolume]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!calculatedQuantity) return;

    const newPrep: ChemicalPrep = {
      id: Date.now().toString(),
      chemicalName: formData.chemicalName,
      equipmentId: formData.equipmentId,
      concentration: parseFloat(formData.targetConcentration),
      waterVolume: parseFloat(formData.waterVolume),
      chemicalQuantity: calculatedQuantity,
      operator: user?.name || 'Unknown',
      timestamp: new Date(),
      remarks: formData.remarks,
      status: 'pending',
    };

    setPreps([newPrep, ...preps]);
    setIsDialogOpen(false);
    setFormData({
      chemicalName: '',
      equipmentId: '',
      targetConcentration: '',
      waterVolume: '',
      remarks: '',
    });
    setCalculatedQuantity(null);
    toast.success('Chemical preparation logged successfully');
  };

  const selectedChemical = chemicals.find(c => c.name === formData.chemicalName);

  return (
    <div className="min-h-screen">
      <Header
        title="Chemical Preparation"
        subtitle="Mixing calculations and preparation logs"
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="pending">{preps.filter(p => p.status === 'pending').length} Pending</Badge>
            <Badge variant="success">{preps.filter(p => p.status === 'approved').length} Approved</Badge>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                New Preparation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5" />
                  Chemical Preparation Form
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Digital Signature Info */}
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{format(new Date(), 'PPpp')}</p>
                    <p className="text-xs text-muted-foreground">Prepared by: {user?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chemical</Label>
                    <Select
                      value={formData.chemicalName}
                      onValueChange={(v) => setFormData({ ...formData, chemicalName: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chemical" />
                      </SelectTrigger>
                      <SelectContent>
                        {chemicals.map((chem) => (
                          <SelectItem key={chem.name} value={chem.name}>
                            {chem.formula} ({chem.stockConcentration}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Equipment ID</Label>
                    <Select
                      value={formData.equipmentId}
                      onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentIds.map((id) => (
                          <SelectItem key={id} value={id}>{id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedChemical && (
                  <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                    <p className="text-sm text-accent font-medium">
                      Stock Concentration: {selectedChemical.stockConcentration}%
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Concentration (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      value={formData.targetConcentration}
                      onChange={(e) => setFormData({ ...formData, targetConcentration: e.target.value })}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Water Volume (L)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.waterVolume}
                      onChange={(e) => setFormData({ ...formData, waterVolume: e.target.value })}
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                {/* Auto-calculated Result */}
                <div className={`rounded-lg p-4 border-2 ${calculatedQuantity ? 'bg-success/10 border-success/30' : 'bg-muted/50 border-border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-foreground">Calculated Chemical Quantity</span>
                  </div>
                  {calculatedQuantity ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono text-success">{calculatedQuantity}</span>
                      <span className="text-lg text-muted-foreground">Liters</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Fill in all fields to calculate
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Purpose, batch number, or other notes..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" disabled={!calculatedQuantity}>
                    <Save className="w-4 h-4 mr-2" />
                    Log Preparation
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Preparations Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Chemical</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Conc.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Water Vol.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Chemical Qty.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prepared By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preps.map((prep) => (
                  <tr key={prep.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{prep.chemicalName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-muted-foreground">{prep.equipmentId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">{prep.concentration}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">{prep.waterVolume} L</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-bold text-accent">{prep.chemicalQuantity} L</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{prep.operator}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{format(prep.timestamp, 'dd/MM HH:mm')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={prep.status === 'approved' ? 'success' : prep.status === 'rejected' ? 'danger' : 'pending'}>
                        {prep.status}
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
