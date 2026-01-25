// Гласные буквы (снизу вверх)
const vowels = ['А', 'О', 'У', 'И', 'Е', 'Ы', 'Ю', 'Э', 'Я', 'Ё'];

// Согласные для выбора
const consonants = ['М', 'Н', 'П', 'Б', 'К', 'Т', 'Д', 'С', 'Л', 'Р'];

// Цветовые схемы для каждой согласной
const colorSchemes = {
    'М': { // Изумрудный зелёный
        dark: '#5a7a6a',
        primary: '#7a9a8a',
        light: '#a8c5b8',
        lighter: '#8fb3a1',
        iconFilter: 'brightness(0) saturate(100%) invert(48%) sepia(12%) saturate(621%) hue-rotate(107deg) brightness(92%) contrast(86%)'
    },
    'Н': { // Синий
        dark: '#4a6a8a',
        primary: '#6a8aaa',
        light: '#9ab8d8',
        lighter: '#7fa0c0',
        iconFilter: 'brightness(0) saturate(100%) invert(42%) sepia(15%) saturate(749%) hue-rotate(175deg) brightness(93%) contrast(88%)'
    },
    'П': { // Фиолетовый
        dark: '#6a5a7a',
        primary: '#8a7a9a',
        light: '#b8a8c8',
        lighter: '#9f8fb0',
        iconFilter: 'brightness(0) saturate(100%) invert(39%) sepia(10%) saturate(749%) hue-rotate(233deg) brightness(94%) contrast(88%)'
    },
    'Б': { // Индиго
        dark: '#4a4a7a',
        primary: '#6a6a9a',
        light: '#a0a0c8',
        lighter: '#8888b0',
        iconFilter: 'brightness(0) saturate(100%) invert(31%) sepia(15%) saturate(749%) hue-rotate(206deg) brightness(95%) contrast(88%)'
    },
    'К': { // Коралловый
        dark: '#8a5a5a',
        primary: '#aa7a7a',
        light: '#d8a8a8',
        lighter: '#c09090',
        iconFilter: 'brightness(0) saturate(100%) invert(40%) sepia(15%) saturate(749%) hue-rotate(314deg) brightness(94%) contrast(88%)'
    },
    'Т': { // Оранжевый
        dark: '#8a6a4a',
        primary: '#aa8a6a',
        light: '#d8c0a0',
        lighter: '#c0a888',
        iconFilter: 'brightness(0) saturate(100%) invert(45%) sepia(15%) saturate(749%) hue-rotate(357deg) brightness(92%) contrast(88%)'
    },
    'Д': { // Золотистый
        dark: '#7a7a4a',
        primary: '#9a9a6a',
        light: '#c8c8a0',
        lighter: '#b0b088',
        iconFilter: 'brightness(0) saturate(100%) invert(50%) sepia(15%) saturate(621%) hue-rotate(22deg) brightness(92%) contrast(88%)'
    },
    'С': { // Бирюзовый
        dark: '#4a7a7a',
        primary: '#6a9a9a',
        light: '#a0c8c8',
        lighter: '#88b0b0',
        iconFilter: 'brightness(0) saturate(100%) invert(48%) sepia(12%) saturate(621%) hue-rotate(131deg) brightness(92%) contrast(86%)'
    },
    'Л': { // Лавандовый
        dark: '#6a5a8a',
        primary: '#8a7aaa',
        light: '#b8a8d8',
        lighter: '#a090c0',
        iconFilter: 'brightness(0) saturate(100%) invert(39%) sepia(12%) saturate(749%) hue-rotate(220deg) brightness(94%) contrast(88%)'
    },
    'Р': { // Мятный
        dark: '#4a7a6a',
        primary: '#6a9a8a',
        light: '#a0c8b8',
        lighter: '#88b0a0',
        iconFilter: 'brightness(0) saturate(100%) invert(48%) sepia(12%) saturate(621%) hue-rotate(107deg) brightness(92%) contrast(86%)'
    }
};

// Применение цветовой схемы
function applyColorScheme(letter) {
    const scheme = colorSchemes[letter];
    if (!scheme) return;

    const root = document.documentElement;
    root.style.setProperty('--color-dark', scheme.dark);
    root.style.setProperty('--color-primary', scheme.primary);
    root.style.setProperty('--color-light', scheme.light);
    root.style.setProperty('--color-lighter', scheme.lighter);
    root.style.setProperty('--color-shadow', `rgba(${hexToRgb(scheme.dark)}, 0.5)`);
    root.style.setProperty('--color-shadow-light', `rgba(${hexToRgb(scheme.lighter)}, 0.4)`);
    root.style.setProperty('--icon-filter', scheme.iconFilter);
}

// Конвертация HEX в RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
}

// Данные слогов (загружаются из syllables-words.js)
const syllablesData = SYLLABLES_DATA;

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
const wordHint = document.getElementById('wordHint');
const wordIcon = document.getElementById('wordIcon');
const wordText = document.getElementById('wordText');
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

        // Применяем индивидуальный цвет кнопки
        const scheme = colorSchemes[letter];
        if (scheme) {
            btn.style.background = `linear-gradient(145deg, ${scheme.light} 0%, ${scheme.lighter} 100%)`;
            btn.style.boxShadow = `0 4px 15px rgba(${hexToRgb(scheme.lighter)}, 0.4)`;
        }

        btn.addEventListener('click', () => selectConsonant(letter));
        consonantsGrid.appendChild(btn);
    });
}

// Выбор согласной
function selectConsonant(letter) {
    selectedConsonant = letter;
    currentFloor = 0;
    collectedSyllables = [];
    applyColorScheme(letter);
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
    finishFlag.innerHTML = '<i class="fa-solid fa-flag"></i>';

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
    const bottomPosition = currentFloor * floorHeight + 6;
    elevator.style.bottom = bottomPosition + 'px';
}

// Обновление отображения слога
function updateSyllableDisplay() {
    // На крыше не показываем слог
    if (currentFloor >= vowels.length) {
        syllableDisplay.textContent = '🏆';
        wordHint.style.display = 'none';
        return;
    }

    const vowel = vowels[currentFloor];
    const syllable = selectedConsonant + vowel;
    syllableDisplay.textContent = syllable;
    syllableDisplay.classList.remove('pop');
    void syllableDisplay.offsetWidth; // Trigger reflow
    syllableDisplay.classList.add('pop');

    // Показываем иконку и слово
    const data = syllablesData[selectedConsonant]?.[vowel];
    if (data) {
        wordIcon.innerHTML = '';
        const img = document.createElement('img');
        img.src = `icons/${data.icon}.svg`;
        img.alt = data.word;
        wordIcon.appendChild(img);
        wordText.textContent = data.word;
        wordHint.style.display = 'flex';
    } else {
        wordHint.style.display = 'none';
    }

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
    const scheme = colorSchemes[selectedConsonant] || colorSchemes['М'];
    const colors = [scheme.light, scheme.lighter, scheme.primary, '#d4c5b5', '#f5e6d3'];

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
