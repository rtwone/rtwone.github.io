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

    // Fungsi ini sekarang hanya mengurus kelas untuk styling teks dan status aktif
    function updateLinkTextAndActiveClass(activeLinkElement) {
        navLinks.forEach(l => {
            l.classList.remove('active', 'active-state', 'hover-state');
        });
        if (activeLinkElement) {
            activeLinkElement.classList.add('active', 'active-state');
            currentActiveLink = activeLinkElement;
        }
    }

    function handleNavLinkClick(linkElement, event) {
        if (event) event.preventDefault();
        updateLinkTextAndActiveClass(linkElement);
        positionMover(linkElement); // Selalu posisikan mover saat klik

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
            updateLinkTextAndActiveClass(currentActiveLink);
            positionMover(currentActiveLink);
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
                if (currentActiveLink) currentActiveLink.classList.add('active-state');
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
        if (newActiveLink) {
            // Update kelas teks dan status aktif
            if (newActiveLink !== currentActiveLink) {
                updateLinkTextAndActiveClass(newActiveLink);
            }
            // Selalu update posisi mover ke link yang sesuai dengan section saat scroll,
            // ini akan memastikan mover mengikuti bahkan jika mouse tidak di atas navigasi.
            positionMover(newActiveLink);
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


    // --- AWAL LOGIKA CHATBOX (Mobile & Desktop) ---
    const chatboxOverlay = document.getElementById('chatbox-overlay');
    const chatboxToggle = document.getElementById('chatbox-toggle');
    const chatboxContainer = document.getElementById('chatbox-container');
    const closeChatButton = document.getElementById('close-chat');
    const mobileChatMessages = document.getElementById('chatbox-messages');
    const mobileChatInput = document.getElementById('chatbox-input');
    const mobileChatSendButton = document.getElementById('chatbox-send');

    const desktopChatSection = document.getElementById('desktop-chat-section');
    const desktopChatMessages = document.getElementById('desktop-chat-messages');
    const desktopChatInput = document.getElementById('desktop-chat-input');
    const desktopChatSendButton = document.getElementById('desktop-chat-send');

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

    function addMessageToChatUI(text, sender, messagesContainerEl) {
        if (!messagesContainerEl) return;
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
                    if (messagesContainerEl) messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
                    setTimeout(typeCharacter, typingSpeed);
                }
            }
            typeCharacter();
        } else {
            messageElement.textContent = text;
            if (messagesContainerEl) messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
        }
        if (messagesContainerEl) messagesContainerEl.appendChild(messageElement);
    }

    function showTypingIndicatorIn(messagesContainerEl) {
        if (!messagesContainerEl) return null;
        removeTypingIndicatorFrom(messagesContainerEl);
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('ai-typing-indicator');
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('span');
            dot.classList.add('typing-dot');
            typingIndicator.appendChild(dot);
        }
        messagesContainerEl.appendChild(typingIndicator);
        messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
        return typingIndicator;
    }

    function removeTypingIndicatorFrom(messagesContainerEl) {
        if (messagesContainerEl) {
            const typingIndicator = messagesContainerEl.querySelector('.ai-typing-indicator');
            if (typingIndicator) {
                messagesContainerEl.removeChild(typingIndicator);
            }
        }
    }

    async function handleSendMessage(inputText, currentChatHistory, messagesContainer, inputField, sendButton) {
        const userMessageText = inputText.trim();
        if (userMessageText === '') return;

        addMessageToChatUI(userMessageText, 'user', messagesContainer);
        currentChatHistory.push({ role: "user", parts: [{ text: userMessageText }] });
        if (inputField) inputField.value = '';
        if (sendButton) sendButton.disabled = true;

        const originalButtonContent = sendButton ? sendButton.innerHTML : '';
        if (sendButton) sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        const typingIndicator = showTypingIndicatorIn(messagesContainer);

        try {
            const apiKey = "AIzaSyBm0uMkgPJpiG04snGbXAQNmsISivlQ8mw";
            if (!apiKey) {
                addMessageToChatUI('Error: API Key belum dikonfigurasi.', 'ai', messagesContainer);
                console.error("API Key is not configured in script.js.");
                if (sendButton) {
                    sendButton.disabled = false;
                    sendButton.innerHTML = originalButtonContent;
                }
                removeTypingIndicatorFrom(messagesContainer);
                return;
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const payload = { contents: currentChatHistory };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            removeTypingIndicatorFrom(messagesContainer);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error dari API:', errorData);
                const displayError = errorData?.error?.message || `Gagal menghubungi AI. Status: ${response.status}`;
                addMessageToChatUI(displayError, 'ai', messagesContainer);
                currentChatHistory.push({ role: "model", parts: [{ text: displayError }] });
                return;
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponseText = result.candidates[0].content.parts[0].text;
                addMessageToChatUI(aiResponseText, 'ai', messagesContainer);
                currentChatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
            } else if (result.candidates && result.candidates.length > 0 && result.candidates[0].finishReason === "SAFETY") {
                const safetyMessage = "Respons saya diblokir karena alasan keamanan. Silakan coba pertanyaan lain.";
                addMessageToChatUI(safetyMessage, 'ai', messagesContainer);
                currentChatHistory.push({ role: "model", parts: [{ text: safetyMessage }] });
            }
            else {
                console.error('Struktur respons tidak diharapkan:', result);
                addMessageToChatUI('Maaf, saya tidak dapat memproses permintaan Anda saat ini (format respons tidak sesuai).', 'ai', messagesContainer);
                currentChatHistory.push({ role: "model", parts: [{ text: 'Maaf, saya tidak dapat memproses permintaan Anda saat ini (format respons tidak sesuai).' }] });
            }

        } catch (error) {
            console.error('Error saat memanggil Gemini API:', error);
            removeTypingIndicatorFrom(messagesContainer);
            addMessageToChatUI(`Maaf, terjadi masalah: ${error.message}`, 'ai', messagesContainer);
        } finally {
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.innerHTML = originalButtonContent;
            }
            if (inputField && (inputField.id === 'desktop-chat-input')) {
                inputField.focus();
            }
        }
    }

    // Inisialisasi Chatbox Mobile (Floating)
    if (chatboxToggle && chatboxContainer && closeChatButton && mobileChatMessages && mobileChatInput && mobileChatSendButton) {
        console.log("Inisialisasi chatbox mobile.");
        let mobileChatHistory = [
            { role: "user", parts: [{ text: systemInstructions }] },
            { role: "model", parts: [{ text: initialAiGreeting }] }
        ];

        if (mobileChatMessages) {
            mobileChatMessages.innerHTML = '';
            addMessageToChatUI(initialAiGreeting, 'ai', mobileChatMessages);
        }

        chatboxToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            chatboxContainer.classList.toggle('open');
            if (chatboxOverlay) {
                if (chatboxContainer.classList.contains('open')) {
                    chatboxOverlay.classList.add('visible');
                } else {
                    chatboxOverlay.classList.remove('visible');
                }
            }
            document.body.classList.toggle('no-scroll', chatboxContainer.classList.contains('open'));

            if (chatboxContainer.classList.contains('open')) {
                chatboxToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
            }
        });
        closeChatButton.addEventListener('click', () => {
            chatboxContainer.classList.remove('open');
            if (chatboxOverlay) {
                chatboxOverlay.classList.remove('visible');
            }
            document.body.classList.remove('no-scroll');
            chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
        });

        if (chatboxOverlay) {
            chatboxOverlay.addEventListener('click', () => {
                chatboxContainer.classList.remove('open');
                chatboxOverlay.classList.remove('visible');
                document.body.classList.remove('no-scroll');
                chatboxToggle.innerHTML = '<i class="fas fa-comments"></i>';
            });
        }

        mobileChatSendButton.addEventListener('click', () => handleSendMessage(mobileChatInput.value, mobileChatHistory, mobileChatMessages, mobileChatInput, mobileChatSendButton));
        mobileChatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !mobileChatSendButton.disabled) {
                handleSendMessage(mobileChatInput.value, mobileChatHistory, mobileChatMessages, mobileChatInput, mobileChatSendButton);
            }
        });
    } else {
        console.warn('Elemen untuk chatbox mobile tidak lengkap.');
    }

    // Inisialisasi Chatbox Desktop (Integrated)
    if (desktopChatMessages && desktopChatInput && desktopChatSendButton) {
        console.log("Desktop chat elements FOUND. Initializing desktop chat.");
        let desktopInternalChatHistory = [
            { role: "user", parts: [{ text: systemInstructions }] },
            { role: "model", parts: [{ text: initialAiGreeting }] }
        ];

        desktopChatMessages.innerHTML = '';
        addMessageToChatUI(initialAiGreeting, 'ai', desktopChatMessages);
        console.log("Desktop chat initial greeting added.");

        desktopChatSendButton.addEventListener('click', () => {
            console.log("Desktop chat SEND BUTTON CLICKED.");
            handleSendMessage(desktopChatInput.value, desktopInternalChatHistory, desktopChatMessages, desktopChatInput, desktopChatSendButton);
        });
        desktopChatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !desktopChatSendButton.disabled) {
                console.log("Desktop chat INPUT ENTER PRESSED.");
                handleSendMessage(desktopChatInput.value, desktopInternalChatHistory, desktopChatMessages, desktopChatInput, desktopChatSendButton);
            }
        });
        console.log("Desktop chat event listeners attached.");
    } else {
        console.warn("One or more DESKTOP chat elements NOT FOUND.");
        if (!desktopChatMessages) console.warn("desktop-chat-messages not found");
        if (!desktopChatInput) console.warn("desktop-chat-input not found");
        if (!desktopChatSendButton) console.warn("desktop-chat-send not found");
    }
    // --- AKHIR LOGIKA CHATBOX ---
});
