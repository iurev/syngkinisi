const emojiUrls = {
    anger: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Symbols%20on%20Mouth.png",
    sadness: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Frowning%20Face.png",
    fear: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Fearful%20Face.png",
    joy: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png",
    surprise: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Open%20Mouth.png",
    disgust: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Nauseated%20Face.png",
    trust: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Open%20Hands.png",
    anticipation: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png",
    love: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png",
    default: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Exhaling.png"
};

document.querySelectorAll('.btn-check').forEach(btn => {
    btn.addEventListener('change', updateEmojis);
});

function calculateSize(elemCount, initialSize = 180, minSize = 60) {
    if (elemCount <= 1) return initialSize;
    
    // Calculate the size using a logarithmic scale
    const size = Math.max(
      initialSize * (1 - Math.log(elemCount) / Math.log(100)),
      minSize
    );
    
    // Round the result to the nearest integer
    return Math.round(size);
  }

function updateEmojis() {
    const container = document.getElementById('emoji-container');
    container.innerHTML = '';
    let selectedEmotions = [...document.querySelectorAll('.btn-check:checked')].map(btn => btn.id);
    
    if (selectedEmotions.length === 0) {
        selectedEmotions = ["default"];
    }

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.1 * selectedEmotions.length/2;

    selectedEmotions.forEach((emotion, index) => {
        const angle = (index / selectedEmotions.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + radius * Math.sin(angle) - 50;

        const img = document.createElement('img');
        img.src = emojiUrls[emotion];
        img.alt = emotion;
        img.className = 'emoji-image';
        const size = calculateSize(selectedEmotions.length)

        img.style.left = `${x - size/2}px`;
        img.style.top = `${y - size/2}px`;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        container.appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateEmojis();
})

const clientSecret = 'LZL$8Y$7zhR2s+2x*&I787qu$Bs4Rbm(';
const clientId = 'PrD4niU8Npk4l3C5Bn';
const redirectUri = 'https://supreme-enigma-6r67xw54g62xq9j-8080.app.github.dev/';

const apiBase = 'https://api.ticktick.com/open/v1';

const container = document.getElementById('emoji-container');
function authorize() {
    const authUrl = `https://ticktick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;
  }
  
  async function getToken(code) {
    const response = await fetch('https://ticktick.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });
    return response.json();
  }
  
  async function createNote() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (!code) {
      authorize();
      return;
    }
  
    const tokenData = await getToken(code);
    const token = tokenData.access_token;
  
    const response = await fetch(`${apiBase}/task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'test',
        content: 'test',
        tags: ['moo'],
        list: 'Moo',
        startDate: new Date().toISOString()
      })
    });
  
    if (response.ok) {
      console.log('Note created successfully');
    } else {
      console.error('Failed to create note');
    }
  }
  

container.addEventListener("click", () => {
    createNote(); 
})

createNote();   

