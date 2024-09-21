export interface Quote {
  // ... (other fields)
  status: 'draft' | 'sent' | 'accepted' | 'paid' | 'completed';
  // ... (other fields)
}