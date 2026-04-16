document.addEventListener('DOMContentLoaded', () => {
    // UI Assets Configuration
    const uiAssets = {
        '#btn-exit-view-mode img': 'assets/ui/back.webp',
        '#bg-switch-btn .tab-icon img': 'assets/ui/back_switch.webp',
        '#skin-back-btn img': 'assets/ui/back.webp',
        '#skin-view-btn img': 'assets/ui/eyeOn.webp',
        '#painter-toggle .icon img': 'assets/ui/painter.webp',
        '#cv-toggle .icon img': 'assets/ui/cv.webp',
        '#btn-download img': 'assets/ui/download.webp',
        '#btn-view-mode img': 'assets/ui/watch.webp',
        '#btn-fullscreen img': 'assets/ui/fullscreen.webp',
        '#mute-btn img': 'assets/ui/musicOff.webp',
        '.rarity img': 'assets/ui/star_6.webp'
    };
    
    // Initialize UI Icons
    Object.keys(uiAssets).forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.src = uiAssets[selector];
    });

    // Tab Icons Configuration
    const tabIcons = {
        'elite0': { default: 'assets/ui/jy_0.webp', active: 'assets/ui/jy0_blue.webp' },
        'elite2': { default: 'assets/ui/jy_2.webp', active: 'assets/ui/jy2_blue.webp' },
        'skin': { default: 'assets/ui/skin.webp', active: 'assets/ui/skin_blue.webp' }
    };

    const bgSwitchBtn = document.getElementById('bg-switch-btn');
    const bgPanel = document.getElementById('bg-panel');
    const closeBgPanelBtn = document.getElementById('close-bg-panel');
    const bgGrid = document.getElementById('bg-grid');
    const bgImg = document.querySelector('.bg-layer .bg-img');

    // List of background images available in assets/bj/
    const backgrounds = [
        'Bg_rhodes_day.webp',
        'Bg_rhodes_night.webp',
        'Bg_main_victoria.webp',
        'Bg_siesta.webp',
        'Bg_kazimierz.webp',
        'Bg_ursus.webp',
        'Bg_yan.webp',
        'Bg_iberia.webp',
        'Bg_anniversary.webp',
        'Bg_rogue_1.webp',
        'Bg_rogue_2.webp',
        'Bg_laterano.webp',
        'Bg_rhine.webp',
        'Bg_rogue_3.webp',
        'Bg_rhodes_flower.webp',
        'Bg_volcano_day.webp',
        'Bg_volcano_night.webp',
    ];
    // List of background music corresponding to backgrounds with loop points
    // loop_point: Time in seconds to jump back to (loop start)
    // loop_end: Time in seconds to jump from (optional, defaults to end of track)
    const bgMusicList = [        
        { file: 'm_sys_void_combine_2.mp3', loop_point: 34 },
        { file: 'm_sys_tech_combine.mp3', loop_point: 37.00937 },
        { file: 'm_avg_ghosthunter_combine.mp3', loop_point: 36.119 },
        { file: 'm_sys_ddd_combine.mp3', loop_point: 52 },
        { file: 'm_dia_street_combine.mp3', loop_point: 18.54549 },
        { file: 'm_avg_loneliness_combine.mp3', loop_point: 51.42859 },
        { file: 'm_sys_bitw_loop.mp3', loop_point: 0 },
        { file: 'm_sys_act18d3d0_combine.mp3', loop_point: 34.19 },
        { file: 'm_dia_nightoflongmen_combine.mp3', loop_point: 1.5 },
        { file: 'm_avg_rglk1secretevent_loop.mp3', loop_point: 0 },
        { file: 'm_sys_rglk2dlc_loop.mp3', loop_point: 0 },
        { file: 'm_sys_act16side_combine.mp3', loop_point: 8.777 },
        { file: 'm_sys_act19side_combine.mp3', loop_point: 12.852 },
        { file: 'm_bat_rglk3DLC_combine.mp3', loop_point: 18.233 },
        { file: 'm_sys_act16mini_combine.mp3', loop_point: 20.610 },
        { file: 'm_sys_act27side_day_loop.mp3', loop_point: 0 },
        { file: 'm_sys_act27side_night_combine.mp3', loop_point: 22.957 },
    ];

    // Audio Setup
    const bgAudio = new Audio();
    bgAudio.loop = false; // Disable default loop to use custom logic
    let isMuted = true;
    let currentMusicConfig = null;
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = muteBtn.querySelector('img');

    // Handle Custom Looping
    bgAudio.addEventListener('timeupdate', () => {
        if (currentMusicConfig && currentMusicConfig.loop_end) {
            if (bgAudio.currentTime >= currentMusicConfig.loop_end) {
                bgAudio.currentTime = currentMusicConfig.loop_point || 0;
                if (!bgAudio.paused) bgAudio.play();
            }
        }
    });

    bgAudio.addEventListener('ended', () => {
        if (currentMusicConfig) {
            bgAudio.currentTime = currentMusicConfig.loop_point || 0;
            if (!isMuted) bgAudio.play().catch(e => console.log('Audio loop failed:', e));
        }
    });

    // Function to play music for current background
    function playBgMusic(bgIndex) {
        if (bgIndex >= 0 && bgIndex < bgMusicList.length) {
            const config = bgMusicList[bgIndex];
            const musicPath = `assets/audio/${config.file}`;
            
            // Update current config
            currentMusicConfig = config;

            if (bgAudio.src !== window.location.origin + '/' + musicPath && bgAudio.src !== musicPath) {
                bgAudio.src = musicPath;
                if (!isMuted) {
                    bgAudio.play().catch(e => console.log('Audio play failed:', e));
                }
            }
        }
    }

    // Toggle Mute
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            bgAudio.pause();
            muteIcon.src = 'assets/ui/musicOff.webp';
        } else {
            bgAudio.play().catch(e => console.log('Audio play failed:', e));
            muteIcon.src = 'assets/ui/musicOn.webp';
        }
    });

    let currentBg = '';

    // Initialize with first background if placeholder
    if (bgImg.src.includes('placehold.co')) {
        currentBg = `assets/bj/${backgrounds[0]}`;
        bgImg.src = currentBg;
        playBgMusic(0);
    } else {
        // Try to determine current background from src
        currentBg = bgImg.src;
        // Find index
        const filename = currentBg.substring(currentBg.lastIndexOf('/') + 1);
        const index = backgrounds.indexOf(filename);
        if (index !== -1) playBgMusic(index);
    }

    // Toggle Panel
    bgSwitchBtn.addEventListener('click', () => {
        bgPanel.classList.toggle('hidden');
    });

    closeBgPanelBtn.addEventListener('click', () => {
        bgPanel.classList.add('hidden');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!bgPanel.contains(e.target) && !bgSwitchBtn.contains(e.target) && !bgPanel.classList.contains('hidden')) {
            bgPanel.classList.add('hidden');
        }
    });

    // Populate Grid
    backgrounds.forEach((bg, index) => {
        const bgPath = `assets/bj/${bg}`;
        const item = document.createElement('div');
        item.className = 'bg-item';
        if (bgImg.src.includes(bg)) {
            item.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = bgPath;
        img.loading = 'lazy'; // Lazy load for performance

        const name = document.createElement('div');
        name.className = 'bg-name';
        name.textContent = bg.replace('Bg_', '').replace('.webp', '');

        item.appendChild(img);
        item.appendChild(name);

        item.addEventListener('click', () => {
            bgImg.src = bgPath;
            currentBg = bgPath;
            playBgMusic(index);
            
            // Update selected state
            document.querySelectorAll('.bg-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        });

        bgGrid.appendChild(item);
    });

    // Character Art Switching Logic
    const artTabs = document.querySelectorAll('.art-tab');
    const charImg = document.querySelector('.char-layer .char-img');
    const skinListContainer = document.getElementById('skin-list');
    
    // Skin Mode UI Elements
    const skinUiControls = document.getElementById('skin-ui-controls');
    const skinBackBtn = document.getElementById('skin-back-btn');
    const skinViewBtn = document.getElementById('skin-view-btn');
    const uiElementsToHide = [
        document.querySelector('.top-tabs'),
        document.querySelector('.bottom-left-info'),
        document.querySelector('.right-tools'),
        document.querySelector('.bottom-center-control')
    ];

    // Painter Info Elements
    const painterInfoGroup = document.getElementById('painter-info');
    const painterToggle = document.getElementById('painter-toggle');
    const painterDetails = document.getElementById('painter-details');
    const painterTag = document.getElementById('painter-tag');
    const painterDesc = document.getElementById('painter-desc');

    // CV Info Elements
    const cvInfoGroup = document.getElementById('cv-info');
    const cvToggle = document.getElementById('cv-toggle');

    function updateTabIcons() {
        artTabs.forEach(tab => {
            const artType = tab.getAttribute('data-art');
            const img = tab.querySelector('img');
            if (tabIcons[artType]) {
                img.src = tab.classList.contains('active') ? tabIcons[artType].active : tabIcons[artType].default;
            }
        });
    }

    // Parse Art Data from HTML
    const artData = {};
    const skinList = [];
    
    const artDataContainer = document.getElementById('char-art-data');
    if (artDataContainer) {
        Array.from(artDataContainer.children).forEach(el => {
            const id = el.dataset.id;
            const type = el.dataset.type;
            
            artData[id] = {
                src: el.dataset.src,
                scale: parseFloat(el.dataset.scale) || 1.0
            };

            if (type === 'skin') {
                artData[id].id = id;
                artData[id].cover = el.dataset.cover;
                artData[id].brand = el.dataset.brand;
                artData[id].name = el.dataset.name;
                skinList.push(id);
            }
        });
    }
    let currentSkinId = ''; // Track selected skin
    let currentBaseScale = 1.0;
    let currentUserZoom = 1.0;

    function updateTransform() {
        if (charImg) {
            const totalScale = currentBaseScale * currentUserZoom;
            
            // Check for mobile portrait mode
            if (window.innerWidth <= 480) {
                 // Portrait Mobile: Center vertically and horizontally
                 charImg.style.transform = `translateY(0) scale(${totalScale})`;
            } else {
                 // Desktop / Tablet: Original offset
                 charImg.style.transform = `translateY(5%) scale(${totalScale})`;
            }
        }
    }

    // Update transform on resize
    window.addEventListener('resize', updateTransform);

    // Function to update character display and info
    function updateCharacterDisplay(artId) {
        const data = artData[artId];
        if (!data) return;

        // Update Image
        charImg.style.opacity = '0';
        setTimeout(() => {
            charImg.src = data.src;
            currentBaseScale = data.scale || 1.0;
            currentUserZoom = 1.0; // Reset user zoom on character switch
            updateTransform();
            charImg.style.opacity = '1';
        }, 200);

        // Update Painter Info from HTML
        if (painterTag && painterDesc) {
            const contentEl = document.querySelector(`#painter-content-data [data-id="${artId}"]`);
            if (contentEl) {
                const tag = contentEl.querySelector('.data-tag').textContent;
                const desc = contentEl.querySelector('.data-desc').innerHTML;
                painterTag.textContent = tag;
                painterDesc.innerHTML = desc;
            }
        }
    }

    // Toggle Painter Info
    painterToggle.addEventListener('click', () => {
        // Close CV if open
        if (cvInfoGroup.classList.contains('expanded')) {
            cvInfoGroup.classList.remove('expanded');
        }
        painterInfoGroup.classList.toggle('expanded');
    });

    // Toggle CV Info
    cvToggle.addEventListener('click', () => {
        // Close Painter if open
        if (painterInfoGroup.classList.contains('expanded')) {
            painterInfoGroup.classList.remove('expanded');
        }
        cvInfoGroup.classList.toggle('expanded');
    });

    // CV Item Selection Logic
    const cvItems = document.querySelectorAll('.cv-item');
    const cvNameDisplay = cvToggle.querySelector('.name');

    cvItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            cvItems.forEach(i => {
                i.classList.remove('active');
                // Remove check icon from lang box
                const langBox = i.querySelector('.cv-lang-box');
                const icon = langBox.querySelector('i');
                if (icon) icon.remove();
            });

            // Add active class to clicked item
            item.classList.add('active');

            // Add check icon to current item
            const langBox = item.querySelector('.cv-lang-box');
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-check';
            langBox.prepend(icon);

            // Update header name
            const name = item.querySelector('.cv-name').textContent;
            cvNameDisplay.textContent = name;
        });
    });

    // Populate Skin List Sidebar
    skinList.forEach(id => {
        const skin = artData[id];
        const card = document.createElement('div');
        card.className = 'skin-card';
        card.dataset.id = skin.id;

        const bg = document.createElement('img');
        bg.className = 'skin-card-bg';
        bg.src = skin.cover;
        bg.loading = 'lazy';

        const content = document.createElement('div');
        content.className = 'skin-card-content';
        
        const brand = document.createElement('div');
        brand.className = 'skin-brand';
        brand.textContent = skin.brand;

        const name = document.createElement('div');
        name.className = 'skin-name';
        name.textContent = skin.name;

        content.appendChild(brand);
        content.appendChild(name);
        card.appendChild(bg);
        card.appendChild(content);

        card.addEventListener('click', () => {
            updateCharacterDisplay(skin.id);

            // Update Active State
            document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentSkinId = skin.id;

            // Ensure skin tab is active
            artTabs.forEach(t => t.classList.remove('active'));
            const skinTab = document.querySelector('.art-tab[data-art="skin"]');
            if (skinTab) skinTab.classList.add('active');
            updateTabIcons();
            
            // Ensure eye is open
            const viewImg = skinViewBtn.querySelector('img');
            viewImg.src = 'assets/ui/eyeOn.webp';
        });

        skinListContainer.appendChild(card);
    });

    // Handle "Back" Button in Skin Mode
    skinBackBtn.addEventListener('click', () => {
        // Exit Skin Mode
        skinUiControls.classList.add('hidden');
        skinListContainer.classList.add('hidden');
        
        // Show Normal UI
        uiElementsToHide.forEach(el => {
            if(el) el.classList.remove('hidden');
        });
        
        // Keep current skin displayed (as per previous request)
    });

    // Handle "View" (Eye) Button
    skinViewBtn.addEventListener('click', () => {
        const img = skinViewBtn.querySelector('img');
        if (img.src.includes('eyeOn.webp')) {
            // Hide Art
            charImg.style.opacity = '0';
            img.src = 'assets/ui/eyeOff.webp';
        } else {
            // Show Art
            charImg.style.opacity = '1';
            img.src = 'assets/ui/eyeOn.webp';
        }
    });

    artTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const artType = tab.getAttribute('data-art');

            if (artType === 'skin') {
                // Enter Skin Mode
                skinUiControls.classList.remove('hidden');
                skinListContainer.classList.remove('hidden');
                
                // Hide Normal UI
                uiElementsToHide.forEach(el => {
                    if(el) el.classList.add('hidden');
                });

                artTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateTabIcons();

                // Select first skin if none selected
                if (!currentSkinId) {
                    const firstSkinId = skinList[0];
                    currentSkinId = firstSkinId;
                    document.querySelector(`.skin-card[data-id="${firstSkinId}"]`)?.classList.add('selected');
                    updateCharacterDisplay(firstSkinId);
                } else {
                     // Update display to current skin
                     updateCharacterDisplay(currentSkinId);
                }
                
            } else {
                // Regular switching for Elite 0 / Elite 2
                artTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateTabIcons();
                
                updateCharacterDisplay(artType);
                
                // Ensure skin list/controls are hidden
                skinUiControls.classList.add('hidden');
                skinListContainer.classList.add('hidden');
            }
        });
    });
    
    // Initial update for default view (assuming Elite 2 as default active tab in HTML?)
    // Or just run it based on active tab
    const activeTab = document.querySelector('.art-tab.active');
    if (activeTab) {
        const artType = activeTab.getAttribute('data-art');
        if (artType && artType !== 'skin') {
            updateCharacterDisplay(artType);
        }
    }
    updateTabIcons();

    // Right Toolbar Functions
    const btnDownload = document.getElementById('btn-download');
    const btnViewMode = document.getElementById('btn-view-mode');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    // Download
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const charImg = document.querySelector('.char-layer .char-img');
            if (charImg) {
                const link = document.createElement('a');
                link.href = charImg.src;
                // Generate filename
                let filename = 'character_art.webp';
                // Try to get name from active tab or skin
                if (currentSkinId && artData[currentSkinId]) {
                    filename = `Arknights_${artData[currentSkinId].name || currentSkinId}.webp`;
                } else {
                     const activeTab = document.querySelector('.art-tab.active');
                     if (activeTab) {
                         filename = `Arknights_${activeTab.getAttribute('data-art')}.webp`;
                     }
                }
                
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }

    // View Mode
    // currentUserZoom is defined above

    const charLayer = document.querySelector('.char-layer');
    
    // Reset zoom helper
    function resetZoom() {
        currentUserZoom = 1.0;
        updateTransform();
    }

    if (btnViewMode) {
        btnViewMode.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.add('ui-hidden');
            resetZoom(); // Reset zoom when entering
        });
    }

    // Exit View Mode Button
    const btnExitViewMode = document.getElementById('btn-exit-view-mode');
    if (btnExitViewMode) {
        btnExitViewMode.addEventListener('click', (e) => {
             e.stopPropagation();
             document.body.classList.remove('ui-hidden');
             resetZoom(); // Reset zoom when exiting
        });
    }

    // Mouse Wheel Zoom (Only in View Mode)
    window.addEventListener('wheel', (e) => {
        if (document.body.classList.contains('ui-hidden')) {
            e.preventDefault(); // Prevent page scroll
            
            const zoomSpeed = 0.1;
            const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
            
            currentUserZoom += delta;
            
            // Clamp zoom
            currentUserZoom = Math.min(Math.max(0.5, currentUserZoom), 3);
            
            // Apply zoom
            updateTransform();
        }
    }, { passive: false });

    // Webpage Fullscreen / Monitor Fullscreen Logic
    function updateFullscreenIcon() {
        if (!btnFullscreen) return;
        const icon = btnFullscreen.querySelector('img');
        const isFullscreen = document.fullscreenElement || document.body.classList.contains('web-fullscreen');
        if (isFullscreen) {
            icon.src = 'assets/ui/refullscreen.webp';
        } else {
            icon.src = 'assets/ui/fullscreen.webp';
        }
    }

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            // 1. If currently in native fullscreen, exit it
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                return;
            }

            // 2. If currently in CSS web-fullscreen, exit it
            if (document.body.classList.contains('web-fullscreen')) {
                document.body.classList.remove('web-fullscreen');
                updateFullscreenIcon();
                return;
            }

            // 3. Try to enter Native Fullscreen (Best for iframes)
            // Note: This requires allow="fullscreen" on the iframe if embedded
            const requestPromise = document.documentElement.requestFullscreen();
            
            if (requestPromise) {
                requestPromise
                .then(() => {
                    // Success: Native fullscreen active
                    // Icon updates via 'fullscreenchange' event
                })
                .catch((err) => {
                    console.log(`Native fullscreen failed (likely iframe restriction): ${err.message}`);
                    // Fallback: Use CSS Webpage Fullscreen
                    document.body.classList.add('web-fullscreen');
                    updateFullscreenIcon();
                });
            } else {
                // Fallback for browsers not supporting promise-based requestFullscreen (very old)
                document.body.classList.add('web-fullscreen');
                updateFullscreenIcon();
            }
        });
    }

    // Listen for native fullscreen changes
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
});
