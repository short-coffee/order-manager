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

export const SUGAR_OPTIONS = [
    { id: 'none', label: 'ΣΚΕΤΟ' },
    { id: 'medium', label: 'ΜΕΤΡΙΟ' },
    { id: 'sweet', label: 'ΓΛΥΚΟ' },
    { id: 'little', label: 'ΜΕ ΟΛΙΓΗ' },
    { id: 'saccharin', label: 'ΖΑΧΑΡΙΝΗ' },
    { id: 'stevia', label: 'ΣΤΕΒΙΑ' },
    { id: 'brown', label: 'ΜΑΥΡΗ ΖΑΧΑΡΗ' }
];

export const TEMP_OPTIONS = [
    { id: 'hot', label: 'ΖΕΣΤΗ' },
    { id: 'cold', label: 'ΚΡΥΑ' }
];

export const FLAVOR_OPTIONS = [
    { id: 'caramel', label: 'ΚΑΡΑΜΕΛΑ' },
    { id: 'strawberry', label: 'ΦΡΑΟΥΛΑ' },
    { id: 'hazelnut', label: 'ΦΟΥΝΤΟΥΚΙ' },
    { id: 'vanilla', label: 'ΒΑΝΙΛΙΑ' },
    { id: 'coconut', label: 'ΚΑΡΥΔΑ' }
];

export const SMOOTHIE_FLAVOR_OPTIONS = [
    { id: 'strawberry', label: 'ΦΡΑΟΥΛΑ' },
    { id: 'raspberry', label: 'ΒΑΤΟΜΟΥΡΟ' },
    { id: 'banana', label: 'ΜΠΑΝΑΝΑ' },
    { id: 'passion_fruit', label: 'PASSION FRUIT' },
    { id: 'lime', label: 'LIME' }
];

export const MILKSHAKE_FLAVOR_OPTIONS = [
    { id: 'vanilla', label: 'ΒΑΝΙΛΙΑ' },
    { id: 'chocolate', label: 'ΣΟΚΟΛΑΤΑ' },
    { id: 'stracciatella', label: 'ΣΤΡΑΤΣΙΑΤΕΛΑ' },
    { id: 'amarena', label: 'ΑΜΑΡΕΝΑ' },
    { id: 'banoffee', label: 'ΜΠΑΝΟΦΙ' },
    { id: 'cookies', label: 'COOKIES' },
    { id: 'bueno', label: 'BUENO' }
];

export const HOT_TEA_FLAVOR_OPTIONS = [
    { id: 'jasmine', label: 'ΓΙΑΣΕΜΙ' },
    { id: 'mint', label: 'ΜΕΝΤΑ' },
    { id: 'lemon', label: 'ΛΕΜΟΝΙ' },
    { id: 'vanilla', label: 'ΒΑΝΙΛΙΑ' },
    { id: 'orange', label: 'ΠΟΡΤΟΚΑΛΙ' },
    { id: 'strawberry', label: 'ΦΡΑΟΥΛΑ' },
    { id: 'green', label: 'ΠΡΑΣΙΝΟ' },
    { id: 'cinnamon', label: 'ΚΑΝΕΛΑ' },
    { id: 'english_breakfast', label: 'ENGLISH BREAKFAST' }
];

export const ICE_TEA_FLAVOR_OPTIONS = [
    { id: 'peach', label: 'ΡΟΔΑΚΙΝΟ' },
    { id: 'lemon', label: 'ΛΕΜΟΝΙ' },
    { id: 'green', label: 'ΠΡΑΣΙΝΟ' },
    { id: 'green_sugar_free', label: 'ΠΡΑΣΙΝΟ ΧΩΡΙΣ ΖΑΧΑΡΗ' }
];

export const TOAST_OPTIONS = [
    { id: 'cheese_turkey', label: 'Τυρί - Γαλοπούλα' },
    { id: 'cheese_ham', label: 'Τυρί - Ζαμπόν' },
    { id: 'cheese', label: 'Σκέτο Τυρί' },
    { id: 'turkey', label: 'Σκέτη Γαλοπούλα' },
    { id: 'ham', label: 'Σκέτο Ζαμπόν' }
];

export const BAGUETTE_OPTIONS = [
    { id: 'baguette_turkey', label: 'Τυρί, Γαλοπούλα, Ντομάτα, Μαρούλι, Μαγιονέζα' },
    { id: 'baguette_ham', label: 'Τυρί, Ζαμπόν, Ντομάτα, Μαρούλι, Μαγιονέζα' }
];

export const BAGUETTE_INGREDIENTS = {
    baguette_turkey: ['Τυρί', 'Γαλοπούλα', 'Ντομάτα', 'Μαρούλι', 'Μαγιονέζα'],
    baguette_ham: ['Τυρί', 'Ζαμπόν', 'Ντομάτα', 'Μαρούλι', 'Μαγιονέζα']
};

export const checkIsCoffee = (product) => product.category === 'coffee' && product.id !== 'coffee18';
export const checkCanHaveDecaf = (product) => ['coffee06', 'coffee07', 'coffee08', 'coffee09', 'coffee13'].includes(product.id);
export const checkIsFlavoredCoffee = (product) => product.category === 'coffee' && product.id === 'coffee18';
export const checkIsFlavoredChocolate = (product) => product.category === 'chocolates' && product.id === 'chocolates09';
export const checkIsChocolate = (product) => product.id === 'chocolates01' || product.id === 'chocolates02';
export const checkIsSmoothieOrGranita = (product) => product.id === 'rofimata03' || product.id === 'rofimata04';
export const checkIsMilkshake = (product) => product.id === 'rofimata05';
export const checkIsHotTea = (product) => product.id === 'tea01';
export const checkIsIceTea = (product) => product.id === 'tea02';
export const checkIsIceCream = (product) => product.id === 'sweets01';
export const checkIsToast = (product) => product.id === 'snacks03';
export const checkIsBaguette = (product) => product.id === 'snacks01';

export const needsCustomization = (product) => {
    return checkIsCoffee(product) ||
        checkIsFlavoredCoffee(product) ||
        checkIsFlavoredChocolate(product) ||
        checkIsChocolate(product) ||
        checkIsSmoothieOrGranita(product) ||
        checkIsMilkshake(product) ||
        checkIsHotTea(product) ||
        checkIsIceTea(product) ||
        checkIsIceCream(product) ||
        checkIsToast(product) ||
        checkIsBaguette(product);
};

export const getOptionLabel = (type, value) => {
    if (!value) return null;

    switch (type) {
        case 'sugar':
            return SUGAR_OPTIONS.find(opt => opt.id === value)?.label || value;
        case 'temperature':
            return TEMP_OPTIONS.find(opt => opt.id === value)?.label || value;
        case 'flavor':
            // Check all possible flavor lists
            const allFlavors = [
                ...FLAVOR_OPTIONS,
                ...SMOOTHIE_FLAVOR_OPTIONS,
                ...MILKSHAKE_FLAVOR_OPTIONS,
                ...HOT_TEA_FLAVOR_OPTIONS,
                ...ICE_TEA_FLAVOR_OPTIONS,
                ...TOAST_OPTIONS,
                ...BAGUETTE_OPTIONS
            ];
            return allFlavors.find(opt => opt.id === value)?.label || value;
        case 'extraScoop':
            return MILKSHAKE_FLAVOR_OPTIONS.find(opt => opt.id === value)?.label || value;
        default:
            return value;
    }
};
