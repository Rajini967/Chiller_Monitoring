import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Gauge, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  type: 'chiller' | 'boiler' | 'compressor';
  status: 'running' | 'idle' | 'alert';
  t1: number;
  t2: number;
  p1: number;
  p2: number;
}

const mockEquipment: Equipment[] = [
  { id: 'CH-001', name: 'Chiller Unit 1', type: 'chiller', status: 'running', t1: 7.2, t2: 12.5, p1: 2.4, p2: 1.8 },
  { id: 'CH-002', name: 'Chiller Unit 2', type: 'chiller', status: 'running', t1: 6.8, t2: 11.9, p1: 2.5, p2: 1.9 },
  { id: 'BL-001', name: 'Boiler Unit 1', type: 'boiler', status: 'alert', t1: 185.0, t2: 92.0, p1: 8.5, p2: 7.2 },
  { id: 'AC-001', name: 'Compressor 1', type: 'compressor', status: 'running', t1: 45.0, t2: 38.0, p1: 7.0, p2: 6.5 },
  { id: 'AC-002', name: 'Compressor 2', type: 'compressor', status: 'idle', t1: 28.0, t2: 26.0, p1: 0.0, p2: 0.0 },
];

const statusConfig = {
  running: { variant: 'success' as const, label: 'Running' },
  idle: { variant: 'secondary' as const, label: 'Idle' },
  alert: { variant: 'danger' as const, label: 'Alert' },
};

export function EquipmentStatus() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Equipment Status</h3>
      <div className="space-y-3">
        {mockEquipment.map((eq) => (
          <div
            key={eq.id}
            className={cn(
              'p-4 rounded-lg border transition-all',
              eq.status === 'alert' ? 'border-danger/50 bg-danger/5' : 'border-border bg-muted/30'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-foreground">{eq.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{eq.id}</p>
              </div>
              <Badge variant={statusConfig[eq.status].variant}>
                <Activity className={cn(
                  'w-3 h-3 mr-1',
                  eq.status === 'running' && 'animate-pulse'
                )} />
                {statusConfig[eq.status].label}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">T1:</span>
                <span className="text-xs font-mono font-medium">{eq.t1}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">T2:</span>
                <span className="text-xs font-mono font-medium">{eq.t2}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">P1:</span>
                <span className="text-xs font-mono font-medium">{eq.p1} bar</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">P2:</span>
                <span className="text-xs font-mono font-medium">{eq.p2} bar</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
