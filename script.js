let currentLang = 'EN';
const bootMsgs = {
    'EN': ["Initializing core...", "Establishing SOC link...", "Loading Neural Engine...", "Checking Global Nodes...", "SYSTEM READY."],
    'RU': ["Инициализация ядра...", "Установка связи с SOC...", "Загрузка нейронного движка...", "Проверка глобальных узлов...", "СИСТЕМА ГОТОВА."]
};

const translations = {
    'EN': {
        'status': 'SYSTEM_ONLINE',
        'load_header': 'Network Load Analytics',
        'threat_header': 'Threat Injection',
        'mode_header': 'Operational Mode',
        'auto_btn': 'AUTONOMOUS DEFENSE',
        'feed_header': 'Global Attack Feed (Real-time)',
        'term_header': 'Live Log Terminal',
        'stat_header': 'Global Statistics',
        'stat_total': 'TOTAL INCIDENTS',
        'stat_crit': 'CRITICAL THREATS',
        'rep_header': 'Last Incident Analysis Report',
        'rep_type': 'TYPE',
        'rep_source': 'SOURCE IP',
        'rep_loc': 'LOCATION',
        'rep_status': 'SYSTEM STATUS',
        'rep_score': 'THREAT SCORE',
        'res_header': 'Countermeasures Log',
        'tip_brute': 'BRUTEFORCE: Mass password guessing to hack accounts. Uses dictionaries and automated scripts to overwhelm authentication systems.',
        'tip_sqli': 'SQLi: Injecting malicious SQL code into input fields. Allows attackers to manipulate database queries and bypass security filters.',
        'tip_ddos': 'DDOS: Distributed Denial of Service. Overwhelms the server with massive amounts of garbage traffic, making it crash or become inaccessible.',
        'tip_scan': 'SCAN: Automated probes sent to various ports to identify active services and potential entry points for further exploitation.',
        'tip_xss': 'XSS: Cross-Site Scripting. Injecting client-side scripts into web pages viewed by other users to steal session cookies or credentials.',
        'tip_ransom': 'RANSOMWARE: Malicious software designed to encrypt all data on the target system and demand payment in cryptocurrency for the decryption key.',
        'tip_phish': 'PHISHING: A fraudulent attempt to obtain sensitive information such as usernames, passwords and credit card details by disguising as a trustworthy entity.',
        'tip_zero': 'ZERO-DAY: An attack that exploits a software vulnerability which is unknown to the software developer. No patch exists until the vulnerability is discovered.'
    },
    'RU': {
        'status': 'СИСТЕМА_ОНЛАЙН',
        'load_header': 'Аналитика нагрузки сети',
        'threat_header': 'Инъекция угроз',
        'mode_header': 'Операционный режим',
        'auto_btn': 'АВТОНОМНАЯ ЗАЩИТА',
        'feed_header': 'Глобальный поток атак (Real-time)',
        'term_header': 'Терминал логов в реальном времени',
        'stat_header': 'Глобальная статистика',
        'stat_total': 'ВСЕГО ИНЦИДЕНТОВ',
        'stat_crit': 'КРИТИЧЕСКИЕ УГРОЗЫ',
        'rep_header': 'Отчет об анализе последнего инцидента',
        'rep_type': 'ТИП',
        'rep_source': 'IP ИСТОЧНИК',
        'rep_loc': 'ЛОКАЦИЯ',
        'rep_status': 'СТАТУС СИСТЕМЫ',
        'rep_score': 'ОЦЕНКА УГРОЗЫ',
        'res_header': 'Журнал контрмер',
        'tip_brute': 'BRUTEFORCE: Массовый перебор паролей для взлома учетной записи. Использует словари и автоматизированные скрипты для обхода аутентификации.',
        'tip_sqli': 'SQLi: Внедрение вредоносного SQL-кода в поля ввода. Позволяет злоумышленникам манипулировать запросами к БД и обходить фильтры безопасности.',
        'tip_ddos': 'DDOS: Распределенная атака типа «отказ в обслуживании». Перегружает сервер огромным количеством паразитного трафика.',
        'tip_scan': 'SCAN: Автоматизированные запросы на различные порты для выявления активных сервисов и потенциальных точек входа.',
        'tip_xss': 'XSS: Межсайтовый скриптинг. Внедрение клиентских скриптов на веб-страницы для кражи файлов cookie сессии или учетных данных.',
        'tip_ransom': 'RANSOMWARE: Вредоносное ПО для шифрования всех данных в системе с требованием выкупа в криптовалюте за ключ расшифровки.',
        'tip_phish': 'PHISHING: Мошенническая попытка получения конфиденциальной информации путем маскировки под доверенное лицо.',
        'tip_zero': 'ZERO-DAY: Атака на уязвимость ПО, неизвестную разработчику. Патчей не существует, пока уязвимость не будет обнаружена.'
    }
};

