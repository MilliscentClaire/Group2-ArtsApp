// ══ EPIKONG-BAYAN THEME, BACKGROUND PARTICLES & WAR DRUMS ENGINE ══
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

        #epik-global-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
        }

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
            width: 13.5rem;
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

    // Variables
    var currentTheme = localStorage.getItem('epikong-theme') || 'classic';
    var soundEnabled = localStorage.getItem('epikong-sound') === 'true';
    var audioCtx = null;
    var drumInterval = null;

    var bgCanvas = null;
    var bgCtx = null;
    var bgParticles = [];
    var particleColor = '#D4AF37';

    // 2. Full-Screen Canvas Engine
    function initGlobalCanvas() {
        if (!document.body) return;
        bgCanvas = document.getElementById('epik-global-canvas');
        if (!bgCanvas) {
            bgCanvas = document.createElement('canvas');
            bgCanvas.id = 'epik-global-canvas';
            document.body.appendChild(bgCanvas);
        }
        bgCtx = bgCanvas.getContext('2d');
        resizeBgCanvas();
        createParticles();
        requestAnimationFrame(renderParticles);
    }

    function resizeBgCanvas() {
        if (!bgCanvas) return;
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }

    function Particle() { this.reset(); }
    Particle.prototype.reset = function() {
        this.x = Math.random() * (bgCanvas ? bgCanvas.width : window.innerWidth);
        this.y = Math.random() * (bgCanvas ? bgCanvas.height : window.innerHeight);
        this.r = Math.random() * 1.5 + 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.speed = Math.random() * 0.4 + 0.1;
        this.dx = (Math.random() - 0.5) * 0.4;
        this.dy = -this.speed;
    };
    Particle.prototype.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.0008;
        if (this.y < -10 || this.x < -10 || this.x > (bgCanvas ? bgCanvas.width : window.innerWidth) + 10 || this.alpha <= 0) {
            this.reset();
            this.y = (bgCanvas ? bgCanvas.height : window.innerHeight) + 5;
        }
    };
    Particle.prototype.draw = function() {
        if (!bgCtx) return;
        bgCtx.save();
        bgCtx.globalAlpha = Math.max(0, this.alpha);
        if (currentTheme === 'coastal') {
            bgCtx.fillStyle = particleColor;
            bgCtx.beginPath();
            bgCtx.ellipse(this.x, this.y, this.r * 2.5, this.r * 0.8, Math.sin(Date.now() * 0.001 + this.x) * 0.5, 0, Math.PI * 2);
            bgCtx.fill();
        } else if (currentTheme === 'forest') {
            var grad = bgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3.5);
            grad.addColorStop(0, particleColor);
            grad.addColorStop(1, 'transparent');
            bgCtx.fillStyle = grad;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.r * 3.5, 0, Math.PI * 2);
            bgCtx.fill();
        } else {
            bgCtx.fillStyle = particleColor;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            bgCtx.fill();
        }
        bgCtx.restore();
    };

    function createParticles() {
        bgParticles = [];
        for (var i = 0; i < 55; i++) {
            bgParticles.push(new Particle());
        }
    }

    function renderParticles() {
        if (bgCtx && bgCanvas) {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            bgParticles.forEach(function(p) { p.update(); p.draw(); });
        }
        requestAnimationFrame(renderParticles);
    }

    window.addEventListener('resize', function() {
        resizeBgCanvas();
    });

    // 3. Inject FAB UI
    document.addEventListener('DOMContentLoaded', function() {
        initGlobalCanvas();

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
                    <div id="sound-pill" class="${soundEnabled ? 'on' : ''}" onclick="window.toggleEpikSound()"></div>
                </div>
            </div>

            <button id="theme-btn" onclick="window.toggleEpikThemePanel()" title="Change museum theme">&#127912;</button>
        `;
        document.body.appendChild(fab);

        window.applyEpikTheme(currentTheme);
    });

    // 4. Audio Engine: Clear Audible Tribal War Drums Synthesizer
    function stopAllSounds() {
        if (drumInterval) { clearInterval(drumInterval); drumInterval = null; }
    }

    function initAudioContext() {
        if (!audioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playWarDrumHit(freq, duration, gainVal, hasImpact) {
        if (!audioCtx || !soundEnabled) return;
        var now = audioCtx.currentTime;

        // Primary Bass/Body Oscillator
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.25), now + duration);

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);

        // Secondary Harmonic Pitch for wooden drumhead resonance
        var osc2 = audioCtx.createOscillator();
        var gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 1.5, now);
        osc2.frequency.exponentialRampToValueAtTime(40, now + (duration * 0.6));
        gain2.gain.setValueAtTime(gainVal * 0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now);
        osc2.stop(now + (duration * 0.6));

        // Noise Burst for drumhead skin slap
        if (hasImpact) {
            var bufLen = Math.floor(audioCtx.sampleRate * 0.04);
            var buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
            var d = buf.getChannelData(0);
            for (var i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);

            var noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = buf;

            var filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 500;

            var noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(gainVal * 0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            noiseSrc.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);

            noiseSrc.start(now);
        }
    }

    function startWarDrumsSound() {
        initAudioContext();
        stopAllSounds();
        if (!soundEnabled) return;

        var step = 0;
        // Rhythmic Dabakan Tribal War Drum Pattern (8-beat loop)
        var pattern = [
            { freq: 110, duration: 0.55, gain: 0.35, impact: true },  // Heavy Dabakan Low Bass
            null,                                                    // Rest
            { freq: 180, duration: 0.25, gain: 0.18, impact: false },// Mid Tap
            { freq: 140, duration: 0.35, gain: 0.25, impact: true }, // Accent Rim Hit
            { freq: 100, duration: 0.50, gain: 0.30, impact: true },  // Heavy Secondary Bass
            null,                                                    // Rest
            { freq: 210, duration: 0.20, gain: 0.15, impact: false },// Light Wood Tap
            { freq: 160, duration: 0.30, gain: 0.22, impact: true }  // Pickup Strike
        ];

        drumInterval = setInterval(function() {
            if (!soundEnabled) return;
            var hit = pattern[step % pattern.length];
            if (hit) {
                playWarDrumHit(hit.freq, hit.duration, hit.gain, hit.impact);
            }
            step++;
        }, 340); // Energetic ~88 BPM Tribal Tempo
    }

    window.applyEpikTheme = function(theme) {
        currentTheme = theme;
        localStorage.setItem('epikong-theme', theme);

        document.body.classList.remove('theme-coastal', 'theme-forest');
        if (theme !== 'classic') document.body.classList.add('theme-' + theme);

        if (theme === 'coastal') particleColor = '#4DD9E0';
        else if (theme === 'forest') particleColor = '#7EC850';
        else particleColor = '#D4AF37';

        document.querySelectorAll('.theme-option').forEach(function(el) {
            el.classList.toggle('active', el.getAttribute('data-theme') === theme);
        });

        if (soundEnabled) {
            startWarDrumsSound();
        } else {
            stopAllSounds();
        }
    };

    window.toggleEpikSound = function() {
        initAudioContext();
        soundEnabled = !soundEnabled;
        localStorage.setItem('epikong-sound', soundEnabled);
        var pill = document.getElementById('sound-pill');
        if (pill) pill.classList.toggle('on', soundEnabled);

        if (soundEnabled) {
            startWarDrumsSound();
        } else {
            stopAllSounds();
        }
    };

    window.toggleEpikThemePanel = function() {
        initAudioContext();
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

    // Set immediate body class to avoid flash
    if (currentTheme !== 'classic') {
        document.body.classList.add('theme-' + currentTheme);
    }
})();
