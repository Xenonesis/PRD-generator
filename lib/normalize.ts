import { PRDData, FeatureItem, TimelinePhase, PaymentMilestone } from '@/types/prd';

/**
 * Coerce AI-returned JSON into the PRDData string contract.
 *
 * Groq responses are parsed from JSON, where fields typed `string` (e.g.
 * `projectCost`, `approvalFeedbackDays`, `percentage`, `duration`) can arrive
 * as numbers. The rest of the app calls `.trim()` / renders on those fields,
 * so any non-string value throws at runtime. This normalizer maps known
 * string-typed fields back to strings, leaving everything else untouched.
 */
const toStr = (v: unknown): string => (v == null ? '' : String(v));

const toStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(toStr) : [];

const toStringRecord = (v: unknown): Record<string, string> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  return Object.fromEntries(
    Object.entries(v).map(([k, val]) => [k, toStr(val)])
  );
};

const VALID_PRIORITIES = ['High', 'Medium', 'Low'] as const;

export const normalizePRD = (raw: Partial<PRDData>): PRDData => {
  const d = { ...raw } as PRDData;

  // Scalar string fields that AI JSON may emit as numbers.
  const scalarStrings: (keyof PRDData)[] = [
    'projectName',
    'clientName',
    'serviceProvider',
    'docVersion',
    'date',
    'currencySymbol',
    'projectCost',
    'estimatedTimeline',
    'coverBadge',
    'coverDocumentType',
    'coverSubtitle',
    'coverDescription',
    'projectDescription',
    'designRevisions',
    'devRevisions',
    'revisionPolicyNotes',
    'changeRequestPolicy',
    'qaProcess',
    'bugVsChangePolicy',
    'approvalFeedbackDays',
    'approvalNotes',
    'supportPeriod',
    'hostingDomainNotes',
    'ipOwnershipNotes',
    'confidentialityNotes',
    'contentResponsibilityNotes',
    'backupProvider',
    'backupFrequency',
    'backupRetention',
    'delayThresholdDays',
    'delayPolicyNotes',
    'cancellationPolicyNotes',
  ];
  for (const key of scalarStrings) {
    (d as unknown as Record<string, unknown>)[key] = toStr(
      (d as unknown as Record<string, unknown>)[key]
    );
  }

  // String arrays.
  const stringArrays: (keyof PRDData)[] = [
    'projectObjectives',
    'pages',
    'thirdPartyIntegrations',
    'securityPractices',
    'performanceOptimizations',
    'seoFeatures',
    'deliverables',
    'clientResponsibilities',
    'includedSupport',
    'notIncludedSupport',
    'limitations',
    'outOfScope',
    'finalHandoverItems',
  ];
  for (const key of stringArrays) {
    (d as unknown as Record<string, unknown>)[key] = toStringArray(
      (d as unknown as Record<string, unknown>)[key]
    );
  }

  // Nested string records.
  d.targetUsers = {
    ...d.targetUsers,
    ...toStringRecord(d.targetUsers),
  };
  d.userRoles = { ...d.userRoles, ...toStringRecord(d.userRoles) };
  d.userFlows = { ...d.userFlows, ...toStringRecord(d.userFlows) };
  d.design = {
    ...d.design,
    ...toStringRecord(d.design),
    clientAssets: d.design?.clientAssets ?? {},
  };
  d.techStack = { ...d.techStack, ...toStringRecord(d.techStack) };

  // Arrays of string-typed objects.
  d.timelinePhases = Array.isArray(d.timelinePhases)
    ? d.timelinePhases.map(
        (t: TimelinePhase): TimelinePhase => ({
          phase: toStr(t.phase),
          duration: toStr(t.duration),
        })
      )
    : ([] as TimelinePhase[]);

  d.paymentStructure = Array.isArray(d.paymentStructure)
    ? d.paymentStructure.map(
        (p: PaymentMilestone): PaymentMilestone => ({
          percentage: toStr(p.percentage),
          milestone: toStr(p.milestone),
          description: toStr(p.description),
        })
      )
    : ([] as PaymentMilestone[]);

  d.features = Array.isArray(d.features)
    ? d.features.map(
        (f: FeatureItem): FeatureItem => ({
          id: toStr(f.id),
          feature: toStr(f.feature),
          description: toStr(f.description),
          priority: VALID_PRIORITIES.includes(f.priority)
            ? f.priority
            : 'Medium',
        })
      )
    : ([] as FeatureItem[]);

  return d;
};