let msgIndex = 0;
function runBoot() {
    const logContainer = document.getElementById('boot-log');
    const lines = bootMsgs[currentLang];
    if (msgIndex < lines.length) {
        const p = document.createElement('div');
        p.innerText = `> ${lines[msgIndex]}`;
        logContainer.appendChild(p);
        msgIndex++;
        setTimeout(runBoot, 400);
    } else { 
        document.getElementById('start-btn').style.display = 'block'; 
    }
}

window.onload = runBoot;

function toggleLanguage() {
    currentLang = (currentLang === 'EN') ? 'RU' : 'EN';
    document.querySelectorAll('.lang-target').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
}

function startSystem() {
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('main-ui').style.visibility = 'visible';
    initMainLogic();
}

let totalLogs = 0;
let threatStats = { TOTAL: 0, CRIT: 0 };
const countries = ["USA", "Russia", "China", "Brazil", "Germany", "Japan", "UK", "Canada", "France", "India", "Australia", "Ukraine", "Israel", "Turkey", "Singapore"];

const canvas = document.getElementById('load-chart');
const ctx = canvas.getContext('2d');
let loadData = new Array(30).fill(0);

function initMainLogic() {
    setInterval(() => { generateNormalTraffic() }, 100);
    setInterval(() => { updateGraph() }, 1000);
    setInterval(() => { 
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
    drawGraph();
}

function addLog(msg, isAtk = false) {
    totalLogs++;
    const stream = document.getElementById('log-stream');
    const div = document.createElement('div');
    div.className = isAtk ? 'l-atk' : '';
    div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    stream.appendChild(div);
    if(stream.childNodes.length > 100) stream.removeChild(stream.firstChild);
    stream.scrollTop = stream.scrollHeight;
}

function generateNormalTraffic() {
    const ips = ["192.168.1.1", "10.0.0.42", "172.16.0.5"];
    addLog(`INBOUND: GET /status from ${ips[Math.floor(Math.random()*ips.length)]} - 200 OK`);
}

function inject(type) {
    const country = countries[Math.floor(Math.random()*countries.length)];
    const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.10.${Math.floor(Math.random()*255)}`;
    
    threatStats.TOTAL++;
    threatStats.CRIT++;
    document.getElementById(`st-TOTAL`).innerText = threatStats.TOTAL;
    document.getElementById(`st-CRIT`).innerText = threatStats.CRIT;

    const feed = document.getElementById('attack-feed');
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> <span>${country}</span> <span>${type}</span>`;
    feed.prepend(item);
    if(feed.childNodes.length > 10) feed.removeChild(feed.lastChild);

    document.getElementById('rp-type').innerText = type;
    document.getElementById('rp-ip').innerText = ip;
    document.getElementById('rp-loc').innerText = country;
    document.getElementById('rp-score').innerText = Math.floor(Math.random()*40) + 60;

    const alertMsg = currentLang === 'EN' ? `!!! ALERT: ${type} attack from ${ip} (${country})` : `!!! ТРЕВОГА: ${type} атака из ${ip} (${country})`;
    addLog(alertMsg, true);
    
    const ev = document.getElementById('event-log');
    const d = document.createElement('div');
    const blockMsg = currentLang === 'EN' ? `> [${new Date().toLocaleTimeString()}] Firewall: Blocked ${ip}` : `> [${new Date().toLocaleTimeString()}] Firewall: Заблокирован ${ip}`;
    d.innerText = blockMsg;
    ev.prepend(d);
    if(ev.childNodes.length > 20) ev.removeChild(ev.lastChild);
}

function updateGraph() {
    loadData.push(Math.floor(Math.random() * 80) + 20);
    loadData.shift();
    drawGraph();
}

function drawGraph() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = canvas.width / (loadData.length - 1);
    loadData.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height - (val / 100 * canvas.height);
        if(i === 0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    ctx.stroke();
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = "rgba(0, 242, 255, 0.1)";
    ctx.fill();
}

function toggleAuto() {
    if(document.getElementById('auto-pilot').checked) {
        const loop = () => {
            if(!document.getElementById('auto-pilot').checked) return;
            inject(['BRUTEFORCE','SQLI','DDOS','SCAN', 'XSS', 'RANSOM', 'PHISH', 'ZERO'][Math.floor(Math.random()*8)]);
            setTimeout(loop, Math.random() * 5000 + 3000);
        };
        loop();
    }
}