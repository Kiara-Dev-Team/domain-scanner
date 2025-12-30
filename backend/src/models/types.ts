export interface NucleiFinding {
  'template-id': string;
  info: {
    name: string;
    author: string;
    severity: string;
    description?: string;
    tags?: string[];
    reference?: string[];
  };
  type: string;
  host: string;
  'matched-at': string;
  'extracted-results'?: string[];
  'curl-command'?: string;
  'matcher-name'?: string;
  timestamp?: string;
}

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
  createdAt: Date;
}

export interface Action {
  description: string;
  owner: string;
  timeframe: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export enum ScanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Scan {
  id: string;
  targetDomain: string;
  status: ScanStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  findingsCount?: number;
  createdAt: Date;
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
