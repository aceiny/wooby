export interface BankConfig {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  icon: string;
  country: string;
}

export const BANKS: Record<string, BankConfig> = {
  revolut: {
    slug: 'revolut',
    name: 'Revolut',
    shortName: 'Revolut',
    description: 'Digital banking and financial services',
    color: '#0075EB',
    bgColor: '#EBF5FF',
    darkBgColor: '#0C2340',
    icon: '🔵',
    country: 'UK',
  },
  'bnp-paribas': {
    slug: 'bnp-paribas',
    name: 'BNP Paribas',
    shortName: 'BNP',
    description: 'French international banking group',
    color: '#009A44',
    bgColor: '#E6F7EE',
    darkBgColor: '#0A2E1A',
    icon: '🟢',
    country: 'France',
  },
};

export const SUPPORTED_BANKS = Object.values(BANKS);

export function getBankConfig(slug?: string): BankConfig | undefined {
  if (!slug) return undefined;
  return BANKS[slug];
}
