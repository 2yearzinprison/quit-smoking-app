let startDate = localStorage.getItem('quitStartDate');
let isStarted = startDate ? true : false;

const CIGARETTES_PER_DAY = 20;
const CIGARETTE_PRICE = 170 / 20;
const SECONDS_PER_DAY = 24 * 60 * 60;

const fallbackFacts = [
    "Через 20 минут: нормализуется давление и пульс",
    "Через 8 часов: уровень кислорода в крови возвращается к норме",
    "Через 24 часа: риск сердечного приступа снижается",
    "Через 48 часов: обоняние и вкус начинают восстанавливаться",
    "Через 72 часа: бронхи начинают расслабляться, дышать легче"
];

async function getRandomFactFromAPI() {
    try {
        const response = await fetch('https://api.quotable.io/random?tags=motivational');
        const data = await response.json();
        return `💡 "${data.content}" — ${data.author}`;
    } catch (error) {
        return fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
    }
}

function getLocalFact() {
    return fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isStarted) {
        document.getElementById('days').textContent = '0';
        document.getElementById('time').textContent = '00:00:00';
        document.getElementById('saved').textContent = '0';
        document.getElementById('cigarettes').textContent = '0';
        document.getElementById('dailyFact').textContent = 'Нажми "Я БРОСИЛ!" чтобы начать отсчёт';
        startBtn.textContent = '🚭 Я БРОСИЛ!';
        startBtn.classList.remove('started');
        return;
    }
    
    startBtn.textContent = '✅ Отлично! Продолжай!';
    startBtn.classList.add('started');
    
    const now = Date.now();
    const diff = now - startDate;
    const totalSeconds = Math.floor(diff / 1000);
    
    const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
    document.getElementById('days').textContent = days;
    
    // СИГАРЕТЫ: ОКРУГЛЯЕМ ВВЕРХ (реалистично)
    const totalDaysFraction = totalSeconds / SECONDS_PER_DAY;
    const cigarettesSaved = Math.ceil(totalDaysFraction * CIGARETTES_PER_DAY);
    document.getElementById('cigarettes').textContent = cigarettesSaved.toLocaleString();
    
    const saved = Math.floor(cigarettesSaved * CIGARETTE_PRICE);
    document.getElementById('saved').textContent = saved.toLocaleString();
    
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    document.getElementById('time').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const factKey = `fact_${days}`;
    let dailyFact = localStorage.getItem(factKey);
    
    if (!dailyFact) {
        getRandomFactFromAPI().then(fact => {
            localStorage.setItem(factKey, fact);
            document.getElementById('dailyFact').textContent = fact;
        }).catch(() => {
            const localFact = getLocalFact();
            localStorage.setItem(factKey, localFact);
            document.getElementById('dailyFact').textContent = localFact;
        });
    } else {
        document.getElementById('dailyFact').textContent = dailyFact;
    }
}

function startQuit() {
    if (!isStarted) {
        startDate = Date.now();
        localStorage.setItem('quitStartDate', startDate);
        isStarted = true;
        updateUI();
    }
}

updateUI();
setInterval(updateUI, 1000);

function resetCounter() {
    if (confirm('Сбросить счётчик? Это нельзя будет отменить!')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fact_') || key === 'quitStartDate') {
                localStorage.removeItem(key);
            }
        });
        startDate = null;
        isStarted = false;
        updateUI();
    }
}

if (isStarted) {
    updateUI();
}
