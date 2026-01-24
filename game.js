// Гласные буквы (снизу вверх)
const vowels = ['А', 'О', 'У', 'И', 'Ы', 'Э', 'Я', 'Ё', 'Ю', 'Е'];

// Согласные для выбора
const consonants = ['М', 'Н', 'П', 'Б', 'К', 'Т', 'Д', 'С', 'Л', 'Р'];

// Состояние игры
let selectedConsonant = '';
let currentFloor = 0;
let isMoving = false;
let collectedSyllables = [];

// Элементы DOM
const selectionScreen = document.getElementById('selectionScreen');
const gameScreen = document.getElementById('gameScreen');
const consonantsGrid = document.getElementById('consonantsGrid');
const building = document.getElementById('building');
const syllableDisplay = document.getElementById('syllableDisplay');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const changeLetterBtn = document.getElementById('changeLetterBtn');
const victoryOverlay = document.getElementById('victoryOverlay');
const victorySyllables = document.getElementById('victorySyllables');
const playAgainBtn = document.getElementById('playAgainBtn');
const chooseLetterBtn = document.getElementById('chooseLetterBtn');

// Инициализация экрана выбора
function initSelectionScreen() {
    consonantsGrid.innerHTML = '';
    consonants.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'consonant-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => selectConsonant(letter));
        consonantsGrid.appendChild(btn);
    });
}

// Выбор согласной
function selectConsonant(letter) {
    selectedConsonant = letter;
    currentFloor = 0;
    collectedSyllables = [];
    selectionScreen.classList.add('hidden');
    gameScreen.classList.add('active');
    initBuilding();
    updateSyllableDisplay();
    updateButtons();
}

// Инициализация здания
function initBuilding() {
    building.innerHTML = '';

    // Финишный этаж (чердак)
    const roofFloor = document.createElement('div');
    roofFloor.className = 'floor roof-floor';

    const roofNumber = document.createElement('div');
    roofNumber.className = 'floor-number';
    roofNumber.textContent = vowels.length + 1;

    const roofShaft = document.createElement('div');
    roofShaft.className = 'shaft';

    const finishFlag = document.createElement('div');
    finishFlag.className = 'vowel finish-flag';
    finishFlag.innerHTML = '&#127937;'; // Флаг финиша

    const roofWindow = document.createElement('div');
    roofWindow.className = 'window';

    roofFloor.appendChild(roofNumber);
    roofFloor.appendChild(roofShaft);
    roofFloor.appendChild(finishFlag);
    roofFloor.appendChild(roofWindow);
    building.appendChild(roofFloor);

    // Создаём этажи с гласными сверху вниз
    for (let i = vowels.length - 1; i >= 0; i--) {
        const floor = document.createElement('div');
        floor.className = 'floor';

        const floorNumber = document.createElement('div');
        floorNumber.className = 'floor-number';
        floorNumber.textContent = i + 1;

        const shaft = document.createElement('div');
        shaft.className = 'shaft';

        const vowel = document.createElement('div');
        vowel.className = 'vowel';
        vowel.textContent = vowels[i];

        floor.appendChild(floorNumber);
        floor.appendChild(shaft);
        floor.appendChild(vowel);

        // Добавляем дверь на первом этаже, балконы и окна на остальных
        if (i === 0) {
            // Входная дверь на первом этаже
            const entrance = document.createElement('div');
            entrance.className = 'entrance';
            floor.appendChild(entrance);
        } else if (i % 3 === 1) {
            // Балкон на этажах 2, 5, 8
            const balcony = document.createElement('div');
            balcony.className = 'balcony';
            balcony.innerHTML = '<div class="balcony-window"></div><div class="balcony-rail"></div>';
            floor.appendChild(balcony);
        } else {
            // Обычное окно
            const window1 = document.createElement('div');
            window1.className = 'window';
            floor.appendChild(window1);
        }

        building.appendChild(floor);
    }

    // Добавляем лифт
    const elevatorWrapper = document.createElement('div');
    elevatorWrapper.className = 'elevator-wrapper';
    elevatorWrapper.id = 'elevatorWrapper';

    const elevator = document.createElement('div');
    elevator.className = 'elevator';
    elevator.id = 'elevator';
    elevator.textContent = selectedConsonant;

    elevatorWrapper.appendChild(elevator);
    building.appendChild(elevatorWrapper);

    updateElevatorPosition();
}

