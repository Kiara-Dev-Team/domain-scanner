export enum RiskType {
  FINANCIAL = 'FINANCIAL',
  GOVERNANCE = 'GOVERNANCE',
  OPERATIONAL = 'OPERATIONAL',
}

export enum Priority {
  IMMEDIATE = 'IMMEDIATE',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ScanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Action {
  description: string;
  owner: string;
  timeframe: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BusinessFinding {
  id: string;
  scanId: string;
  riskType: RiskType;
  priority: Priority;
  businessDescription: string;
  businessImpact: string[];
  actions: Action[];
  technical: {
    templateId: string;
    name: string;
    severity: string;
    description: string;
    host: string;
    matchedAt: string;
    tags: string[];
  };
  createdAt: string;
}

export interface Scan {
  id: string;
  targetDomain: string;
  status: ScanStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  findingsCount?: number;
  createdAt: string;
}

export interface ScanResult {
  scan: Scan;
  findings: BusinessFinding[];
  summary: {
    immediate: number;
    high: number;
    medium: number;
    low: number;
    byRiskType: {
      financial: number;
      governance: number;
      operational: number;
    };
  };
}
