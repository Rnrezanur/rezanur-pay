// Map tab button IDs to target section IDs
const navigationMap = [
    { btnId: 'btn-add-money-tab', sectionId: 'add-money-section' },
    { btnId: 'btn-cashout-tab', sectionId: 'cashout-section' },
    { btnId: 'btn-transfer-tab', sectionId: 'transfer-section' },
    { btnId: 'btn-bonus-tab', sectionId: 'bonus-section' },
    { btnId: 'btn-paybill-tab', sectionId: 'paybill-section' },
    { btnId: 'btn-transactions-tab', sectionId: 'transactions-section' }
];

// Reusable activation function
function showSection(activeBtnId, activeSectionId) {
    // 1. Hide all form/list sections
    const allSections = document.querySelectorAll('.form-section');
    allSections.forEach(section => section.classList.add('hidden'));

    // 2. Show the targeted section
    const targetSection = document.getElementById(activeSectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // 3. Reset all buttons to standard inactive styling
    const allTabs = document.querySelectorAll('.btn-tab');
    allTabs.forEach(tab => {
        tab.className = "btn-tab btn flex-col h-full py-4 bg-white border border-gray-200 rounded-2xl";
        const label = tab.querySelector('span');
        if (label) {
            label.className = "text-xs font-semibold text-gray-600";
        }
    });

    // 4. Highlight the active button (light blue bg + blue-500 border + blue text)
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.className = "btn-tab btn flex-col h-full py-4 bg-blue-50 border-2 border-blue-500 rounded-2xl";
        const activeLabel = activeBtn.querySelector('span');
        if (activeLabel) {
            activeLabel.className = "text-xs font-semibold text-blue-600";
        }
    }
}

// Attach click listeners to all tabs
navigationMap.forEach(item => {
    const btn = document.getElementById(item.btnId);
    if (btn) {
        btn.addEventListener('click', function () {
            showSection(item.btnId, item.sectionId);
        });
    }
});