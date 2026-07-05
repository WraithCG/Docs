document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SIDEBAR TOGGLE LOGIC (Mobile)
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    function toggleSidebar() {
        mobileSidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    }

    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);


    // ==========================================
    // THEME SWITCHING LOGIC (With LocalStorage)
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const themeBtnMobile = document.getElementById('theme-btn-mobile');
    const tooltipDesktop = document.getElementById('theme-tooltip');
    const tooltipMobile = document.getElementById('theme-tooltip-mobile');
    
    const themes = [
        { class: 'theme-dark-orange', name: 'Dark Orange' },
        { class: 'theme-light-orange', name: 'Light Orange' },
        { class: 'theme-dark-blue', name: 'Dark Blue' },
        { class: 'theme-light-blue', name: 'Light Blue' },
        { class: 'theme-cosmic', name: 'Cosmic Purple' },
        { class: 'theme-cyberpunk', name: 'Cyberpunk' },
        { class: 'theme-royal', name: 'Royal Gold' },
        { class: 'theme-metal', name: 'Metal Green' },
        { class: 'theme-hc-gold', name: 'High Contrast Gold' }
    ];
    
    let currentThemeIndex = 8;
    
    // Load Saved Theme
    const savedTheme = localStorage.getItem('wraithcg_theme_idx');
    if (savedTheme !== null) {
        currentThemeIndex = parseInt(savedTheme, 10);
        if (currentThemeIndex >= themes.length || currentThemeIndex < 0) {
            currentThemeIndex = 8;
        }
    }
    
    // Apply theme immediately
    document.body.className = themes[currentThemeIndex].class;
    if(tooltipDesktop) tooltipDesktop.textContent = themes[currentThemeIndex].name;
    if(tooltipMobile) tooltipMobile.textContent = themes[currentThemeIndex].name;

    // Theme Cycling Function
    function cycleTheme() {
        document.body.classList.remove(themes[currentThemeIndex].class);
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        document.body.classList.add(newTheme.class);
        
        localStorage.setItem('wraithcg_theme_idx', currentThemeIndex);
        
        const triggerTooltip = (el) => {
            if(!el) return;
            el.textContent = newTheme.name;
            el.classList.add('show');
            clearTimeout(el.timeout);
            el.timeout = setTimeout(() => el.classList.remove('show'), 1500);
        };
        triggerTooltip(tooltipDesktop);
        triggerTooltip(tooltipMobile);
    }
    
    if(themeBtn) themeBtn.addEventListener('click', cycleTheme);
    if(themeBtnMobile) themeBtnMobile.addEventListener('click', cycleTheme);


    // ==========================================
    // VIEW TOGGLE LOGIC (Grid vs List)
    // ==========================================
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    const projectGridContainer = document.getElementById('project-grid');

    // Load saved view preference
    const savedView = localStorage.getItem('wraithcg_view_pref') || 'list';
    if (savedView === 'list') {
        projectGridContainer.classList.add('list-view');
        if(listBtn) listBtn.classList.add('active');
        if(gridBtn) gridBtn.classList.remove('active');
    }

    if(gridBtn) {
        gridBtn.addEventListener('click', () => {
            projectGridContainer.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            localStorage.setItem('wraithcg_view_pref', 'grid');
        });
    }

    if(listBtn) {
        listBtn.addEventListener('click', () => {
            projectGridContainer.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            localStorage.setItem('wraithcg_view_pref', 'list');
        });
    }

    // ==========================================
    // FETCH PROJECTS JSON & BUILD GRID
    // ==========================================
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(projects => {
            projectGridContainer.innerHTML = ''; // Clear fallback content
            
            projects.forEach(project => {
                // Changed from 'a' to 'div' to support multiple anchor buttons inside
                const card = document.createElement('div');
                card.className = 'project-card';
                
                card.innerHTML = `
                    <div class="card-image-wrap">
                        <img src="${project.image}" class="card-image" alt="${project.title}">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${project.title}</h3>
                        <p class="card-desc">${project.description}</p>
                        
                        <!-- New Buttons Container -->
                        <div class="card-buttons">
                            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="card-link-wrapper">
                                <div class="card-link-content">
                                    <span>View Project</span>
                                    <i class="ph ph-arrow-up-right"></i>
                                </div>
                            </a>
                            
                            <!-- Assuming you add a "docLink" to your JSON. Fallback is '#' -->
                            <a href="${project.docLink || '#'}" target="_blank" rel="noopener noreferrer" class="card-link-wrapper">
                                <div class="card-link-content">
                                    <span>Read Docs</span>
                                    <i class="ph ph-book-open-text"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
                
                projectGridContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error loading projects.json:", err);
            projectGridContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); width: 100%; grid-column: 1 / -1;">
                    <p>Failed to load projects. Make sure projects.json exists and you are running on a local server.</p>
                </div>
            `;
        });
});