export const CATEGORY_MAPPING = {
    'coffee': 'Καφέδες',
    'chocolates': 'Σοκολάτες',
    'rofimata': 'Ροφήματα',
    'tea': 'Τσάι',
    'beverages': 'Αναψυκτικά/Νερά',
    'juice': 'Χυμοί',
    'snacks': 'Σνακ',
    'sweets': 'Γλυκά/Παγωτά',
    'donuts': 'Ντόνατς'
};

export const CATEGORY_ORDER = [
    'coffee',
    'chocolates',
    'rofimata',
    'tea',
    'beverages',
    'juice',
    'snacks',
    'sweets',
    'donuts'
];

export const STATUS_MAPPING = {
    pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
    preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
    ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
    delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
    delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' },
    archived: { label: 'ΑΡΧΕΙΟΘΕΤΗΜΕΝΗ', color: 'var(--text-muted)' }
};
