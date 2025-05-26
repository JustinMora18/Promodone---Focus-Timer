let isExpanded = false;

const expandableBtn = document.getElementById('expandableBtn');
const expandablePanel = document.getElementById('expandablePanel');
const btn = document.getElementById('expandableBtn');
const icon = btn.querySelector('.material-symbols-outlined');

function togglePanel() {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        icon.textContent = 'expand_more';
        expandablePanel.classList.add('expanded');
        expandableBtn.classList.remove
        ('collapsed');
    } else {
        icon.textContent = 'expand_less';
        expandablePanel.classList.remove('expanded');
        expandableBtn.classList.add('collapsed');
    }
}

expandableBtn.addEventListener('click', togglePanel);