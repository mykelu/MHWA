import { ConsentFormData, ConsentRecord } from '../../types/consent';
import { EventEmitter } from '../../utils/eventEmitter';

// Real-time event emitter for consent updates
export const consentEvents = new EventEmitter();

// Simulated database
const consentRecords = new Map<string, ConsentRecord>();

export async function submitConsent(userId: string, formData: ConsentFormData): Promise<ConsentRecord> {
  const record: ConsentRecord = {
    id: crypto.randomUUID(),
    userId,
    guardianId: crypto.randomUUID(),
    consentData: formData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };

  consentRecords.set(record.id, record);
  
  // Emit real-time event
  consentEvents.emit('consentSubmitted', record);
  
  // Simulate sending email/SMS to guardian
  await notifyGuardian(record);
  
  return record;
}

export async function getConsentStatus(userId: string): Promise<ConsentRecord | null> {
  const records = Array.from(consentRecords.values())
    .filter(record => record.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return records[0] || null;
}

export async function updateConsentStatus(
  consentId: string,
  status: 'approved' | 'rejected'
): Promise<ConsentRecord> {
  const record = consentRecords.get(consentId);
  if (!record) {
    throw new Error('Consent record not found');
  }

  const updatedRecord = {
    ...record,
    status,
    updatedAt: new Date().toISOString(),
  };

  consentRecords.set(consentId, updatedRecord);
  
  // Emit real-time event
  consentEvents.emit('consentUpdated', updatedRecord);
  
  return updatedRecord;
}

export async function getAllConsents(
  filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    fromDate?: string;
    toDate?: string;
  }
): Promise<ConsentRecord[]> {
  let records = Array.from(consentRecords.values());

  if (filters) {
    if (filters.status) {
      records = records.filter(record => record.status === filters.status);
    }
    if (filters.fromDate) {
      records = records.filter(record => record.createdAt >= filters.fromDate!);
    }
    if (filters.toDate) {
      records = records.filter(record => record.createdAt <= filters.toDate!);
    }
  }

  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function notifyGuardian(record: ConsentRecord): Promise<void> {
  // Simulate sending email
  console.log('Sending email to guardian:', {
    to: record.consentData.guardianEmail,
    subject: 'Consent Request for Minor',
    body: `Dear ${record.consentData.guardianName},\n\nA consent request has been submitted for ${record.consentData.minorName}. Please review and approve/reject this request.`,
  });

  // Simulate sending SMS
  if (record.consentData.guardianPhone) {
    console.log('Sending SMS to guardian:', {
      to: record.consentData.guardianPhone,
      message: `Consent request submitted for ${record.consentData.minorName}. Please check your email for details.`,
    });
  }
}