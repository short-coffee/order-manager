export const CATEGORY_MAPPING = {
    'coffee': 'Καφέδες',
    'chocolate': 'Σοκολάτες',
    'tea': 'Τσάι',
    'snacks': 'Σνακ',
    'food': 'Φαγητό',
    'desserts': 'Γλυκά/Παγωτά',
    'ice-tea': 'Ice Tea',
    'granites': 'Γρανίτες',
    'smoothies': 'Smoothies',
    'soft-drinks': 'Αναψυκτικά',
    'beer': 'Μπύρες',
    'wine': 'Κρασιά',
    'drinks': 'Ποτά'
};

export const CATEGORY_ORDER = [
    'coffee',
    'chocolate',
    'tea',
    'ice-tea',
    'granites',
    'smoothies',
    'soft-drinks',
    'beer',
    'wine',
    'drinks',
    'snacks',
    'desserts',
    'food'
];

export const STATUS_MAPPING = {
    pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
    preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
    ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
    delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
    delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' },
    archived: { label: 'ΑΡΧΕΙΟΘΕΤΗΜΕΝΗ', color: 'var(--text-muted)' }
};
