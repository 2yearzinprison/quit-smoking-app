let startDate = localStorage.getItem('quitStartDate');
let isStarted = startDate ? true : false;

const CIGARETTES_PER_DAY = 20;
const PACK_PRICE = 170;
const SECONDS_PER_DAY = 24 * 60 * 60;
const MONEY_PER_SECOND = PACK_PRICE / SECONDS_PER_DAY;

// Для анимации
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
function animateTo(targetDays, targetCigarettes, targetMoney, targetTime) {
    let animated = false;
    
    // Дни
    if (Math.abs(currentDays - targetDays) > 0) {
        currentDays += targetDays > currentDays ? 1 : -1;
        document.getElementById('days').textContent = currentDays;
        animated = true;
    }
    
    // Сигареты
    if (Math.abs(currentCigarettes - targetCigarettes) > 0) {
        currentCigarettes += targetCigarettes > currentCigarettes ? 1 : -1;
        document.getElementById('cigarettes').textContent = currentCigarettes;
        animated = true;
    }
    
    // Деньги
    if (Math.abs(currentMoney - targetMoney) > 0) {
        currentMoney += targetMoney > currentMoney ? 1 : -1;
        document.getElementById('saved').textContent = currentMoney.toLocaleString() + ' ₽';
        animated = true;
    }
    
    // Время
    if (currentTime.seconds !== targetTime.seconds) {
        currentTime.seconds = targetTime.seconds;
        animated = true;
    }
    if (currentTime.minutes !== targetTime.minutes) {
        currentTime.minutes = targetTime.minutes;
        animated = true;
    }
    if (currentTime.hours !== targetTime.hours) {
        currentTime.hours = targetTime.hours;
        animated = true;
    }
    
    if (animated) {
        document.getElementById('time').textContent = 
            `${currentTime.hours.toString().padStart(2, '0')}:${currentTime.minutes.toString().padStart(2, '0')}:${currentTime.seconds.toString().padStart(2, '0')}`;
    }
    
    return !animated; // true если всё дошло до цели
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isStarted) {
        currentDays = 0;
        currentCigarettes = 0;
        currentMoney = 0;
        currentTime = { hours: 0, minutes: 0, seconds: 0 };
        
        document.getElementById('days').textContent = '0';
        document.getElementById('time').textContent = '00:00:00';
        document.getElementById('saved').textContent = '0 ₽';
        document.getElementById('cigarettes').textContent = '0';
        document.getElementById('dailyFact').textContent = 'Нажми "Я БРОСИЛ!" чтобы начать отсчёт';
        startBtn.textContent = '🚭 Я БРОСИЛ!';
        startBtn.classList.remove('started');
        return;
    }
    
    startBtn.textContent = '✅ Отлично! Продолжай!';
    startBtn.classList.add('started');
    
    // РЕАЛЬНЫЙ РАСЧЁТ
    const now = Date.now();
    const diff = now - startDate;
    const totalSeconds = Math.floor(diff / 1000);
    
    const targetDays = Math.floor(totalSeconds / SECONDS_PER_DAY);
    const targetCigarettes = Math.floor((totalSeconds / SECONDS_PER_DAY) * CIGARETTES_PER_DAY);
    const targetMoney = Math.floor(totalSeconds * MONEY_PER_SECOND);
    
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    const targetTime = {
        hours: Math.floor(remainingSeconds / 3600),
        minutes: Math.floor((remainingSeconds % 3600) / 60),
        seconds: remainingSeconds % 60
    };
    
    // АНИМАЦИЯ (каждые 50мс для плавности)
    const animationDone = animateTo(targetDays, targetCigarettes, targetMoney, targetTime);
    
    // Факт дня
    const factKey = `fact_${targetDays}`;
    let dailyFact = localStorage.getItem(factKey);
    if (!dailyFact) {
        dailyFact = getRandomFact();
        localStorage.setItem(factKey, dailyFact);
    }
    document.getElementById('dailyFact').textContent = dailyFact;
    
    // Если анимация закончена, обновляем цели
    if (animationDone) {
        currentDays = targetDays;
        currentCigarettes = targetCigarettes;
        currentMoney = targetMoney;
        currentTime = { ...targetTime };
    }
}

function startQuit() {
    if (!isStarted) {
        startDate = Date.now();
        localStorage.setItem('quitStartDate', startDate);
        isStarted = true;
        currentDays = currentCigarettes = currentMoney = 0;
        currentTime = { hours: 0, minutes: 0, seconds: 0 };
        updateUI();
    }
}

function resetCounter() {
    if (confirm('Сбросить счётчик? Это нельзя будет отменить!')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fact_') || key === 'quitStartDate') {
                localStorage.removeItem(key);
            }
        });
        startDate = null;
        isStarted = false;
        currentDays = currentCigarettes = currentMoney = 0;
        currentTime = { hours: 0, minutes: 0, seconds: 0 };
        updateUI();
    }
}

// ОСНОВНОЙ ЦИКЛ: каждую СЕКУНДУ считаем, каждые 50мс анимируем
setInterval(() => {
    if (isStarted) {
        updateUI();
    }
}, 1000);

// Анимация: каждые 50мс
setInterval(() => {
    if (isStarted) {
        const now = Date.now();
        const diff = now - startDate;
        const totalSeconds = Math.floor(diff / 1000);
        
        const targetDays = Math.floor(totalSeconds / SECONDS_PER_DAY);
        const targetCigarettes = Math.floor((totalSeconds / SECONDS_PER_DAY) * CIGARETTES_PER_DAY);
        const targetMoney = Math.floor(totalSeconds * MONEY_PER_SECOND);
        
        const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
        const targetTime = {
            hours: Math.floor(remainingSeconds / 3600),
            minutes: Math.floor((remainingSeconds % 3600) / 60),
            seconds: remainingSeconds % 60
        };
        
        animateTo(targetDays, targetCigarettes, targetMoney, targetTime);
    }
}, 50);

// Инициализация
updateUI();
