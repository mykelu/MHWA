import { ConsentFormData, ConsentRecord } from '../types/consent';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated consent records storage
const mockConsentRecords: Map<string, ConsentRecord> = new Map();

export async function submitConsentForm(userId: string, formData: ConsentFormData): Promise<ConsentRecord> {
  await delay(500);

  const consentRecord: ConsentRecord = {
    id: crypto.randomUUID(),
    userId,
    guardianId: crypto.randomUUID(), // In a real app, this would be linked to a guardian account
    consentData: formData,
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year expiration
  };

  mockConsentRecords.set(consentRecord.id, consentRecord);
  return consentRecord;
}

export async function getConsentRecord(userId: string): Promise<ConsentRecord | null> {
  await delay(500);
  
  // Find the latest consent record for the user
  const userConsents = Array.from(mockConsentRecords.values())
    .filter(record => record.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return userConsents[0] || null;
}

export async function verifyConsent(userId: string): Promise<boolean> {
  const record = await getConsentRecord(userId);
  
  if (!record) {
    return false;
  }

  const now = new Date();
  const expiresAt = new Date(record.expiresAt);
  
  return record.status === 'approved' && now < expiresAt;
}