// Обновление позиции лифта
function updateElevatorPosition() {
    const elevator = document.getElementById('elevator');
    const floorHeight = 55; // Высота этажа

    // Позиция снизу (0 = нижний этаж)
    const bottomPosition = currentFloor * floorHeight + 5;
    elevator.style.bottom = bottomPosition + 'px';
}

// Обновление отображения слога
function updateSyllableDisplay() {
    // На крыше не показываем слог
    if (currentFloor >= vowels.length) {
        syllableDisplay.textContent = '🏆';
        return;
    }

    const syllable = selectedConsonant + vowels[currentFloor];
    syllableDisplay.textContent = syllable;
    syllableDisplay.classList.remove('pop');
    void syllableDisplay.offsetWidth; // Trigger reflow
    syllableDisplay.classList.add('pop');

    // Добавляем слог в коллекцию
    if (!collectedSyllables.includes(syllable)) {
        collectedSyllables.push(syllable);
    }
}

// Обновление состояния кнопок
function updateButtons() {
    upBtn.disabled = isMoving || currentFloor >= vowels.length;
    downBtn.disabled = isMoving || currentFloor <= 0;
}

// Движение вверх
function moveUp() {
    if (isMoving || currentFloor >= vowels.length) return;
    isMoving = true;
    currentFloor++;
    updateElevatorPosition();

    setTimeout(() => {
        isMoving = false;
        updateSyllableDisplay();
        updateButtons();

        // Проверка победы (достигли крыши)
        if (currentFloor === vowels.length) {
            setTimeout(showVictory, 500);
        }
    }, 400);

    updateButtons();
}

// Движение вниз
function moveDown() {
    if (isMoving || currentFloor <= 0) return;
    isMoving = true;
    currentFloor--;
    updateElevatorPosition();

    setTimeout(() => {
        isMoving = false;
        updateSyllableDisplay();
        updateButtons();
    }, 400);

    updateButtons();
}

// Показ экрана победы
function showVictory() {
    playVictorySound();
    createConfetti();

    // Показываем все собранные слоги
    victorySyllables.innerHTML = '';
    collectedSyllables.forEach((syllable, index) => {
        const span = document.createElement('span');
        span.className = 'victory-syllable';
        span.textContent = syllable;
        span.style.animationDelay = (index * 0.1) + 's';
        victorySyllables.appendChild(span);
    });

    victoryOverlay.classList.add('active');
}

// Звук победы с использованием Web Audio API
function playVictorySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Мелодия победы
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const duration = 0.2;

        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + index * duration;
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);

            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Создание конфетти
function createConfetti() {
    const colors = ['#a8c5b8', '#8fb3a1', '#d4c5b5', '#f5e6d3', '#7a9a8a'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        const size = (Math.random() * 10 + 5) + 'px';
        confetti.style.width = size;
        confetti.style.height = size;

        document.body.appendChild(confetti);

        // Анимация падения
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 720 - 360;
        const horizontalMovement = Math.random() * 200 - 100;

        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${horizontalMovement}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        }).onfinish = () => confetti.remove();
    }
}

// Возврат к выбору буквы
function goToSelection() {
    gameScreen.classList.remove('active');
    selectionScreen.classList.remove('hidden');
    victoryOverlay.classList.remove('active');
}

// Играть снова
function playAgain() {
    victoryOverlay.classList.remove('active');
    currentFloor = 0;
    collectedSyllables = [];
    updateElevatorPosition();
    setTimeout(() => {
        updateSyllableDisplay();
        updateButtons();
    }, 400);
}

// Обработчики событий
upBtn.addEventListener('click', moveUp);
downBtn.addEventListener('click', moveDown);
changeLetterBtn.addEventListener('click', goToSelection);
playAgainBtn.addEventListener('click', playAgain);
chooseLetterBtn.addEventListener('click', goToSelection);

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    if (!gameScreen.classList.contains('active')) return;
    if (victoryOverlay.classList.contains('active')) return;

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveUp();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
    }
});

// Запуск
initSelectionScreen();
