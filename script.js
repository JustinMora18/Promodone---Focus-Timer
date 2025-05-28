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

document.querySelectorAll('.inpt1, .inpt2').forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
if (input.value.length > 2) input.value = input.value.slice(0, 2);
    });
});   

function initZIndexManager() {
    const blurBox = document.querySelectorAll('.blur-box');
    let zIsExpanded = false;

    function updateZIndex() {
        if (zIsExpanded) {
            blurBox.forEach(element => {
                element.style.zIndex = '1';
            });
            if (expandablePanel) {
                expandablePanel.style.zIndex = '1000';
            }
        } 
        else {
            if (expandablePanel) {
            expandablePanel.style.zIndex = '1000';
            }
            setTimeout(() => {
                blurBox.forEach(element => {
                    element.style.zIndex = '999';
                });
                if (expandablePanel) {
                    expandablePanel.style.zIndex = '1';
                }
            }, 300);
        }
    }
    if (expandableBtn) {
        expandableBtn.addEventListener('click', function() {
            setTimeout(() => {
                zIsExpanded = expandablePanel.classList.contains('expanded');
                updateZIndex();
            }, 10);
        });
    }
    updateZIndex();
}
document.addEventListener('DOMContentLoaded', initZIndexManager);