import { NucleiFinding, BusinessFinding, RiskType, Priority, Action } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Translation Engine - Core business logic for converting technical findings
 * to business-contextualized risks
 */
export class TranslationEngine {
  /**
   * Translate NUCLEI findings to business findings
   */
  static translateFindings(scanId: string, nucleiFindings: NucleiFinding[]): BusinessFinding[] {
    return nucleiFindings.map(finding => this.translateFinding(scanId, finding));
  }

  /**
   * Translate a single NUCLEI finding to business context
   */
  private static translateFinding(scanId: string, finding: NucleiFinding): BusinessFinding {
    const riskType = this.classifyRiskType(finding);
    const priority = this.determinePriority(finding);
    const businessDescription = this.generateBusinessDescription(finding);
    const businessImpact = this.identifyBusinessImpact(finding, riskType);
    const actions = this.generateActions(finding, priority);

    return {
      id: uuidv4(),
      scanId,
      riskType,
      priority,
      businessDescription,
      businessImpact,
      actions,
      technical: {
        templateId: finding['template-id'],
        name: finding.info.name,
        severity: finding.info.severity,
        description: finding.info.description || '',
        host: finding.host,
        matchedAt: finding['matched-at'],
        tags: finding.info.tags || [],
      },
      createdAt: new Date(),
    };
  }

  /**
   * Classify finding into business risk type
   */
  private static classifyRiskType(finding: NucleiFinding): RiskType {
    const tags = finding.info.tags || [];
    const name = finding.info.name.toLowerCase();
    const templateId = finding['template-id'].toLowerCase();

    // Financial risk indicators
    if (
      tags.some(t => ['payment', 'ecommerce', 'financial'].includes(t.toLowerCase())) ||
      name.includes('payment') ||
      name.includes('card') ||
      name.includes('transaction')
    ) {
      return RiskType.FINANCIAL;
    }

    // Governance risk indicators
    if (
      tags.some(t => ['compliance', 'gdpr', 'pci', 'hipaa', 'encryption'].includes(t.toLowerCase())) ||
      name.includes('encryption') ||
      name.includes('tls') ||
      name.includes('ssl') ||
      name.includes('certificate') ||
      name.includes('privacy') ||
      name.includes('data leak')
    ) {
      return RiskType.GOVERNANCE;
    }

    // Default to operational risk
    return RiskType.OPERATIONAL;
  }

  /**
   * Determine business priority based on severity and context
   */
  private static determinePriority(finding: NucleiFinding): Priority {
    const severity = finding.info.severity.toLowerCase();
    const tags = finding.info.tags || [];

    // Critical severity or exposed credentials = IMMEDIATE
    if (
      severity === 'critical' ||
      tags.some(t => ['rce', 'sqli', 'xxe', 'ssti'].includes(t.toLowerCase())) ||
      finding.info.name.toLowerCase().includes('exposed') && finding.info.name.toLowerCase().includes('credential')
    ) {
      return Priority.IMMEDIATE;
    }

    // High severity = HIGH priority
    if (severity === 'high') {
      return Priority.HIGH;
    }

    // Medium severity = MEDIUM priority
    if (severity === 'medium') {
      return Priority.MEDIUM;
    }

    // Low/Info = LOW priority
    return Priority.LOW;
  }

