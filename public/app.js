(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const intro = $('#introScreen');
  const site = $('#site');
  const toast = $('#toast');
  const roastText = $('#roastText');
  const roastIndex = $('.roast-index');
  const roastCount = $('#roastCount');
  const wall = $('#roastWall');
  const wallGrid = $('#roastWallGrid');
  let intensity = 1;
  let delivered = 0;
  let currentRoast = roastText.textContent;
  let soundOn = false;
  let audioContext;

  const hooks = [
    { level: 1, text: 'Manraj, tu itna overthink karta hai ki Maggi banne se pehle uska future plan bana leta hai' },
    { level: 1, text: 'Battry ka confidence Wi-Fi signal jaisa hai — room badalte hi gayab' },
    { level: 1, text: 'Tera dimaag ek browser hai jisme 47 tabs khule hain aur sab mein “kal se pakka” chal raha hai' },
    { level: 1, text: 'Tu birthday cake ko bhi life advice dega, phir advice khud ignore karega' },
    { level: 1, text: 'Manraj, tu calendar mein goals likhta hai aur alarm ko emotional support samajhta hai' },
    { level: 1, text: 'Teri productivity ka favourite workout hai — plan banana, start na karna' },
    { level: 1, text: 'Battry ko “bas paanch minute” bolo, woh poora season finale bana deta hai' },
    { level: 1, text: 'Tu itna dramatic hai ki normal Monday ko bhi interval ke baad wali entry leta hai' },
    { level: 1, text: 'Manraj, tere excuses itne polished hain ki unko award milna chahiye' },
    { level: 1, text: 'Tera attention span birthday candle se chhota aur wishlist se lamba hai' },
    { level: 1, text: 'Tu room saaf karne nikla tha, teen ghante baad childhood memories sort kar raha tha' },
    { level: 1, text: 'Battry ka “main aa raha hoon” ek genre hai, exact time nahi' },
    { level: 1, text: 'Tere dreams IMAX mein chalte hain, par execution abhi bhi 144p par hai' },
    { level: 1, text: 'Manraj, tu ek walking blooper reel hai — cute bhi, confusing bhi' },
    { level: 1, text: 'Tere phone ki battery se zyada stable sirf teri late aane ki aadat hai' },
    { level: 1, text: 'Tu advice aise collect karta hai jaise Pokémon, use kisi ko nahi karta' },
    { level: 2, text: 'Battry, tu itna confused hai ki Google Maps bhi tere liye “good luck” bolta hai' },
    { level: 2, text: 'Manraj ka logic elevator jaisa hai — kabhi top floor, kabhi basement, button koi nahi jaanta' },
    { level: 2, text: 'Tu apni life ka main character hai, bas scriptwriter har scene mein so gaya' },
    { level: 2, text: 'Tera focus ek visiting relative hai — kabhi-kabhi aata hai, zyada der tikta nahi' },
    { level: 2, text: 'Battry ke plans itne ambitious hain ki unko dekhkar calendar bhi anxiety mein chala jaata hai' },
    { level: 2, text: 'Tu har chhoti baat ka documentary bana deta hai, narrator bhi tu, villain bhi tu' },
    { level: 2, text: 'Manraj, tera “secret plan” itna obvious hota hai ki pados ka kutta bhi spoiler de de' },
    { level: 2, text: 'Teri life mein plot twists zyada aur actual plot kam hai' },
    { level: 2, text: 'Tu motivation videos dekhkar itna motivated hota hai ki doosri video laga deta hai' },
    { level: 2, text: 'Battry ka brain premium subscription hai, par login har Monday expire ho jaata hai' },
    { level: 2, text: 'Tu ek hi waqt mein late, confused aur overconfident kaise hota hai — ye science ka sawaal hai' },
    { level: 2, text: 'Manraj, tere decisions group chat ke poll jaise hain — sab vote karte hain, tu phir bhi apna karta hai' },
    { level: 2, text: 'Teri planning dekhkar NASA bolega: launch toh nahi hua, presentation kamaal hai' },
    { level: 2, text: 'Tu “kal” ka itna loyal hai ki aaj ne tujhe block kar diya' },
    { level: 2, text: 'Battry, tera common sense guest appearance karta hai aur credits mein naam bhi nahi aata' },
    { level: 2, text: 'Tere ideas Ferrari hain, par discipline puncture wali cycle' },
    { level: 3, text: 'Manraj, tu itna nalayak nahi hai — bas talent ko hibernation par bhej kar baitha hai' },
    { level: 3, text: 'Battry ka dimaag ek premium meme page hai — content unlimited, sense out of stock' },
    { level: 3, text: 'Tu har situation ko aise complicate karta hai jaise simple answer se tujhe allergy ho' },
    { level: 3, text: 'Tera confidence sher ka aur follow-through Sunday ke gym resolution ka hai' },
    { level: 3, text: 'Manraj, tu ullu ka pattha nahi — ullu ka full franchise hai, spin-off bhi pending' },
    { level: 3, text: 'Tere goals ne tujhe unfollow kar diya, kyunki tu unko sirf story mein tag karta tha' },
    { level: 3, text: 'Battry, tu har baar comeback announce karta hai aur interval mein hi snacks khane lagta hai' },
    { level: 3, text: 'Teri akal free trial par nahi, demo mode par hai — features locked, ads unlimited' },
    { level: 3, text: 'Tu apni hi life ka buffering icon hai — ghoomta bahut hai, load kuch nahi hota' },
    { level: 3, text: 'Manraj, Ujjwal ji ne beta banaya tha, tu ne usko full-time comedy channel bana diya' },
    { level: 3, text: 'Tere excuses dekhkar saale bahane bhi bolte hain: bhai, thoda realistic ho ja' },
    { level: 3, text: 'Battry, tu maximum savage ka human version hai — bas punchline ke baad khud hi offend ho jaata hai' }
  ];

  const twists = [
    'aur phir bhi attitude aisa jaise Netflix ne teri biography ke rights le liye ho',
    'jaise duniya tere next move ka wait kar rahi ho, jabki tu khud password dhoondh raha hai',
    'phir bolta hai “scene under control hai” — beta, scene ne tujhe control kar rakha hai',
    'aur is confidence ke saath ki bas ab miracle aayega, parcel tracking bhi sharma jaaye',
    'jaise har problem ka solution ek dramatic sigh aur cold drink ho',
    'phir bhi birthday par wish maangta hai: iss saal life sorted honi chahiye',
    'aur background mein teri imaginary success montage full volume par bajti rehti hai',
    'jaise common sense ko personally invite kiya tha, par woh traffic mein phans gaya',
    'phir ek naya plan banata hai aur purane plan ki yaad mein do minute silence rakhta hai',
    'aur uske baad bhi bolta hai: “trust the process” — process tujhe trust nahi karta',
    'jaise reality ek group project hai aur saara kaam universe karega',
    'phir bhi dil se bura nahi — bas dimaag se thoda unpaid intern hai'
  ];

  const endings = [
    'Bas beta, cake kaat aur thoda software update kar. 💀',
    'Ujjwal ji, aapka namoona safe hai — bas warranty khatam ho chuki hai. 🔥',
    'Happy Birthday, certified legend. Izzat ka backup humne nahi liya. 😭',
    'Aaj tera din hai, isliye roast ko bhi family discount mila hai. ☠️',
    'Nalayak, pyaar bahut hai — par content usse bhi zyada hai. 🫂',
    'Tu aise hi reh, duniya ko comedy ki zaroorat hai. 🎂',
    'Final verdict: cute sa disaster, full father-approved. ❤️',
    'Case closed — accused guilty of being too much. 💀',
    'Khinchai alag, dosti alag. Ab smile kar, Battry. ✦',
    'Tera future bright hai, bas switch tu kabhi on kar de. 🔥'
  ];

  const crushLines = [
    'Bhai ne 4 saal feelings invest ki, return mein mila experience certificate aur character development. 📉',
    'Teri love story ka season finale aa gaya, par bhai abhi tak previous episodes mein atka hai. 😭',
    '4 saal ki planning aur ending aisi jaise writer ne last episode mein project hi chhod diya.',
    'Bhai ka dil past mein hai aur calendar chillaa raha hai: MOVE ON, LEGEND.',
    'Itne saal crush ke sapne dekhe ki ab birthday cake mein bhi future planning dhoondhega. 💀',
    'Manraj ne one-sided feelings ko full cinematic universe bana diya, cameo abhi bhi pending hai.',
    'Tera dimaag har “hello” ko secret code samajhta raha — decoding team ab retire ho gayi.',
    'Crush ki file mein chaar saal ka data hai, conclusion abhi bhi: “maybe someday”.',
    'Battry ka heart slow-burn series hai — audience invested, protagonist confused.',
    'Chaar saal se imaginary shaadi ka venue dekh raha tha, pehle invitation toh bhej deta.',
    'Teri feelings ne marathon jeeta, par finish line ko pata hi nahi tha race chal rahi hai.',
    'Overthinking ka Olympic medal milta toh tu podium par bhi alternate endings soch raha hota.'
  ];

  const roasts = [];
  hooks.forEach((hook, hookIndex) => {
    twists.forEach((twist, twistIndex) => {
      const ending = endings[(hookIndex + twistIndex) % endings.length];
      roasts.push({
        text: `${hook.text}, ${twist}. ${ending}`,
        level: hook.level,
        key: `${hookIndex}-${twistIndex}`
      });
    });
  });
  // Keep the engine comfortably above the requested 300 unique lines.
  const uniqueRoasts = [...new Map(roasts.map((roast) => [roast.text, roast])).values()];
  let available = [...uniqueRoasts];
  let used = new Set();

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const ping = (frequency = 440, duration = .06) => {
    if (!soundOn) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

  const filteredRoasts = () => {
    const filtered = uniqueRoasts.filter((roast) => roast.level <= intensity + 1);
    return filtered.length ? filtered : uniqueRoasts;
  };

  const getNextRoast = () => {
    let pool = filteredRoasts().filter((roast) => !used.has(roast.key));
    if (!pool.length) {
      used.clear();
      pool = filteredRoasts();
    }
    const roast = randomItem(pool);
    used.add(roast.key);
    return roast;
  };

  const renderRoast = (roast = getNextRoast()) => {
    currentRoast = roast.text;
    delivered += 1;
    roastText.textContent = currentRoast;
    roastIndex.textContent = `ROAST #${String(delivered).padStart(3, '0')}`;
    roastCount.textContent = String(delivered).padStart(3, '0');
    roastText.animate([{ opacity: .25, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
    ping(330 + (roast.level * 80), .07);
  };

  const enterSite = () => {
    intro.classList.add('is-hidden');
    site.classList.remove('locked');
    site.classList.add('revealed');
    site.setAttribute('aria-hidden', 'false');
    document.body.classList.add('entered');
    ping(520, .1);
    window.setTimeout(() => $('#roastLab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 520);
  };

  $$('[data-enter]').forEach((button) => button.addEventListener('click', enterSite));
  $$('[data-scroll]').forEach((button) => button.addEventListener('click', () => $(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));

  $$('.segment').forEach((button) => button.addEventListener('click', () => {
    $$('.segment').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    intensity = Number(button.dataset.intensity);
    showToast(`${button.textContent} MODE LOADED`);
    ping(500, .05);
    renderRoast();
  }));

  $('#roastAgain').addEventListener('click', () => renderRoast());
  $('#copyRoast').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentRoast);
      showToast('ROAST COPIED. SEND WITH CAUTION.');
      ping(680, .06);
    } catch {
      showToast('Select the roast and copy it manually.');
    }
  });

  const buildWall = () => {
    wallGrid.innerHTML = '';
    const wallItems = [...uniqueRoasts].sort(() => Math.random() - .5).slice(0, 100);
    wallItems.forEach((roast, index) => {
      const item = document.createElement('article');
      item.className = 'wall-item';
      item.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><p>${roast.text}</p>`;
      wallGrid.appendChild(item);
    });
  };

  $('#wallBtn').addEventListener('click', () => {
    buildWall();
    wall.hidden = false;
    wall.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('100 ROASTS UNLOCKED. GOOD LUCK.');
    ping(240, .12);
  });
  $('#closeWall').addEventListener('click', () => { wall.hidden = true; $('#roastLab').scrollIntoView({ behavior: 'smooth' }); });

  const share = async () => {
    const shareData = { title: 'Operation Birthday Beizzati — Battry', text: `Manraj aka Battry, tere liye ek roast aaya hai: ${currentRoast}`, url: window.location.href.split('#')[0] + '#battry-roast' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showToast('SHARE LINK COPIED TO CLIPBOARD.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Share cancelled — roast safe for now.');
    }
  };
  $('#shareBtn').addEventListener('click', share);

  $('#crushBtn').addEventListener('click', () => {
    $('#crushQuote').textContent = randomItem(crushLines);
    $('#postmortem').animate([{ backgroundColor: 'rgba(111,69,13,.15)' }, { backgroundColor: 'transparent' }], { duration: 1000 });
    showToast('CLASSIFIED CRUSH FILE OPENED.');
    ping(260, .1);
  });
  $('#crushBtn').addEventListener('dblclick', () => $('#crushQuote').textContent = randomItem(crushLines));

  const makeConfetti = () => {
    const container = $('#confetti');
    container.innerHTML = '';
    for (let i = 0; i < 80; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 1.8}s`;
      piece.style.animationDuration = `${2.8 + Math.random() * 2.2}s`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      container.appendChild(piece);
    }
  };

  const showFinale = (message = 'GOLD MODE COMPLETE. RESPECT RESTORED.') => {
    document.body.classList.add('final-mode');
    $('#finale').hidden = false;
    makeConfetti();
    $('#finale').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(message);
    ping(780, .12);
    window.setTimeout(() => ping(980, .16), 120);
  };

  $('#finalBossBtn').addEventListener('click', () => {
    intensity = 3;
    $$('.segment').forEach((button) => button.classList.toggle('active', button.dataset.intensity === '3'));
    renderRoast();
    showFinale('FINAL BOSS DEFEATED. BATTRY STILL STANDING.');
  });
  $('#heartBtn').addEventListener('click', () => showFinale('ASLI BAAT: BETA, TU SPECIAL HAI. AB RO MAT.'));
  $('#cakeBtn').addEventListener('click', () => {
    renderRoast();
    showFinale('CAKE CUT. IZZAT ALSO CUT. HAPPY BIRTHDAY.');
    document.querySelector('.finale-seal').textContent = '🎂';
  });

  $('#soundToggle').addEventListener('click', () => {
    soundOn = !soundOn;
    $('#soundToggle').setAttribute('aria-pressed', String(soundOn));
    $('#soundToggle').textContent = soundOn ? '♫' : '♩';
    showToast(soundOn ? 'SOUND EFFECTS ON' : 'SOUND EFFECTS OFF');
    if (soundOn) ping(600, .1);
  });

  $('#replayBtn').addEventListener('click', () => {
    document.body.classList.remove('final-mode');
    $('#finale').hidden = true;
    intro.classList.remove('is-hidden');
    site.classList.add('locked');
    site.classList.remove('revealed');
    site.setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.finale-seal').textContent = '💛';
  });

  // A visible countdown makes the entry feel like an event, not a page load.
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-enter]')) return;
    const buttons = $$('[data-enter]');
    buttons.forEach((button) => { button.disabled = true; button.textContent = 'LOADING DAMAGE…'; });
    let count = 3;
    const ticker = window.setInterval(() => {
      count -= 1;
      if (count > 0) showToast(`GOLD MODE IN ${count}…`);
      else window.clearInterval(ticker);
    }, 180);
  }, { once: true });

  // Keep the initial hero line live even before the first interaction.
  if (uniqueRoasts.length < 300) console.warn('Roast engine is below the requested variation count.');
  window.__battryRoastCount = uniqueRoasts.length;
})();
