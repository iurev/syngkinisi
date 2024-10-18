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
  const size = Math.max(
    initialSize * (1 - Math.log(elemCount) / Math.log(100)),
    minSize
  );    
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
      const size = calculateSize(selectedEmotions.length);

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

const container = document.getElementById('emoji-container');

async function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (!code) {
      window.location.href = '/authorize';
  }
  
  const response = await fetch('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  return response.json();
}

async function createNote() {
  const tokenData = await getToken();
  const token = tokenData.access_token;

  const taskData = {
    title: 'test 😁',
    content: 'test task',
    tags: ['test'],
    list: 'Test List',
    startDate: new Date().toISOString()
  };

  const response = await fetch('/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, taskData })
  });

  if (response.ok) {
    console.log('Task created successfully');
  } else {
    console.error('Failed to create task');
  }
}

container.addEventListener("click", () => {
  createNote();
});
