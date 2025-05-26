// Pastikan DOM sudah sepenuhnya dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM sepenuhnya dimuat dan di-parse.");

    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    const airplaneAnimationDuration = 4000;
    const totalLoadingDuration = airplaneAnimationDuration + 500;
    const fadeOutTransition = 500;

    // Network Canvas Animation (bagian hero section)
    let startNetworkAnimation;

    const networkCanvas = document.getElementById('network-canvas');
    if (networkCanvas) {
        const ctx = networkCanvas.getContext('2d');
        let particlesArray;
        let networkAnimationId;

        function setNetworkCanvasDimensions() {
            networkCanvas.width = window.innerWidth;
            const heroSection = document.getElementById('home');
            if (heroSection) {
                networkCanvas.height = heroSection.offsetHeight > 0 ? heroSection.offsetHeight : window.innerHeight;
            } else {
                networkCanvas.height = window.innerHeight;
            }
        }

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x + this.size > networkCanvas.width || this.x - this.size < 0) { this.directionX = -this.directionX; }
                if (this.y + this.size > networkCanvas.height || this.y - this.size < 0) { this.directionY = -this.directionY; }
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        function initNetworkParticles() {
            particlesArray = [];
            let numberOfParticles = (networkCanvas.height * networkCanvas.width) / 12000;
            if (numberOfParticles > 120) numberOfParticles = 120;
            const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--color-network-particle').trim() || 'rgba(16, 185, 129, 0.5)';
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 1.5) + 0.5;
                let x = Math.random() * networkCanvas.width; let y = Math.random() * networkCanvas.height;
                let directionX = (Math.random() * 0.3) - 0.15; let directionY = (Math.random() * 0.3) - 0.15;
                particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
            }
        }
        function animateNetworkParticles() {
            networkAnimationId = requestAnimationFrame(animateNetworkParticles);
            ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
            if (particlesArray && particlesArray.length > 0) {
                for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
                connectNetworkParticles();
            }
        }
        function connectNetworkParticles() {
            let opacityValue = 1;
            const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--color-network-line').trim() || 'rgba(16, 185, 129, 0.2)';
            const connectDistance = Math.min(networkCanvas.width, networkCanvas.height) / 6;
            if (particlesArray && particlesArray.length > 0) {
                for (let a = 0; a < particlesArray.length; a++) {
                    for (let b = a + 1; b < particlesArray.length; b++) {
                        let distance = Math.sqrt(Math.pow(particlesArray[a].x - particlesArray[b].x, 2) + Math.pow(particlesArray[a].y - particlesArray[b].y, 2));
                        if (distance < connectDistance) {
                            opacityValue = 1 - (distance / connectDistance);
                            ctx.strokeStyle = lineColor.replace(/rgba\((\d+,\s*\d+,\s*\d+),[^)]+\)/, `rgba($1, ${opacityValue * 0.5})`);
                            ctx.lineWidth = 0.3;
                            ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                        }
                    }
                }
            }
        }

        startNetworkAnimation = function () {
            if (!networkCanvas || !networkCanvas.getContext) {
                console.warn("Canvas 2D tidak didukung oleh browser ini atau elemen tidak ditemukan.");
                return;
            }
            setNetworkCanvasDimensions();
            initNetworkParticles();
            if (networkAnimationId) { cancelAnimationFrame(networkAnimationId); }
            animateNetworkParticles();
        }

        let networkResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(networkResizeTimer);
            networkResizeTimer = setTimeout(() => {
                if (typeof startNetworkAnimation === 'function') {
                    startNetworkAnimation();
                }
            }, 250);
        });
    } else {
        console.warn("Elemen canvas dengan ID 'network-canvas' tidak ditemukan.");
        startNetworkAnimation = () => { console.warn("Animasi jaringan tidak bisa dimulai karena canvas tidak ditemukan."); };
    }


    if (loadingScreen && mainContent) {
        console.log("Loading screen dan main content ditemukan.");
        document.body.style.overflow = 'hidden';
        const airplaneContainer = document.querySelector('.airplane-container-2d');
        if (airplaneContainer) {
            airplaneContainer.style.animationDuration = `${airplaneAnimationDuration / 1000}s`;
        }

        setTimeout(() => {
            console.log("Timeout untuk loading screen selesai.");

            loadingScreen.classList.add('hidden');
            console.log("Kelas 'hidden' ditambahkan ke loading screen.");
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.5s ease-in';
            document.body.style.overflow = '';

            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                    console.log("Loading screen dihapus dari DOM.");
                }
                if (typeof startNetworkAnimation === 'function') {
                    console.log("Memulai animasi jaringan setelah loading screen.");
                    startNetworkAnimation();
                }
            }, fadeOutTransition + 200);
        }, totalLoadingDuration);
    } else {
        console.error("Loading screen atau main content TIDAK ditemukan!");
        if (mainContent) mainContent.style.opacity = '1';
        if (typeof startNetworkAnimation === 'function') {
            console.log("Memulai animasi jaringan karena loading screen tidak ada.");
            startNetworkAnimation();
        }
    }


    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const mainHeader = document.getElementById('main-header');
    const navContainer = document.querySelector('.nav-fresh-container');
    const navLinks = document.querySelectorAll('.nav-link-fresh');
    const navMover = document.querySelector('.nav-mover');
    let currentActiveLink = document.querySelector('.nav-link-fresh.active');
    const sections = [];
    const logoLink = document.getElementById('logo-link');

    navLinks.forEach(link => {
        const sectionId = link.getAttribute('href');
        if (sectionId && sectionId.startsWith('#')) {
            const section = document.querySelector(sectionId);
            if (section) {
                sections.push(section);
            }
        }
    });

    function positionMover(targetLink) {
        if (navMover && targetLink && navContainer) {
            navMover.style.left = targetLink.offsetLeft + 'px';
            navMover.style.width = targetLink.offsetWidth + 'px';
            navMover.style.height = targetLink.offsetHeight + 'px';
            navMover.style.top = targetLink.offsetTop + 'px';
            navMover.style.opacity = '1';
        } else if (navMover) {
            navMover.style.opacity = '0';
        }
    }

    function updateActiveLinkStyles(activeLinkElement) {
        navLinks.forEach(l => {
            l.classList.remove('active', 'active-state', 'hover-state');
        });
        if (activeLinkElement) {
            activeLinkElement.classList.add('active', 'active-state');
            currentActiveLink = activeLinkElement;
            if (navContainer && !navContainer.matches(':hover')) {
                positionMover(activeLinkElement);
            }
        }
    }

    function handleNavLinkClick(linkElement, event) {
        if (event) event.preventDefault();
        updateActiveLinkStyles(linkElement);

        const targetId = linkElement.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = mainHeader ? mainHeader.offsetHeight : 0;
            let offsetPosition;
            if (targetId === '#home') {
                offsetPosition = 0;
            } else {
                const elementPosition = targetElement.getBoundingClientRect().top;
                offsetPosition = elementPosition + window.scrollY - headerOffset - 20;
            }

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }


    if (currentActiveLink && navMover) {
        setTimeout(() => {
            updateActiveLinkStyles(currentActiveLink);
        }, 150);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            handleNavLinkClick(this, e);
        });

        link.addEventListener('mouseenter', function () {
            if (navMover) {
                positionMover(this);
                navLinks.forEach(l => l.classList.remove('hover-state'));
                this.classList.add('hover-state');
                if (currentActiveLink && currentActiveLink !== this) {
                    currentActiveLink.classList.remove('active-state');
                } else if (currentActiveLink === this) {
                    this.classList.add('active-state');
                }
            }
        });
    });

    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            const homeNavLink = document.querySelector('.nav-link-fresh[href="#home"]');
            if (homeNavLink) {
                handleNavLinkClick(homeNavLink);
            }
        });
    }

    if (navContainer) {
        navContainer.addEventListener('mouseleave', () => {
            if (currentActiveLink && navMover) {
                positionMover(currentActiveLink);
                navLinks.forEach(l => l.classList.remove('hover-state'));
                currentActiveLink.classList.add('active-state');
            } else if (navMover) {
                navMover.style.opacity = '0';
            }
        });
    }

    function updateActiveLinkOnScroll() {
        let currentSectionId = '';
        const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
        const scrollOffset = window.innerHeight * 0.3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - scrollOffset && window.scrollY < sectionTop + sectionHeight - scrollOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (!currentSectionId && sections.length > 0) {
            if (window.scrollY < (sections[0].offsetTop - headerHeight - scrollOffset)) {
                currentSectionId = 'home';
            } else {
                const lastSection = sections[sections.length - 1];
                if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
                    currentSectionId = lastSection.getAttribute('id');
                }
            }
        } else if (!currentSectionId && sections.length === 0 && window.scrollY < 50) {
            currentSectionId = 'home';
        }

        const newActiveLink = document.querySelector(`.nav-link-fresh[href="#${currentSectionId}"]`);
        if (newActiveLink && newActiveLink !== currentActiveLink) {
            updateActiveLinkStyles(newActiveLink);
        }
    }

    window.addEventListener('scroll', updateActiveLinkOnScroll);
    setTimeout(() => {
        updateActiveLinkOnScroll();
    }, 200);

    if (mainHeader) {
        const logoTextElement = mainHeader.querySelector('.logo-text-initial');
        const navContainerElement = mainHeader.querySelector('.nav-fresh-container');
        const initialLogoColor = getComputedStyle(document.documentElement).getPropertyValue('--color-logo-text-initial').trim();
        const scrollLogoColor = getComputedStyle(document.documentElement).getPropertyValue('--color-logo-text-scroll').trim();
        const initialNavBg = getComputedStyle(document.documentElement).getPropertyValue('--color-nav-container-bg').trim();
        const scrollNavBg = getComputedStyle(document.documentElement).getPropertyValue('--color-nav-container-scroll-bg').trim();

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
                if (logoTextElement) logoTextElement.style.color = scrollLogoColor;
                if (navContainerElement) navContainerElement.style.backgroundColor = scrollNavBg;
            } else {
                mainHeader.classList.remove('scrolled');
                if (logoTextElement) logoTextElement.style.color = initialLogoColor;
                if (navContainerElement) navContainerElement.style.backgroundColor = initialNavBg;
            }
        });
    }


    // Chatbox Logic
    const chatboxToggle = document.getElementById('chatbox-toggle');
    const chatboxContainer = document.getElementById('chatbox-container');
    const closeChatButton = document.getElementById('close-chat');
    const chatboxMessages = document.getElementById('chatbox-messages');
    const chatboxInput = document.getElementById('chatbox-input');
    const chatboxSendButton = document.getElementById('chatbox-send');

    const systemInstructions = `Anda adalah asisten AI yang ramah dan informatif untuk portofolio milik Irfan Hariyanto.
Tujuan utama Anda adalah membantu pengunjung memahami lebih lanjut tentang Irfan, keahliannya, proyek-proyeknya, dan cara menghubunginya.
Berikut adalah informasi kunci tentang Irfan Hariyanto:
- Nama Lengkap: Irfan Hariyanto
- Keahlian Utama: Pengembang WhatsBot, Desainer. (Anda bisa menambahkan detail lain di sini jika ada, misal: ahli dalam Node.js, Python, desain UI/UX dengan Figma)
- Asal: Indonesia
- Informasi Kontak: Email (irfnhrynto@gmail.com), WhatsApp (+62 898-8808-885), Instagram (@irfann._x).
- Bagian Portofolio: "Home" (Beranda), "About Me" (Tentang Saya), "My Works" (Projek-projek), "Contact" (Kontak).
Ketika ditanya tentang Irfan atau portofolionya, gunakan informasi ini sebagai dasar. Berikan jawaban yang ringkas, profesional, dan bersahabat.
Jika Anda tidak tahu jawabannya berdasarkan informasi ini, katakan bahwa Anda tidak memiliki informasi tersebut tetapi Irfan bisa dihubungi langsung.
Selalu gunakan Bahasa Indonesia yang baik dan sopan.`;

    const initialAiGreeting = "Halo! Saya adalah asisten AI untuk portofolio Irfan Hariyanto. Ada yang bisa saya bantu tanyakan mengenai Irfan atau karyanya?";

    let chatHistory = [
        { role: "user", parts: [{ text: systemInstructions }] },
        { role: "model", parts: [{ text: initialAiGreeting }] }
    ];

    function addMessageToChatbox(text, sender) {
        if (!chatboxMessages) return;
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');

        if (sender === 'ai') {
            let formattedText = text;
            formattedText = formattedText.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
                const escapedContent = codeContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return `<pre><code class="block whitespace-pre-wrap p-2 my-2 bg-gray-100 rounded text-sm text-gray-800">${escapedContent}</code></pre>`;
            });
            formattedText = formattedText.replace(/`([^`]+?)`/g, (match, codeContent) => {
                const escapedContent = codeContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return `<code class="px-1 py-0.5 bg-gray-200 rounded text-sm text-red-600">${escapedContent}</code>`;
            });
            formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
            formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');

            let i = 0;
            const typingSpeed = 20;
            messageElement.innerHTML = "";

            function typeCharacter() {
                if (i < formattedText.length) {
                    if (formattedText[i] === '<') {
                        let tagEndIndex = formattedText.indexOf('>', i);
                        if (tagEndIndex !== -1) {
                            messageElement.innerHTML += formattedText.substring(i, tagEndIndex + 1);
                            i = tagEndIndex + 1;
                        } else {
                            messageElement.innerHTML += formattedText[i];
                            i++;
                        }
                    } else {
                        messageElement.innerHTML += formattedText[i];
                        i++;
                    }
                    if (chatboxMessages) chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
                    setTimeout(typeCharacter, typingSpeed);
                }
            }
            typeCharacter();

        } else {
            messageElement.textContent = text;
            if (chatboxMessages) chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        }
        if (chatboxMessages) chatboxMessages.appendChild(messageElement);
    }

    if (chatboxMessages) {
        chatboxMessages.innerHTML = '';
        addMessageToChatbox(initialAiGreeting, 'ai');
    }


    if (!chatboxToggle || !chatboxContainer || !closeChatButton || !chatboxMessages || !chatboxInput || !chatboxSendButton) {
        console.warn('Satu atau lebih elemen chatbox tidak ditemukan. Fungsi inti chatbox mungkin terganggu.');
    } else {
        console.log("Semua elemen chatbox ditemukan. Event listener akan ditambahkan.");
        chatboxToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Tombol chatbox toggle DIKLIK!");
            chatboxContainer.classList.toggle('open');
            if (chatboxContainer.classList.contains('open')) {
                chatboxToggle.innerHTML = '<i class="fas fa-times"></i>';
                if (chatboxInput) chatboxInput.focus();
            } else {
                chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
            }
        });
        closeChatButton.addEventListener('click', () => {
            console.log("Tombol close chatbox di header DIKLIK!");
            chatboxContainer.classList.remove('open');
            chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
        });

        window.addEventListener('click', function (event) {
            if (chatboxContainer && chatboxContainer.classList.contains('open')) {
                if (!chatboxContainer.contains(event.target) && !chatboxToggle.contains(event.target)) {
                    chatboxContainer.classList.remove('open');
                    chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
                }
            }
        });

        function showTypingIndicator() {
            removeTypingIndicator();
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('ai-typing-indicator');

            for (let i = 0; i < 4; i++) {
                const dot = document.createElement('span');
                dot.classList.add('typing-dot');
                typingIndicator.appendChild(dot);
            }

            if (chatboxMessages) chatboxMessages.appendChild(typingIndicator);
            if (chatboxMessages) chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            return typingIndicator;
        }

        function removeTypingIndicator() {
            if (chatboxMessages) {
                const typingIndicator = chatboxMessages.querySelector('.ai-typing-indicator');
                if (typingIndicator) {
                    chatboxMessages.removeChild(typingIndicator);
                }
            }
        }

        async function sendMessage() {
            const userMessageText = chatboxInput.value.trim();
            if (userMessageText === '') return;

            addMessageToChatbox(userMessageText, 'user');
            chatHistory.push({ role: "user", parts: [{ text: userMessageText }] });
            chatboxInput.value = '';
            chatboxSendButton.disabled = true;
            const originalButtonContent = chatboxSendButton.innerHTML;
            chatboxSendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            showTypingIndicator();

            try {
                const apiKey = "AIzaSyBm0uMkgPJpiG04snGbXAQNmsISivlQ8mw";
                if (!apiKey) {
                    addMessageToChatbox('Error: API Key belum dikonfigurasi.', 'ai');
                    console.error("API Key is not configured in script.js.");
                    chatboxSendButton.disabled = false;
                    chatboxSendButton.innerHTML = originalButtonContent;
                    removeTypingIndicator();
                    return;
                }
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const payload = {
                    contents: chatHistory,
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                removeTypingIndicator();

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error dari API:', errorData);
                    const displayError = errorData?.error?.message || `Gagal menghubungi AI. Status: ${response.status}`;
                    addMessageToChatbox(displayError, 'ai');
                    chatHistory.push({ role: "model", parts: [{ text: displayError }] });
                    return;
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const aiResponseText = result.candidates[0].content.parts[0].text;
                    addMessageToChatbox(aiResponseText, 'ai');
                    chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
                } else if (result.candidates && result.candidates.length > 0 && result.candidates[0].finishReason === "SAFETY") {
                    const safetyMessage = "Respons saya diblokir karena alasan keamanan. Silakan coba pertanyaan lain.";
                    addMessageToChatbox(safetyMessage, 'ai');
                    chatHistory.push({ role: "model", parts: [{ text: safetyMessage }] });
                }
                else {
                    console.error('Struktur respons tidak diharapkan:', result);
                    addMessageToChatbox('Maaf, saya tidak dapat memproses permintaan Anda saat ini (format respons tidak sesuai).', 'ai');
                    chatHistory.push({ role: "model", parts: [{ text: 'Maaf, saya tidak dapat memproses permintaan Anda saat ini (format respons tidak sesuai).' }] });
                }

            } catch (error) {
                console.error('Error saat memanggil Gemini API:', error);
                removeTypingIndicator();
                addMessageToChatbox(`Maaf, terjadi masalah: ${error.message}`, 'ai');
            } finally {
                chatboxSendButton.disabled = false;
                chatboxSendButton.innerHTML = originalButtonContent;
                if (chatboxInput) chatboxInput.focus();
            }
        }

        chatboxSendButton.addEventListener('click', sendMessage);
        chatboxInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !chatboxSendButton.disabled) {
                sendMessage();
            }
        });
    }
});
