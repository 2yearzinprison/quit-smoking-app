let startDate = localStorage.getItem('quitStartDate');
let isStarted = startDate ? true : false;

const CIGARETTES_PER_DAY = 20;
const PACK_PRICE = 170;
const SECONDS_PER_DAY = 24 * 60 * 60;
const MONEY_PER_SECOND = PACK_PRICE / SECONDS_PER_DAY;

// Целевые значения для анимации
let targetDays = 0;
let targetCigarettes = 0;
let targetMoney = 0;
let targetTime = { hours: 0, minutes: 0, seconds: 0 };

// Текущие значения (для плавной анимации)
let currentDays = 0;
let currentCigarettes = 0;
let currentMoney = 0;
let currentTime = { hours: 0, minutes: 0, seconds: 0 };

function getRandomFact() {
    const allFacts = [
        "Через 20 минут: нормализуется давление и пульс",
        "Через 8 часов: уровень кислорода в крови возвращается к норме",
        "Через 24 часа: риск сердечного приступа снижается",
        "Через 48 часов: обоняние и вкус начинают восстанавливаться",
        "Через 72 часа: бронхи начинают расслабляться, дышать легче",
        "Через 2 недели: улучшается кровообращение, лёгкие работают лучше",
        "Через 1 месяц: кашель уменьшается, лёгкие очищаются",
        "Через 3 месяца: лёгкие функционируют на 30% лучше",
        "Через 9 месяцев: риск респираторных инфекций падает вдвое",
        "Через 1 год: риск коронарной болезни сердца уменьшается вдвое",
        "Через 5 лет: риск инсульта снижается до уровня некурящего",
        "Через 10 лет: риск рака лёгких уменьшается на 50%",
        "Через 15 лет: риск сердечных заболеваний как у некурящего",
        "Каждый день без сигарет — это +11 минут жизни!",
        "Сигареты содержат 4000+ химикатов, 60 из них — канцерогены",
        "Никотин — один из самых сильных ядов для нервной системы",
        "У курильщиков кожа стареет в 2 раза быстрее",
        "Курение крадёт 10 лет жизни в среднем",
        "Через 1 день без курения печень начинает регенерировать",
        "Каждый выкуренный блок — минус 2 дня жизни",
        "Одна сигарета отравляет организм на 25 минут",
        "Курение повышает риск инфаркта в 4 раза",
        "Через 72 часа без никотина нервная система успокаивается",
        "Лёгкие курильщика покрыты смолой толщиной 1 мм",
        "Ты уже сэкономил на сигаретах больше, чем многие за месяц!",
        "Каждый день без курения твои лёгкие дышат свободнее",
        "Ты уже на пути к более здоровому сердцу и сосудам",
        "Каждый отказ от сигареты — это победа над зависимостью"
    ];
    return allFacts[Math.floor(Math.random() * allFacts.length)];
}

// Плавная анимация чисел
function animateNumbers() {
    // Анимация дней
    if (Math.abs(currentDays - targetDays) > 0) {
        const increment = targetDays > currentDays ? 1 : -1;
        currentDays += increment;
        document.getElementById('days').textContent = currentDays;
    }
    
    // Анимация сигарет
    if (Math.abs(currentCigarettes - targetCigarettes) > 0) {
        const increment = targetCigarettes > currentCigarettes ? 1 : -1;
        currentCigarettes += increment;
        document.getElementById('cigarettes').textContent = currentCigarettes;
    }
    
    // Анимация денег
    if (Math.abs(currentMoney - targetMoney) > 0) {
        const increment = targetMoney > currentMoney ? 1 : -1;
        currentMoney += increment;
        document.getElementById('saved').textContent = currentMoney.toLocaleString() + ' ₽';
    }
    
    // Анимация времени
    if (currentTime.hours !== targetTime.hours ||
        currentTime.minutes !== targetTime.minutes ||
        currentTime.seconds !== targetTime.seconds) {
        
        if (currentTime.seconds !== targetTime.seconds) {
            currentTime.seconds += targetTime.seconds > currentTime.seconds ? 1 : -1;
            if (currentTime.seconds > 59) currentTime.seconds = 0;
            if (currentTime.seconds < 0) currentTime.seconds = 59;
        } else if (currentTime.minutes !== targetTime.minutes) {
            currentTime.minutes += targetTime.minutes > currentTime.minutes ? 1 : -1;
            if (currentTime.minutes > 59) currentTime.minutes = 0;
            if (currentTime.minutes < 0) currentTime.minutes = 59;
            currentTime.seconds = 0;
        } else if (currentTime.hours !== targetTime.hours) {
            currentTime.hours += targetTime.hours > currentTime.hours ? 1 : -1;
            if (currentTime.hours > 23) currentTime.hours = 0;
            if (currentTime.hours < 0) currentTime.hours = 23;
            currentTime.minutes = 0;
            currentTime.seconds = 0;
        }
        
        document.getElementById('time').textContent = 
            `${currentTime.hours.toString().padStart(2, '0')}:${currentTime.minutes.toString().padStart(2, '0')}:${currentTime.seconds.toString().padStart(2, '0')}`;
    }
}

// Основной расчет и обновление
function updateUI() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isStarted) {
        // Сброс анимации
        targetDays = currentDays = 0;
        targetCigarettes = currentCigarettes = 0;
        targetMoney = currentMoney = 0;
        targetTime = currentTime = { hours: 0, minutes: 0, seconds: 0 };
        animateNumbers();
        
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
    
    // Целевые значения (реальный расчет)
    targetDays = Math.floor(totalSeconds / SECONDS_PER_DAY);
    targetCigarettes = Math.floor((totalSeconds / SECONDS_PER_DAY) * CIGARETTES_PER_DAY);
    targetMoney = Math.floor(totalSeconds * MONEY_PER_SECOND);
    
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    targetTime.hours = Math.floor(remainingSeconds / 3600);
    targetTime.minutes = Math.floor((remainingSeconds % 3600) / 60);
    targetTime.seconds = remainingSeconds % 60;
    
    // Анимация
    animateNumbers();
    
    // Факт дня
    const factKey = `fact_${targetDays}`;
    let dailyFact = localStorage.getItem(factKey);
    if (!dailyFact) {
        dailyFact = getRandomFact();
        localStorage.setItem(factKey, dailyFact);
    }
    document.getElementById('dailyFact').textContent = dailyFact;
}

function startQuit() {
    if (!isStarted) {
        startDate = Date.now();
        localStorage.setItem('quitStartDate', startDate);
        isStarted = true;
        updateUI();
    }
}

// Обновление каждые 100мс для плавности
updateUI();
setInterval(updateUI, 100);

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
