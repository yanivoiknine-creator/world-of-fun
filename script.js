// ===== Background Decorations =====
function createDecorations() {
    const container = document.getElementById('bgDecorations');
    container.innerHTML = '';
    const count = 24;

    for (let i = 0; i < count; i++) {
        const isCherry = i % 2 === 0;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 55 + Math.random() * 45;
        const rotation = Math.random() * 360;
        const opacity = 0.09 + Math.random() * 0.08;

        const el = document.createElement('div');
        el.className = 'bg-deco ' + (isCherry ? 'bg-cherry' : 'bg-bow');
        el.style.cssText = 'left:' + x + '%;top:' + y + '%;width:' + size + 'px;height:' + size + 'px;opacity:' + opacity + ';transform:rotate(' + rotation + 'deg)';

        if (isCherry) {
            el.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="14" cy="28" r="9"/><circle cx="28" cy="24" r="9"/><path d="M14,19 Q18,5 22,8 Q26,5 28,15" stroke-width="2.5"/></svg>';
        } else {
            el.innerHTML = '<svg viewBox="0 0 40 30"><path class="bow-wing" d="M20,15 Q5,3 5,15 Q5,27 20,15"/><path class="bow-wing" d="M20,15 Q35,3 35,15 Q35,27 20,15"/><circle class="bow-center" cx="20" cy="15" r="4"/></svg>';
        }

        container.appendChild(el);
    }
}

createDecorations();

// ===== Theme Switching =====
const themeBtns = document.querySelectorAll('.theme-btn');

// Load saved theme or use default
const savedTheme = localStorage.getItem('selectedTheme') || 'theme-purple-pink';
document.body.className = savedTheme;
updateActiveThemeBtn(savedTheme);

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.className = theme;
        localStorage.setItem('selectedTheme', theme);
        updateActiveThemeBtn(theme);
    });
});

function updateActiveThemeBtn(theme) {
    themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// ===== Category Filtering & Search =====
const categoryBtns = document.querySelectorAll('.category-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const noResults = document.getElementById('noResults');

let activeCategory = 'all';

function filterGallery() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    galleryItems.forEach(item => {
        const title = (item.querySelector('.item-title')?.textContent || '').toLowerCase();
        const category = item.dataset.category;
        const categoryName = (item.querySelector('.item-category')?.textContent || '').toLowerCase();

        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesSearch = !query || title.includes(query) || categoryName.includes(query);

        if (matchesCategory && matchesSearch) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    noResults.classList.toggle('visible', visibleCount === 0);
    searchClear.classList.toggle('visible', query.length > 0);
}

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery();
    });
});

searchInput.addEventListener('input', filterGallery);

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    filterGallery();
    searchInput.focus();
});

// ===== Image Modal =====
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalToast = document.getElementById('modalToast');

// Open modal when clicking on gallery item
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Show toast message
function showToast(message) {
    modalToast.textContent = message;
    modalToast.classList.add('show');
    setTimeout(() => modalToast.classList.remove('show'), 2000);
}

// ===== Copy Image =====
document.getElementById('btnCopy').addEventListener('click', async () => {
    try {
        const response = await fetch(modalImage.src);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
        showToast('התמונה הועתקה! 📋');
    } catch (err) {
        // Fallback: copy URL
        try {
            await navigator.clipboard.writeText(modalImage.src);
            showToast('הקישור הועתק! 📋');
        } catch {
            showToast('לא הצלחתי להעתיק 😢');
        }
    }
});

// ===== Download Image =====
document.getElementById('btnDownload').addEventListener('click', async () => {
    try {
        const response = await fetch(modalImage.src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = modalImage.alt || 'image';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('התמונה ירדה בהצלחה! ⬇️');
    } catch {
        showToast('לא הצלחתי להוריד 😢');
    }
});

// ===== Print Image =====
document.getElementById('btnPrint').addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>הדפסת תמונה - עולם של תמונות</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    background: white;
                }
                img {
                    max-width: 100%;
                    max-height: 100vh;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            <img src="${modalImage.src}" alt="${modalImage.alt}">
            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
    showToast('נשלח להדפסה! 🖨️');
});
