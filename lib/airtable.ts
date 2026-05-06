import Airtable from 'airtable';
import type { LeadData } from '@/types';

// Using table ID and field IDs — immune to rename changes in Airtable UI
const TABLE_ID = 'tblDLAATbd5RDe0Vk';

const FIELDS = {
  name:      'fldRW51KdkPJtUj9C',
  phone:     'fldXdNHkKJcJzqtrp',
  service:   'fld7vzb7FoUSl5b3s',
  zipCode:   'fldrZ9erzLhUhCDIM',
  timestamp: 'fldV1RtaY4ag5tGcK',
} as const;

function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) throw new Error('Airtable credentials are not configured.');
  return new Airtable({ apiKey }).base(baseId);
}

export async function saveLead(lead: LeadData): Promise<void> {
  await getBase()(TABLE_ID).create([
    {
      fields: {
        [FIELDS.name]:      lead.name,
        [FIELDS.phone]:     lead.phone,
        [FIELDS.service]:   lead.service,
        [FIELDS.zipCode]:   lead.zipCode,
        [FIELDS.timestamp]: lead.timestamp,  // ISO 8601 — matches Airtable Date/time field
      },
    },
  ]);
}
