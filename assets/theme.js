// ══ EPIKONG-BAYAN THEME & WAR DRUMS ENGINE ══
(function() {
    // 1. Inject Theme CSS
    var style = document.createElement('style');
    style.innerHTML = `
        body { transition: background-color 0.8s ease, color 0.8s ease; }
        body.theme-coastal {
            --canvas: #04111F !important;
            --card: #071827 !important;
            --gold: #4DD9E0 !important;
            --bronze: #0E3249 !important;
            --red: #1A6EA8 !important;
            background-color: #04111F !important;
        }
        body.theme-coastal .spotlight { background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(77,217,224,0.1) 0%, transparent 70%) !important; }
        body.theme-coastal .gold-glow { text-shadow: 0 2px 20px rgba(77,217,224,0.4), 0 0 40px rgba(77,217,224,0.15) !important; }

        body.theme-forest {
            --canvas: #040D06 !important;
            --card: #081409 !important;
            --gold: #7EC850 !important;
            --bronze: #163B1A !important;
            --red: #2E6B30 !important;
            background-color: #040D06 !important;
        }
        body.theme-forest .spotlight { background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(126,200,80,0.1) 0%, transparent 70%) !important; }
        body.theme-forest .gold-glow { text-shadow: 0 2px 20px rgba(126,200,80,0.4), 0 0 40px rgba(126,200,80,0.15) !important; }

        #theme-fab {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.75rem;
        }
        #theme-btn {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: #181613;
            border: 1px solid rgba(212,175,55,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transition: transform 0.2s, border-color 0.2s;
        }
        #theme-btn:hover { transform: scale(1.1); border-color: #D4AF37; }
        #theme-panel {
            background: rgba(13,12,10,0.95);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 1rem;
            padding: 1rem;
            width: 13rem;
            box-shadow: 0 8px 40px rgba(0,0,0,0.7);
            backdrop-filter: blur(16px);
            display: none;
            flex-direction: column;
            gap: 0.5rem;
        }
        #theme-panel.open { display: flex; }
        .theme-option {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            padding: 0.6rem 0.75rem;
            border-radius: 0.6rem;
            cursor: pointer;
            border: 1px solid transparent;
            transition: background 0.2s, border-color 0.2s;
        }
        .theme-option:hover { background: rgba(255,255,255,0.04); }
        .theme-option.active { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
        .theme-swatch {
            width: 1.75rem;
            height: 1.75rem;
            border-radius: 50%;
            flex-shrink: 0;
            border: 2px solid rgba(255,255,255,0.15);
        }
        .theme-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #B8B0A5; }
        .theme-sublabel { font-size: 0.6rem; color: rgba(184,176,165,0.5); margin-top: 1px; }
        #sound-toggle {
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.75rem;
            border-top: 1px solid rgba(255,255,255,0.07);
        }
        #sound-toggle span { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #B8B0A5; }
        #sound-pill {
            width: 2.2rem;
            height: 1.2rem;
            border-radius: 9999px;
            background: #332D24;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        #sound-pill.on { background: #D4AF37; }
        #sound-pill::after {
            content: '';
            position: absolute;
            top: 2px; left: 2px;
            width: 0.8rem; height: 0.8rem;
            border-radius: 50%;
            background: white;
            transition: transform 0.3s;
        }
        #sound-pill.on::after { transform: translateX(1rem); }
    `;
    document.head.appendChild(style);

    // 2. Inject FAB UI
    document.addEventListener('DOMContentLoaded', function() {
        var fab = document.createElement('div');
        fab.id = 'theme-fab';
        fab.innerHTML = `
            <div id="theme-panel">
                <p style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(184,176,165,0.5);margin-bottom:0.25rem;padding:0 0.25rem">Museum Atmosphere</p>

                <div class="theme-option active" data-theme="classic" onclick="window.applyEpikTheme('classic')">
                    <div class="theme-swatch" style="background:radial-gradient(circle at 40% 40%,#2a2518,#0D0C0A)"></div>
                    <div>
                        <div class="theme-label">Classic Archive</div>
                        <div class="theme-sublabel">Gold &amp; Darkness</div>
                    </div>
                </div>

                <div class="theme-option" data-theme="coastal" onclick="window.applyEpikTheme('coastal')">
                    <div class="theme-swatch" style="background:radial-gradient(circle at 40% 40%,#0E3249,#04111F)"></div>
                    <div>
                        <div class="theme-label">Coastal Tribe</div>
                        <div class="theme-sublabel">Ocean &amp; Waves</div>
                    </div>
                </div>

                <div class="theme-option" data-theme="forest" onclick="window.applyEpikTheme('forest')">
                    <div class="theme-swatch" style="background:radial-gradient(circle at 40% 40%,#163B1A,#040D06)"></div>
                    <div>
                        <div class="theme-label">Ancient Forest</div>
                        <div class="theme-sublabel">Jungle &amp; Fireflies</div>
                    </div>
                </div>

                <div id="sound-toggle">
                    <span>&#127925; Tribal War Drums</span>
                    <div id="sound-pill" onclick="window.toggleEpikSound()"></div>
                </div>
            </div>

            <button id="theme-btn" onclick="window.toggleEpikThemePanel()" title="Change museum theme">&#127912;</button>
        `;
        document.body.appendChild(fab);

        // Restore saved theme on DOM ready
        window.applyEpikTheme(currentTheme);
    });

    // 3. Audio & Theme Logic
    var currentTheme = localStorage.getItem('epikong-theme') || 'classic';
    var soundEnabled = localStorage.getItem('epikong-sound') === 'true';
    var audioCtx = null;
    var drumInterval = null;

    function stopAllSounds() {
        if (drumInterval) { clearInterval(drumInterval); drumInterval = null; }
    }

    function playWarDrumHit(freq, duration, gainVal, isNoise) {
        if (!audioCtx || !soundEnabled) return;
        var now = audioCtx.currentTime;

        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + duration);

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);

        if (isNoise) {
            var bufLen = audioCtx.sampleRate * 0.05;
            var buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
            var d = buf.getChannelData(0);
            for (var i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.3;

            var noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = buf;

            var filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;

            var noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(gainVal * 0.4, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

            noiseSrc.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);

            noiseSrc.start(now);
        }
    }

    function startWarDrumsSound() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        stopAllSounds();

        var step = 0;
        var pattern = [
            { freq: 85, duration: 0.6, gain: 0.18, noise: true },
            null,
            { freq: 140, duration: 0.3, gain: 0.08, noise: false },
            { freq: 110, duration: 0.4, gain: 0.12, noise: true },
            { freq: 85, duration: 0.5, gain: 0.15, noise: true },
            null,
            { freq: 160, duration: 0.25, gain: 0.07, noise: false },
            { freq: 130, duration: 0.35, gain: 0.09, noise: true }
        ];

        drumInterval = setInterval(function() {
            if (!soundEnabled) return;
            var hit = pattern[step % pattern.length];
            if (hit) playWarDrumHit(hit.freq, hit.duration, hit.gain, hit.noise);
            step++;
        }, 360);
    }

    window.applyEpikTheme = function(theme) {
        currentTheme = theme;
        localStorage.setItem('epikong-theme', theme);

        document.body.classList.remove('theme-coastal', 'theme-forest');
        if (theme !== 'classic') document.body.classList.add('theme-' + theme);

        document.querySelectorAll('.theme-option').forEach(function(el) {
            el.classList.toggle('active', el.getAttribute('data-theme') === theme);
        });

        if (window.onEpikThemeChange) {
            window.onEpikThemeChange(theme);
        }

        if (soundEnabled) {
            startWarDrumsSound();
        } else {
            stopAllSounds();
        }
    };

    window.toggleEpikSound = function() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('epikong-sound', soundEnabled);
        var pill = document.getElementById('sound-pill');
        if (pill) pill.classList.toggle('on', soundEnabled);
        if (soundEnabled) {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            startWarDrumsSound();
        } else {
            stopAllSounds();
        }
    };

    window.toggleEpikThemePanel = function() {
        var panel = document.getElementById('theme-panel');
        if (panel) panel.classList.toggle('open');
    };

    document.addEventListener('click', function(e) {
        var fab = document.getElementById('theme-fab');
        if (fab && !fab.contains(e.target)) {
            var panel = document.getElementById('theme-panel');
            if (panel) panel.classList.remove('open');
        }
    });

    // Apply immediate class to body before render to avoid flash
    if (currentTheme !== 'classic') {
        document.body.classList.add('theme-' + currentTheme);
    }
})();