  /**
   * Generate business-friendly description
   */
  private static generateBusinessDescription(finding: NucleiFinding): string {
    const severity = finding.info.severity.toLowerCase();
    const name = finding.info.name;
    const tags = finding.info.tags || [];

    // Map technical terms to business language
    if (tags.includes('rce') || name.toLowerCase().includes('remote code execution')) {
      return 'Server compromise possible. Attackers could take full control of the system, leading to service disruption and data theft.';
    }

    if (tags.includes('sqli') || name.toLowerCase().includes('sql injection')) {
      return 'Database breach risk detected. Sensitive data including customer information could be accessed or stolen.';
    }

    if (tags.includes('xss') || name.toLowerCase().includes('cross-site scripting')) {
      return 'User account takeover risk. Attackers could impersonate legitimate users and access their data.';
    }

    if (name.toLowerCase().includes('exposed') && name.toLowerCase().includes('.git')) {
      return 'Source code exposure detected. This reveals your application logic and could enable targeted attacks.';
    }

    if (name.toLowerCase().includes('tls') || name.toLowerCase().includes('ssl')) {
      return 'Outdated encryption detected. Customer data transmission does not meet current security standards.';
    }

    if (name.toLowerCase().includes('exposed') || name.toLowerCase().includes('disclosure')) {
      return 'Sensitive information is publicly accessible. This could be exploited for targeted attacks.';
    }

    // Generic business description based on severity
    if (severity === 'critical' || severity === 'high') {
      return `Security issue detected: ${name}. This presents a significant risk to your systems and data.`;
    }

    return `Security configuration issue: ${name}. This should be addressed to maintain security best practices.`;
  }

  /**
   * Identify business impact areas
   */
  private static identifyBusinessImpact(finding: NucleiFinding, riskType: RiskType): string[] {
    const impacts: string[] = [];
    const severity = finding.info.severity.toLowerCase();

    switch (riskType) {
      case RiskType.FINANCIAL:
        impacts.push('Revenue processing at risk');
        if (severity === 'critical' || severity === 'high') {
          impacts.push('Potential financial loss from fraud or service disruption');
        }
        impacts.push('Payment compliance requirements may be violated');
        break;

      case RiskType.GOVERNANCE:
        impacts.push('Compliance requirements may be violated');
        impacts.push('Customer data privacy at risk');
        if (severity === 'critical' || severity === 'high') {
          impacts.push('Regulatory penalties possible');
        }
        break;

      case RiskType.OPERATIONAL:
        impacts.push('Service availability could be affected');
        if (severity === 'critical' || severity === 'high') {
          impacts.push('System compromise possible');
          impacts.push('Business continuity at risk');
        }
        break;
    }

    return impacts;
  }

  /**
   * Generate actionable recommendations
   */
  private static generateActions(finding: NucleiFinding, priority: Priority): Action[] {
    const actions: Action[] = [];
    const name = finding.info.name.toLowerCase();
    const tags = finding.info.tags || [];

    // Determine timeframe based on priority
    const timeframe = {
      [Priority.IMMEDIATE]: '24 hours',
      [Priority.HIGH]: 'This week',
      [Priority.MEDIUM]: 'This month',
      [Priority.LOW]: 'Next quarter',
    }[priority];

    // Generate specific actions based on finding type
    if (tags.includes('rce') || name.includes('remote code execution')) {
      actions.push({
        description: 'Apply security patch immediately',
        owner: 'IT Operations',
        timeframe,
        complexity: 'MEDIUM',
      });
      actions.push({
        description: 'Verify patch with security team',
        owner: 'Security Team',
        timeframe,
        complexity: 'LOW',
      });
    } else if (tags.includes('sqli') || name.includes('sql injection')) {
      actions.push({
        description: 'Update application code to use parameterized queries',
        owner: 'Development Team',
        timeframe,
        complexity: 'MEDIUM',
      });
      actions.push({
        description: 'Conduct security code review',
        owner: 'Security Team',
        timeframe,
        complexity: 'LOW',
      });
    } else if (name.includes('exposed') && name.includes('.git')) {
      actions.push({
        description: 'Remove .git directory from web server immediately',
        owner: 'IT Operations',
        timeframe: '24 hours',
        complexity: 'LOW',
      });
    } else if (name.includes('tls') || name.includes('ssl')) {
      actions.push({
        description: 'Upgrade to TLS 1.2 or higher',
        owner: 'IT Operations',
        timeframe,
        complexity: 'MEDIUM',
      });
      actions.push({
        description: 'Document compliance remediation',
        owner: 'Compliance Team',
        timeframe,
        complexity: 'LOW',
      });
    } else {
      // Generic action
      actions.push({
        description: 'Review and remediate security finding',
        owner: 'Security Team',
        timeframe,
        complexity: 'MEDIUM',
      });
    }

    return actions;
  }
}
