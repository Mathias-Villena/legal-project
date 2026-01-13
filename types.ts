
export interface CustomClause {
  id: string;
  text: string;
}

export interface ContractData {
  landlordName: string;
  landlordDNI: string;
  landlordAddress: string;
  tenantName: string;
  tenantDNI: string;
  propertyAddress: string;
  propertyRef: string;
  monthlyRent: string;
  startDate: string;
  customClauses: CustomClause[];
}

export type ViewMode = 'editor' | 'payment';
