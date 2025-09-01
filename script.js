// Game state
let currentCity = null;
let score = 0;
let timer = null;
let timeLeft = 90;
let usedCities = new Set();
let gameMode = 'singleplayer';
let currentPlayer = null;
let players = [];
let currentRotation = 0;
let correctGuesses = 0;
let totalTime = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
let lastMilestoneScore = 0;
let isDragging = false;
let rotationInterval = null;
let lastMouseY = 0;
let rotationSpeed = 0;
let rotationMomentum = 0;
let lastTime = performance.now();
let miniGameInstance = null;
let hintUsedForCity = false;
// Track current active page section
let currentSection = 'intro-page';

// Player statistics
let playerStats = {
    gamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    citiesDiscovered: 0,
    rareCities: 0,
    legendaryCities: 0,
    bestTime: Infinity,
    averageTime: 0,
    accuracy: 0,
    correctGuesses: 0,
    totalGuesses: 0,
    currentGameStartTime: 0,
    currentGameScore: 0
};

// Achievement tracking
const dailyChallengeAchievements = [
    {
        id: 'dailyChallenge3',
        title: 'Daily Challenger',
        description: 'Complete 3 daily challenges in a row',
        icon: '🏆',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        target: 3
    },
    {
        id: 'dailyChallenge5',
        title: 'Daily Master',
        description: 'Complete 5 daily challenges in a row',
        icon: '🌟',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        target: 5
    },
    {
        id: 'dailyChallenge10',
        title: 'Daily Legend',
        description: 'Complete 10 daily challenges in a row',
        icon: '👑',
        rarity: 'legendary',
        unlocked: false,
        progress: 0,
        target: 10
    },
    {
        id: 'dailyChallenge30',
        title: 'Daily God',
        description: 'Complete 30 daily challenges in a row',
        icon: '⚡',
        rarity: 'ultra-rare',
        unlocked: false,
        progress: 0,
        target: 30
    }
];

// Achievements object
const achievements = {
    worldExplorer: {
        id: 'worldExplorer',
        title: 'World Explorer',
        description: 'Discover 10 different cities',
        icon: '🌍',
        progress: 0,
        total: 10,
        completed: false
    },
    rareFinds: {
        id: 'rareFinds',
        title: 'Rare Finds',
        description: 'Discover 5 rare cities',
        icon: '💎',
        progress: 0,
        total: 5,
        completed: false
    },
    dailyStreak: {
        id: 'dailyStreak',
        title: 'Daily Streak',
        description: 'Complete 3 daily tasks in a row',
        icon: '🔥',
        progress: 0,
        total: 3,
        completed: false
    },
    consistentExplorer: {
        id: 'consistentExplorer',
        title: 'Consistent Explorer',
        description: 'Complete 5 daily tasks',
        icon: '🌟',
        progress: 0,
        total: 5,
        completed: false
    },
    masterExplorer: {
        id: 'masterExplorer',
        title: 'Master Explorer',
        description: 'Complete 10 daily tasks',
        icon: '👑',
        progress: 0,
        total: 10,
        completed: false
    },
    legendaryStreak: {
        id: 'legendaryStreak',
        title: 'Legendary Streak',
        description: 'Complete 15 daily tasks in a row',
        icon: '⚡',
        progress: 0,
        total: 15,
        completed: false
    },
    taskMaster: {
        id: 'taskMaster',
        title: 'Task Master',
        description: 'Complete all types of daily tasks',
        icon: '🏆',
        progress: 0,
        total: 6,
        completed: false
    }
};

// New achievements system
const newAchievements = {
    speedDemon: {
        name: "Speed Demon 🏃",
        description: "Guess 5 cities in under 10 seconds each",
        icon: "🏃",
        rarity: "rare",
        progress: 0,
        target: 5,
        completed: false,
        globalCompletion: 12
    },
    perfectMemory: {
        name: "Perfect Memory 🧠",
        description: "Remember and correctly guess 3 cities in a row",
        icon: "🧠",
        rarity: "rare",
        progress: 0,
        target: 3,
        completed: false,
        globalCompletion: 8
    },
    worldTraveler: {
        name: "World Traveler 🌎",
        description: "Guess cities from 10 different countries",
        icon: "🌎",
        rarity: "rare",
        progress: 0,
        target: 10,
        completed: false,
        globalCompletion: 15
    },
    timeMaster: {
        name: "Time Master ⏱️",
        description: "Score over 1000 points in a single game",
        icon: "⏱️",
        rarity: "legendary",
        progress: 0,
        target: 1000,
        completed: false,
        globalCompletion: 5
    },
    citySleuth: {
        name: "City Sleuth 🔍",
        description: "Guess a city correctly with less than 5 seconds remaining",
        icon: "🔍",
        rarity: "rare",
        progress: 0,
        target: 1,
        completed: false,
        globalCompletion: 18
    },
    geographyGuru: {
        name: "Geography Guru 📚",
        description: "Complete all achievements",
        icon: "📚",
        rarity: "legendary",
        progress: 0,
        target: 1,
        completed: false,
        globalCompletion: 3
    },
    secretExplorer: {
        name: "???",
        description: "???",
        icon: "🔍",
        rarity: "ultra-rare",
        progress: 0,
        target: 1,
        completed: false,
        globalCompletion: 0.1,
        secret: true,
        hint: "Sometimes the most interesting discoveries happen when you're not looking for them..."
    }
};

// Multiplayer state
var multiplayer = {
    active: false,
    players: [],
    currentPlayer: null
};

// Sound effects
const sounds = {
    click: new Audio('sounds/click.mp3'),
    correct: new Audio('sounds/correct.mp3'),
    wrong: new Audio('sounds/wrong.mp3'),
    jump: new Audio('sounds/jump.mp3'),
    gameOver: new Audio('sounds/game-over.mp3'),
    victory: new Audio('sounds/victory.mp3')
};

// Cookie functions
function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Initialize sounds with proper volume
Object.values(sounds).forEach(sound => {
    sound.volume = 0.3;
});

// Function to check for score milestones
function checkScoreMilestone(currentScore) {
    const milestone = Math.floor(currentScore / 1000) * 1000;
    if (milestone > lastMilestoneScore && currentScore > bestScore) {
        lastMilestoneScore = milestone;
        playSound('highScore');
        alert(`New High Score Milestone: ${milestone} points!`);
    }
}

// Function to play sound with error handling
function playSound(soundName) {
    try {
        if (sounds[soundName]) {
            sounds[soundName].currentTime = 0; // Reset sound to start
            sounds[soundName].play().catch(e => console.log('Sound play prevented:', e));
        }
    } catch (e) {
        console.log('Error playing sound:', e);
    }
}

// Update click handlers to include sound (attached on DOMContentLoaded)

// DOM Elements
let introPage;
let citiesInfo;
let gamePage;
let gameModeScreen;
let victoryScreen;
let leaderboardScreen;
let achievementsPage;
let discoveryPage;
let timeDisplay;
let scoreDisplay;
let cityImage;
let guessInput;
let dailyFact;
let carousel;
let lightbox;
let lightboxImg;
let closeBtn;
let bestScoreDisplay;
let finalScoreDisplay;
let victoryBestScoreDisplay;
let correctGuessesDisplay;
let averageTimeDisplay;

// Mini Game
class CityRunner {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('miniGameHighScore')) || 0;
        this.gameLoop = null;
        this.obstacles = [];
        this.gameSpeed = 3;
        this.spawnRate = 2000;
        this.lastSpawn = 0;
        this.running = false;

        // Player properties
        this.player = {
            x: 50,
            y: this.canvas.height - 30,
            width: 30,
            height: 30,
            jumping: false,
            velocity: 0,
            gravity: 0.35,
            jumpStrength: -11
        };

        // Set canvas size
        this.resizeCanvas();
        this.updateHighScore();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Remove any existing event listeners to avoid duplicates
        document.removeEventListener('keydown', this._boundHandleKeyPress);
        
        // Bind the event handler to this instance and store it for later removal
        this._boundHandleKeyPress = this.handleKeyPress.bind(this);
        
        // Add keydown event listener to document with the bound method
        document.addEventListener('keydown', this._boundHandleKeyPress);
        
        console.log('Added keydown event listener for space bar');

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.running) {
                this.startGame();
            } else if (!this.player.jumping) {
                this.handleJump();
            }
        });

        // Initial draw
        this.drawStartScreen();
        console.log('Mini-game initialized');
    }

    handleKeyPress(e) {
        console.log('Key pressed:', e.code);
        if (e.code === 'Space') {
            e.preventDefault();
            console.log('Space bar pressed, game running:', this.running);
            if (!this.running) {
                this.startGame();
            } else if (!this.player.jumping) {
                this.handleJump();
            }
            
            // Play jump sound if game is running
            if (this.running) {
                playSound('jump');
            }
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerStyle = window.getComputedStyle(container);
        const paddingLeft = parseFloat(containerStyle.paddingLeft);
        const paddingRight = parseFloat(containerStyle.paddingRight);
        
        // Keep aspect ratio but fit container width
        const containerWidth = container.clientWidth - paddingLeft - paddingRight;
        const scale = containerWidth / 600; // 600 is the original canvas width
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = (200 * scale) + 'px';
        
        // Set actual canvas size for drawing
        this.canvas.width = containerWidth;
        this.canvas.height = 200 * scale;
        
        // Reset player position after resize
        this.player.y = this.canvas.height - this.player.height;
        
        // Redraw if not running
        if (!this.running) {
            this.drawStartScreen();
        }
    }

    drawStartScreen() {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Work Sans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, this.canvas.height / 2);
    }

    startGame() {
        if (this.running) return;
        
        console.log('Starting mini-game');
        this.running = true;
        this.score = 0;
        this.obstacles = [];
        this.gameSpeed = 3;
        this.spawnRate = 2000;
        this.lastSpawn = 0;
        this.updateScore();
        
        // Clear any existing loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        // Start the game loop
        this.gameLoop = requestAnimationFrame(() => this.update());
    }

    handleJump() {
        if (!this.player.jumping) {
            this.player.jumping = true;
            this.player.velocity = this.player.jumpStrength;
        }
    }

    spawnObstacle() {
        const height = Math.random() * 30 + 20;
        this.obstacles.push({
            x: this.canvas.width,
            y: this.canvas.height - height,
            width: 20,
            height: height
        });
    }

    update() {
        const now = performance.now();
        if (now - this.lastSpawn > this.spawnRate) {
            this.spawnObstacle();
            this.lastSpawn = now;
        }

        // Update player
        this.player.velocity += this.player.gravity;
        this.player.y += this.player.velocity;

        // Ground collision
        if (this.player.y > this.canvas.height - this.player.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.jumping = false;
            this.player.velocity = 0;
        }

        // Update obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= this.gameSpeed;
            
            // Collision detection
            if (this.checkCollision(this.player, obstacle)) {
                this.gameOver();
                return false;
            }

            return obstacle.x > -obstacle.width;
        });

        // Update score
        this.score += 0.1;
        this.updateScore();

        // Increase difficulty
        this.gameSpeed += 0.0005;
        this.spawnRate = Math.max(1000, this.spawnRate - 0.2);

        // Draw
        this.draw();

        if (this.running) {
            this.gameLoop = requestAnimationFrame(() => this.update());
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(0, this.canvas.height - 2, this.canvas.width, 2);

        // Draw player
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        // Draw obstacles
        this.ctx.fillStyle = '#ff4444';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x,
                obstacle.y,
                obstacle.width,
                obstacle.height
            );
        });
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    gameOver() {
        this.running = false;
        cancelAnimationFrame(this.gameLoop);
        
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('miniGameHighScore', this.highScore);
            this.updateHighScore();
        }

        // Draw game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Work Sans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '16px Work Sans';
        this.ctx.fillText('Press SPACE to Restart', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    updateScore() {
        document.getElementById('miniGameScore').textContent = Math.floor(this.score);
    }

    updateHighScore() {
        document.getElementById('miniGameHighScore').textContent = this.highScore;
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM fully loaded, initializing game features');
	
	// Click sound for buttons
	document.querySelectorAll('.animated-btn').forEach(btn => {
		if (!btn._soundBound) {
			btn.addEventListener('click', () => playSound('click'));
			btn._soundBound = true;
		}
	});
	
	// Ensure high score UI shows stored value
	const hs = document.getElementById('highScore');
	if (hs) hs.textContent = bestScore;
	const bs = document.getElementById('bestScore');
	if (bs) bs.textContent = bestScore;
	const vbs = document.getElementById('victoryBestScore');
	if (vbs) vbs.textContent = bestScore;
	
	// Initialize settings and daily challenge systems
	initializeSettings();
	initializeDailyChallenge();
	
	// Game navigation buttons
	const playBtn = document.getElementById('playBtn');
	if (playBtn) {
		playBtn.addEventListener('click', () => showSection('game-mode-page'));
	}
	
	const infoBtn = document.getElementById('infoBtn');
	if (infoBtn) {
		infoBtn.addEventListener('click', () => showSection('cities-info'));
	}
	
	const leaderboardBtn = document.getElementById('leaderboardBtn');
	if (leaderboardBtn) {
		leaderboardBtn.addEventListener('click', () => showSection('leaderboard-screen'));
	}
	
	const achievementsBtn = document.getElementById('achievementsBtn');
	if (achievementsBtn) {
		achievementsBtn.addEventListener('click', () => showSection('achievements-page'));
	}
	
	const discoveriesBtn = document.getElementById('discoveriesBtn');
	if (discoveriesBtn) {
		discoveriesBtn.addEventListener('click', () => showSection('discovery-page'));
	}
	
	const homeBtn = document.querySelectorAll('.home-btn');
	homeBtn.forEach(btn => {
		btn.addEventListener('click', () => showSection('intro-page'));
	});
	
	// Initialize the mini-game properly
	miniGameInstance = new CityRunner();
	console.log('Mini-game initialized on page load');
	
	// Setup key elements
	guessInput = document.getElementById('guessInput');
	scoreDisplay = document.getElementById('score');
	bestScoreDisplay = document.getElementById('bestScore');
	victoryBestScoreDisplay = document.getElementById('victoryBestScore'); // Assign this element
	
	// Populate datalist for city autocomplete
	const citiesListEl = document.getElementById('citiesList');
	if (citiesListEl) {
		const names = (getAllCities ? getAllCities() : cities).map(c => c.name);
		citiesListEl.innerHTML = names.map(n => `<option value="${n}"></option>`).join('');
	}
	
	// Add submit guess handler
	const submitGuessBtn = document.getElementById('submitGuess');
	if (submitGuessBtn) {
		submitGuessBtn.addEventListener('click', function() {
			const guessInput = document.getElementById('guessInput');
			if (guessInput) {
				const guess = guessInput.value.trim();
				handleGuess(guess);
			}
		});
	}

	// Add enter key handler for the guess input
	if (guessInput) {
		guessInput.addEventListener('keydown', function(e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				const guess = this.value.trim();
				handleGuess(guess);
			}
		});
	}
	
	// Make sure the game mode buttons work
	const singlePlayerBtn = document.getElementById('singlePlayerBtn');
	if (singlePlayerBtn) {
		singlePlayerBtn.addEventListener('click', function() {
			startGame('singleplayer');
		});
	}
	
	const multiPlayerBtn = document.getElementById('multiPlayerBtn');
	if (multiPlayerBtn) {
		multiPlayerBtn.addEventListener('click', function() {
			startGame('multiplayer');
		});
	}
	
	// Set up filter buttons for discoveries page
	const filterButtons = document.querySelectorAll('.filter-btn');
	if (filterButtons.length > 0) {
		filterButtons.forEach(btn => {
			btn.addEventListener('click', function() {
				const filter = this.dataset.filter;
				document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
				this.classList.add('active');
				updateDiscoveriesUI(filter);
			});
		});
	}

	// Add listener for next button after DOM is ready
	const nextBtn = document.getElementById('nextBtn');
	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			console.log('Next button clicked');
			nextBtn.style.display = 'none';
			nextCity();
		});
	}

	// Initialize all systems
	initializeStats();
	initializeDailyTask();
	initializeDiscoveries();
	loadAchievements();
	
	// Setup lightbox functionality
	lightbox = document.getElementById('lightbox');
	lightboxImg = document.getElementById('lightboxImg');
	closeBtn = document.getElementById('closeBtn');
	if (lightbox && closeBtn && lightboxImg) { // Check if elements exist
		closeBtn.addEventListener('click', closeLightbox);
		lightbox.addEventListener('click', function(event) {
			if (event.target === lightbox || event.target === closeBtn) { // Also check closeBtn here
				closeLightbox();
			}
		});
	} else {
		console.error('Lightbox elements not found!');
	}
	
	// Show the intro page by default
	showSection('intro-page');
	
	console.log('Game initialized successfully');

	// Hint and Skip buttons
	const hintBtn = document.getElementById('hintBtn');
	if (hintBtn && !hintBtn._bound) {
		hintBtn.addEventListener('click', () => {
			if (!currentCity) return;
			if (hintUsedForCity) return;
			// Reveal first and last letter, mask middle
			const name = currentCity.name;
			const hint = name.length <= 2 ? name : `${name[0]}${'*'.repeat(Math.max(0, name.length - 2))}${name[name.length - 1]}`;
			showNotification(`Hint: ${hint}`);
			// Small time penalty
			timeLeft = Math.max(0, timeLeft - 5);
			hintUsedForCity = true;
		});
		hintBtn._bound = true;
	}
	const skipBtn = document.getElementById('skipBtn');
	if (skipBtn && !skipBtn._bound) {
		skipBtn.addEventListener('click', () => {
			if (!currentCity) return;
			clearInterval(timer);
			showCustomDialog(`Skipped! That was ${currentCity.name}.`);
			// Do not mark as discovered
			document.getElementById('guessInput').disabled = true;
			document.getElementById('submitGuess').disabled = true;
			const nextBtn = document.getElementById('nextBtn');
			if (nextBtn) nextBtn.style.display = 'block';
		});
		skipBtn._bound = true;
	}
});

// Show different sections with proper initialization
function showSection(sectionId) {
	console.log(`Showing section: ${sectionId}`);
	
	// Hide all sections
	const sections = document.querySelectorAll('.page');
	sections.forEach(section => {
		section.style.display = 'none';
	});
	
	// Show the requested section
	const targetSection = document.getElementById(sectionId);
	if (targetSection) {
		targetSection.style.display = 'block';
	} else {
		console.error(`Section not found: ${sectionId}`);
		return;
	}

	// Initialize specific sections
	switch(sectionId) {
		case 'cities-info':
			initializeCitiesInfo();
			updateDailyFact();
			setupCarousel();
			break;
		case 'daily-challenge-page':
			// Make sure we have a container element
			const containerElement = document.getElementById('daily-challenge-container');
			if (!containerElement) {
				// Try to create one if missing
				const pageElement = document.getElementById('daily-challenge-page');
				if (pageElement) {
					const newContainer = document.createElement('div');
					newContainer.id = 'daily-challenge-container';
					newContainer.className = 'challenge-container';
					pageElement.appendChild(newContainer);
				}
			}
			
			// Make sure daily task is initialized
			if (!window.dailyTask || !window.dailyTask.current) {
				initializeDailyTask();
			} else {
				updateDailyTaskUI();
			}
			break;
		case 'stats-page':
			updateStatsUI();
			break;
		case 'achievements-page':
			updateAchievementUI();
			break;
		case 'discovery-page':
			updateDiscoveriesUI('all');
			break;
		case 'game-page':
			// Reset input when entering game page
			const guessInput = document.getElementById('guessInput');
			if (guessInput) {
				guessInput.value = '';
				guessInput.focus();
			}
			break;
	}
	// Update current section tracker
	currentSection = sectionId;
}

// Update best score
function updateBestScore() {
	bestScore = Math.max(bestScore, score);
	localStorage.setItem('bestScore', bestScore);
	bestScoreDisplay.textContent = bestScore;
	victoryBestScoreDisplay.textContent = bestScore;
	const hs = document.getElementById('highScore');
	if (hs) hs.textContent = bestScore;
}

// Setup leaderboard
function setupLeaderboard() {
	const leaderboardList = document.getElementById('leaderboard-list');
	leaderboardList.innerHTML = '';
	
	leaderboard.sort((a, b) => b.score - a.score)
		.slice(0, 10)
		.forEach((entry, index) => {
			const item = document.createElement('div');
			item.className = 'leaderboard-item animated-card';
			item.style.animationDelay = `${index * 0.1}s`;
			item.innerHTML = `
				<span>#${index + 1} ${entry.name}</span>
				<span>${entry.score} points</span>
			`;
			leaderboardList.appendChild(item);
		});
}

// Show leaderboard
function showLeaderboard() {
	setupLeaderboard();
	showSection('leaderboard-screen');
}

// Exit game
function exitGame() {
	if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
		clearInterval(timer);
		showSection('intro-page');
	}
}

// Carousel Setup
function setupCarousel() {
	console.log('Setting up carousel');
	
	// Find the carousel element
	const carousel = document.getElementById('carousel');
	if (!carousel) {
		console.error('Carousel element not found');
		return;
	}
	
	// Clear any existing content
	carousel.innerHTML = '';
	
	// Get cities data
	const cities = getAllCities ? getAllCities() : window.cities;
	if (!cities || !cities.length) {
		console.error('No cities data available');
		return;
	}
	
	console.log(`Setting up carousel with ${cities.length} cities`);
	
	const angleStep = 360 / cities.length;
	const radius = 400;

	// Add city cards to carousel
	cities.forEach((city, i) => {
		const card = document.createElement('div');
		card.className = 'carousel-card';
		card.style.transform = `rotateX(${i * angleStep}deg) translateZ(${radius}px)`;
		
		// Handle image loading with fallback
		const imgUrl = city.image || 'https://placehold.co/400x300?text=City+Image';
		card.style.backgroundImage = `url('${imgUrl}')`;
		card.style.backgroundSize = 'cover';
		card.style.backgroundPosition = 'center';
		
		// Add click handler
		card.addEventListener('click', () => showCityCard(city));

		// Add caption
		const caption = document.createElement('div');
		caption.className = 'caption';
		caption.innerHTML = `
			<h3>${city.name}</h3>
			<p>${city.country}</p>
		`;
		card.appendChild(caption);
		carousel.appendChild(card);
	});

	// Initialize rotation
	currentRotation = 0;
	
	// Clear any existing interval
	if (rotationInterval) {
		clearInterval(rotationInterval);
	}
	
	// Add mouse and touch handlers
	carousel.addEventListener('mousedown', handleDragStart);
	carousel.addEventListener('touchstart', handleDragStart, { passive: true });
	carousel.addEventListener('touchmove', handleDragMove, { passive: true });
	carousel.addEventListener('touchend', handleDragEnd);
	
	carousel.addEventListener('mouseenter', () => {
		clearInterval(rotationInterval);
	});
	
	carousel.addEventListener('mouseleave', () => {
		if (!isDragging) {
			autoRotate();
		}
	});
	
	// Prevent text selection during drag
	carousel.addEventListener('selectstart', e => e.preventDefault());
	
	// Start auto rotation
	autoRotate();
	
	console.log('Carousel setup complete');
}

function showCityCard(city) {
	const randomFact = city.facts[Math.floor(Math.random() * city.facts.length)];
	const card = document.createElement('div');
	card.className = 'city-card';
	card.innerHTML = `
		<div class="city-image">
			<img src="${city.image}" alt="${city.name}" />
		</div>
		<div class="city-info">
			<h3>${city.name}, ${city.country}</h3>
			<div class="city-facts">
				<h4>Fun Fact:</h4>
				<p>${randomFact}</p>
			</div>
		</div>
	`;
	
	// Create overlay
	const overlay = document.createElement('div');
	overlay.className = 'lightbox-overlay active';
	overlay.appendChild(card);
	
	// Add close button
	const closeBtn = document.createElement('span');
	closeBtn.className = 'close-btn';
	closeBtn.innerHTML = '&times;';
	closeBtn.onclick = function() { overlay.remove(); };
	overlay.appendChild(closeBtn);
	
	// Add click outside to close
	overlay.onclick = function(e) {
		if (e.target === overlay) {
			overlay.remove();
		}
	};
	
	document.body.appendChild(overlay);
}

// Lightbox functions
function openLightbox(src) {
	if (lightboxImg) lightboxImg.src = src;
	if (lightbox) lightbox.classList.add('active');
}

function closeLightbox() {
	if (lightbox) lightbox.classList.remove('active');
	setTimeout(() => {
		if (lightboxImg) lightboxImg.src = '';
	}, 300);
}

// Populate cities information
function populateCitiesInfo() {
	const citiesGrid = document.querySelector('.cities-grid');
	citiesGrid.innerHTML = ''; // Clear existing content
	
	getAllCities().forEach(city => {
		const cityCard = document.createElement('div');
		cityCard.className = 'city-card';
		cityCard.innerHTML = `
			<div class="city-image">
				<img src="${city.image}" alt="${city.name}" loading="lazy">
			</div>
			<div class="city-info">
				<h3>${city.name}, ${city.country}</h3>
				<div class="city-facts">
					<h4>Fun Facts:</h4>
					<ul>
						${city.facts.map(fact => `<li>${fact}</li>`).join('')}
					</ul>
				</div>
			</div>
		`;
		citiesGrid.appendChild(cityCard);
	});
}

// Update daily fact
function updateDailyFact() {
	console.log('Updating daily fact');
	const dailyFactElement = document.getElementById('daily-fact');
	if (!dailyFactElement) {
		console.error('Daily fact element not found');
		return;
	}

	// Get cities data
	const cities = getAllCities ? getAllCities() : window.cities;
	if (!cities || !cities.length) {
		console.error('No cities data available for daily fact');
		dailyFactElement.innerHTML = '<h3>Fun Fact Unavailable</h3><p>Please try again later.</p>';
		return;
	}
	
	// Use current date to select a city (this ensures the same city is shown all day)
	const today = new Date();
	const cityIndex = today.getDate() % cities.length;
	const city = cities[cityIndex];
	
	if (!city || !city.facts || !city.facts.length) {
		console.error('Selected city has no facts');
		dailyFactElement.innerHTML = '<h3>Fun Fact Unavailable</h3><p>Please try again later.</p>';
		return;
	}
	
	// Select a random fact from the city
	const factIndex = Math.floor(Math.random() * city.facts.length);
	const fact = city.facts[factIndex];
	
	console.log(`Displaying fact for ${city.name}`);
	
	// Update the UI
	dailyFactElement.innerHTML = `
		<h3>Today's Fun Fact: ${city.name}</h3>
		<p>${fact}</p>
		<div class="fact-image">
			<img src="${city.image}" 
				 alt="${city.name}" 
				 onerror="this.src='https://placehold.co/400x200?text=Image+Unavailable'; this.onerror=null;">
		</div>
	`;
}

// Start game with selected mode
function startGame(mode = 'singleplayer') {
	gameMode = mode;
	score = 0;
	correctGuesses = 0;
	totalTime = 0;
	usedCities.clear();
	
	// Make sure discoveries object is initialized
	if (!window.discoveries) {
		window.discoveries = {
			cities: [],
			lastUpdated: new Date().toISOString()
		};
	}
	
	// Reset UI
	document.getElementById('score').textContent = '0';
	document.getElementById('correctGuesses').textContent = '0';
	document.getElementById('averageTime').textContent = '0s';
	
	// Handle different game modes
	if (mode === 'multiplayer') {
		// Setup for multiplayer mode
		const playerCount = parseInt(prompt('Enter number of players (2-4):', '2')) || 2;
		const validPlayerCount = Math.min(Math.max(2, playerCount), 4);
		
		// Initialize players array
		players = [];
		for (let i = 0; i < validPlayerCount; i++) {
			const name = prompt(`Enter name for Player ${i+1}:`, `Player ${i+1}`);
			players.push({
				name: name || `Player ${i+1}`,
				score: 0,
				correctGuesses: 0
			});
		}
		
		// Set first player as current
		currentPlayer = 0;
		
		// Show player display
		const playerDisplay = document.getElementById('playerDisplay');
		if (playerDisplay) {
			playerDisplay.style.display = 'block';
		}
		
		// Update player display
		updatePlayerDisplay();
		
		// Set multiplayer state
		multiplayer.active = true;
		multiplayer.players = players;
		multiplayer.currentPlayer = currentPlayer;
	} else {
		// Hide player display for singleplayer
		const playerDisplay = document.getElementById('playerDisplay');
		if (playerDisplay) {
			playerDisplay.style.display = 'none';
		}
		
		// Reset multiplayer state
		multiplayer.active = false;
		players = [];
		currentPlayer = null;
	}
	
	// Update stats
	updateStats('gameStarted');
	
	// Show game page
	showSection('game-page');
	
	// Ensure Next button hidden at new game
	const nextBtnInit = document.getElementById('nextBtn');
	if (nextBtnInit) nextBtnInit.style.display = 'none';
	
	// Start first city
	nextCity();
}

// Reset game state
function resetGame() {
	score = 0;
	correctGuesses = 0;
	totalTime = 0;
	usedCities.clear();
	
	// Make sure discoveries object is initialized
	if (!window.discoveries) {
		window.discoveries = {
			cities: [],
			lastUpdated: new Date().toISOString()
		};
		
		// Save empty discoveries
		localStorage.setItem('discoveries', JSON.stringify(window.discoveries));
	}
	
	scoreDisplay.textContent = score;
	playSound('click');
}

// Load next city
function nextCity() {
	console.log('--- nextCity called ---');
	console.log('Previously currentCity:', currentCity ? currentCity.name : 'none');
	console.log('Used cities:', Array.from(usedCities).join(', '));
	if (usedCities.size >= cities.length) {
		showVictoryScreen();
		return;
	}
	
	// Get a random city that hasn't been used yet
	let newCity;
	do {
		const randomIndex = Math.floor(Math.random() * cities.length);
		newCity = cities[randomIndex];
	} while (usedCities.has(newCity.name));

	currentCity = newCity;
	usedCities.add(newCity.name);
	
	const mapContainer = document.getElementById('map');
	if (!mapContainer) {
		console.error('Map container not found!');
		return;
	}

	// Show loading state
	mapContainer.style.backgroundImage = 'none';
	mapContainer.style.backgroundColor = '#333';
	document.querySelector('.controls').style.display = 'none';

	console.log('Loading city image:', currentCity.name, currentCity.image);

	// Load image with error handling
	const img = new Image();
	img.onload = () => {
		console.log('Image loaded successfully:', currentCity.name);
		// Explicitly clear background before setting new one
		mapContainer.style.backgroundImage = 'none'; 
		mapContainer.style.backgroundImage = `url(${currentCity.image})`;
		mapContainer.style.backgroundSize = 'cover';
		mapContainer.style.backgroundPosition = 'center';
		// Hide Next button initially
		const nextBtn = document.getElementById('nextBtn');
		if (nextBtn) nextBtn.style.display = 'none';
		document.querySelector('.controls').style.display = 'flex';
		const guessInputElem = document.getElementById('guessInput');
		const submitBtn = document.getElementById('submitGuess');
		if (guessInputElem) {
			guessInputElem.disabled = false;
			guessInputElem.value = '';
		}
		if (submitBtn) submitBtn.disabled = false;
		startTimer();
		updateStats('cityDiscovered', currentCity.rarity);
	};
	img.onerror = () => {
		console.error('Failed to load image for city:', currentCity.name);
		// Explicitly clear background before setting placeholder
		mapContainer.style.backgroundImage = 'none'; 
		// Use a reliable placeholder URL if the original image fails to load
		mapContainer.style.backgroundImage = 'url(https://placehold.co/800x400?text=City+Image+Not+Available)';
		mapContainer.style.backgroundSize = 'cover';
		mapContainer.style.backgroundPosition = 'center';
		// Hide Next button initially
		const nextBtnErr = document.getElementById('nextBtn');
		if (nextBtnErr) nextBtnErr.style.display = 'none';
		document.querySelector('.controls').style.display = 'flex';
		const guessInputErr = document.getElementById('guessInput');
		const submitBtnErr = document.getElementById('submitGuess');
		if (guessInputErr) {
			guessInputErr.disabled = false;
			guessInputErr.value = '';
		}
		if (submitBtnErr) submitBtnErr.disabled = false;
		startTimer();
		updateStats('cityDiscovered', currentCity.rarity);
	};
	
	// Set crossOrigin to anonymous to avoid CORS issues with external images
	img.crossOrigin = 'anonymous';
	img.src = currentCity.image;
	
	// Fallback in case image takes too long to load
	setTimeout(() => {
		if (!mapContainer.style.backgroundImage || mapContainer.style.backgroundImage === 'none') {
			console.warn('Image loading timeout for:', currentCity.name);
			img.onerror();
		}
	}, 5000); // 5 second timeout
}

// Update timer display
function updateTimer() {
	const timerElement = document.querySelector('.timer');
	if (timerElement) {
		timerElement.textContent = `Time left: ${timeLeft}s`;
	}
}

// Update player display
function updatePlayerDisplay() {
	const currentPlayerElement = document.getElementById('currentPlayer');
	if (currentPlayerElement && currentPlayer !== null) {
		currentPlayerElement.textContent = players[currentPlayer].name;
	}
}

// Handle guess
function handleGuess(guess) {
	if (!currentCity) {
		console.error('No current city to guess');
		return;
	}
	
	// Trim the guess and convert to lowercase for comparison
	guess = guess.trim().toLowerCase();
	const correctAnswer = currentCity.name.toLowerCase();
	
	// Stop the timer
	clearInterval(timer);
	
	// Calculate time spent on this guess
	const guessTime = 90 - timeLeft;
	totalTime += guessTime;
	
	// Check if the guess is correct
	const isCorrect = guess === correctAnswer;
	
	// In multiplayer mode, keep track of individual player scores
	if (multiplayer.active && currentPlayer !== null) {
		const player = players[currentPlayer];
		
		if (isCorrect) {
			// Calculate points based on time left
			const points = Math.max(1, Math.ceil(timeLeft / 10));
			player.score += points;
			player.correctGuesses++;
			
			// Update global score for display
			score = player.score;
			correctGuesses = player.correctGuesses;
			
			// Update score display
			document.getElementById('score').textContent = score;
			
			// Play correct sound
			playSound('correct');
			
			// Add to discovered cities
			if (!window.discoveries) {
				window.discoveries = {
					cities: [],
					lastUpdated: new Date().toISOString()
				};
			}
			
			// Check if the city is already discovered
			const alreadyDiscovered = window.discoveries.cities.some(city => city.name === currentCity.name);
			
			if (!alreadyDiscovered) {
				// Add this city to discoveries
				window.discoveries.cities.push({
					name: currentCity.name,
					country: currentCity.country,
					image: currentCity.image,
					rarity: currentCity.rarity,
					discoveredDate: new Date().toISOString()
				});
				
				// Save discoveries to localStorage
				localStorage.setItem('discoveries', JSON.stringify(window.discoveries));
			}
			
			// Success message using custom dialog
			showCustomDialog(`Correct! That was ${currentCity.name}. ${player.name} earned ${points} points!`);
			
			// Update stats and challenges
			updateStats('guess', true);
			updateStats('score', points);
			updateDailyTaskProgress('score', points);
			updateDailyTaskProgress('cities', 1);
			if (window.dailyChallenge) {
				updateDailyChallengeProgress('discover');
				updateDailyChallengeProgress('score', points);
			}
		} else {
			// Play wrong sound
			playSound('wrong');
			
			// Update stats
			updateStats('guess', false);
			
			// Failure message using custom dialog
			showCustomDialog(`Wrong! That was ${currentCity.name}. ${player.name} gets 0 points.`);
		}
		
		// Move to next player
		currentPlayer = (currentPlayer + 1) % players.length;
		multiplayer.currentPlayer = currentPlayer;
		
		// Update player display
		updatePlayerDisplay();
	} else {
		// Single player mode
		if (isCorrect) {
			// Calculate points based on time left
			const points = Math.max(1, Math.ceil(timeLeft / 10));
			score += points;
			correctGuesses++;
			
			// Play correct sound
			playSound('correct');
			
			// Add to discovered cities
			if (!window.discoveries) {
				window.discoveries = {
					cities: [],
					lastUpdated: new Date().toISOString()
				};
			}
			
			// Check if the city is already discovered
			const alreadyDiscovered = window.discoveries.cities.some(city => city.name === currentCity.name);
			
			if (!alreadyDiscovered) {
				// Add this city to discoveries
				window.discoveries.cities.push({
					name: currentCity.name,
					country: currentCity.country,
					image: currentCity.image,
					rarity: currentCity.rarity,
					discoveredDate: new Date().toISOString()
				});
				
				// Save discoveries to localStorage
				localStorage.setItem('discoveries', JSON.stringify(window.discoveries));
			}
			
			// Success message using custom dialog
			showCustomDialog(`Correct! That was ${currentCity.name}. You earned ${points} points!`);
			
			// Update stats and challenges
			updateStats('guess', true);
			updateStats('score', points);
			updateDailyTaskProgress('score', points);
			updateDailyTaskProgress('cities', 1);
			if (window.dailyChallenge) {
				updateDailyChallengeProgress('discover');
				updateDailyChallengeProgress('score', points);
			}
		} else {
			// Play wrong sound
			playSound('wrong');
			
			// Update stats
			updateStats('guess', false);
			
			// Failure message using custom dialog
			showCustomDialog(`Wrong! That was ${currentCity.name}.`);
		}
	}
	
	// Update stats display
	document.getElementById('score').textContent = score;
	document.getElementById('correctGuesses').textContent = correctGuesses;
	
	// Calculate and update average time
	const averageTime = totalTime / (correctGuesses || 1);
	document.getElementById('averageTime').textContent = Math.round(averageTime) + 's';
	
	// Check if we have a new best score
	updateBestScore();
	
	// Disable input and button until next city
	document.getElementById('guessInput').disabled = true;
	document.getElementById('submitGuess').disabled = true;
	
	// Check if all cities have been used
	if (usedCities.size >= cities.length) {
		// Show victory screen
		showVictoryScreen();
	} else {
		// If there are more cities to guess, show next button
		document.getElementById('nextBtn').style.display = 'block';
	}
}

// Custom dialog function to replace alert
function showCustomDialog(message) {
	// Create dialog if it doesn't exist
	let dialog = document.getElementById('custom-dialog');
	if (!dialog) {
		dialog = document.createElement('div');
		dialog.id = 'custom-dialog';
		dialog.className = 'custom-dialog';
		
		const content = document.createElement('div');
		content.className = 'dialog-content';
		
		const text = document.createElement('p');
		text.id = 'dialog-text';
		
		const button = document.createElement('button');
		button.textContent = 'OK';
		button.onclick = closeCustomDialog;
		
		content.appendChild(text);
		content.appendChild(button);
		dialog.appendChild(content);
		
		document.body.appendChild(dialog);
	}
	
	// Set message and show dialog
	document.getElementById('dialog-text').textContent = message;
	dialog.style.display = 'flex';
	
	// Auto-focus the button (prevents spacebar issues)
	const button = dialog.querySelector('button');
	if (button) {
		button.focus();
	}
}

function closeCustomDialog() {
	const dialog = document.getElementById('custom-dialog');
	if (dialog) {
		dialog.style.display = 'none';
	}
}

// Show victory screen
function showVictoryScreen() {
	// Hide the Next button explicitly
	const nextBtn = document.getElementById('nextBtn');
	if (nextBtn) {
		nextBtn.style.display = 'none';
	}

	// Save leaderboard entry for singleplayer
	if (!multiplayer.active) {
		const name = localStorage.getItem('playerName') || 'Player';
		leaderboard.push({ name, score });
		localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
	}

	// Update game stats
	updateStats('time', totalTime / (correctGuesses || 1));
	updateStats('gamePlayed', score);
	
	if (multiplayer.active) {
		// Sort players by score in descending order
		players.sort((a, b) => b.score - a.score);
		
		// Create content for victory screen
		let winnerMessage = `<h1 class="animated-text">Game Over!</h1>`;
		
		// Display the winner with the highest score
		if (players.length > 0) {
			winnerMessage += `<h2 class="animated-text">Winner: ${players[0].name} with ${players[0].score} points!</h2>`;
		}
		
		// Create a scoreboard of all players
		let scoreboardHTML = `<div class="multiplayer-scoreboard">
			<h3>Final Scores</h3>
			<table class="score-table">
				<tr>
					<th>Rank</th>
					<th>Player</th>
					<th>Score</th>
					<th>Correct Guesses</th>
				</tr>`;
		
		// Add a row for each player
		players.forEach((player, index) => {
			scoreboardHTML += `
				<tr class="${index === 0 ? 'winner' : ''}">
					<td>${index + 1}</td>
					<td>${player.name}</td>
					<td>${player.score}</td>
					<td>${player.correctGuesses}</td>
				</tr>`;
		});
		
		scoreboardHTML += `</table></div>`;
		
		// Update the victory content
		const victoryContent = document.querySelector('.victory-content');
		if (victoryContent) {
			victoryContent.innerHTML = winnerMessage + scoreboardHTML + `
				<div class="button-container">
					<button class="play-again-btn animated-btn" onclick="startGame('multiplayer')">Play Again</button>
					<button class="home-btn animated-btn" onclick="showSection('intro-page')">Return Home</button>
				</div>`;
		}
	} else {
		// Single player victory screen
		document.getElementById('finalScore').textContent = score;
		document.getElementById('victoryBestScore').textContent = bestScore;
		document.getElementById('correctGuesses').textContent = correctGuesses;
		
		// Calculate average time
		const averageTime = totalTime / (correctGuesses || 1);
		document.getElementById('averageTime').textContent = Math.round(averageTime);
	}
	
	// Show victory screen
	showSection('victory-screen');
	
	// Add score to leaderboard
	if (score > 0) {
		setupLeaderboard();
	}
}

// Update achievement UI
function updateAchievementUI() {
	const achievementGrid = document.getElementById('achievementGrid');
	if (!achievementGrid) return;

	achievementGrid.innerHTML = '';
	
	// Make sure daily task data is available for progress calculation
	if (!window.dailyTask) {
		initializeDailyTask();
	}
	
	// Update achievement progress based on current stats
	if (window.dailyTask) {
		achievements.dailyStreak.progress = Math.min(window.dailyTask.streak, achievements.dailyStreak.total);
		achievements.consistentExplorer.progress = Math.min(window.dailyTask.completedCount || 0, achievements.consistentExplorer.total);
		achievements.masterExplorer.progress = Math.min(window.dailyTask.completedCount || 0, achievements.masterExplorer.total);
		achievements.legendaryStreak.progress = Math.min(window.dailyTask.bestStreak || 0, achievements.legendaryStreak.total);
	}
	
	// Check for completion
	Object.values(achievements).forEach(achievement => {
		if (achievement.progress >= achievement.total && !achievement.completed) {
			achievement.completed = true;
			// Show notification for newly completed achievements
			showAchievementNotification({
				name: achievement.title,
				description: achievement.description,
				emoji: achievement.icon
			});
		}
	});
	
	// Create achievement cards
	Object.values(achievements).forEach(achievement => {
		const card = document.createElement('div');
		card.className = `achievement-card ${achievement.completed ? 'completed' : ''}`;
		
		const progress = Math.min((achievement.progress / achievement.total) * 100, 100);
		
		card.innerHTML = `
			<div class="achievement-icon">${achievement.icon}</div>
			<div class="achievement-title">${achievement.title}</div>
			<div class="achievement-description">${achievement.description}</div>
			<div class="achievement-progress">
				<div class="achievement-progress-bar" style="width: ${progress}%"></div>
			</div>
			<div class="achievement-stats">
				<span>${achievement.progress}/${achievement.total}</span>
				<span>${achievement.completed ? 'Completed!' : 'In Progress'}</span>
			</div>
		`;
		
		achievementGrid.appendChild(card);
	});
	
	// Save achievements after updating
	localStorage.setItem('achievements', JSON.stringify(achievements));
}

// Show achievement notification
function showAchievementNotification(achievement) {
	const notification = document.getElementById('achievementNotification');
	const text = document.getElementById('achievementNotificationText');
	const emoji = document.querySelector('.achievement-emoji');
	
	// Set achievement emoji
	if (emoji) {
		emoji.textContent = achievement.emoji || '🏆';
	}
	
	text.textContent = `${achievement.name}: ${achievement.description}`;
	notification.style.display = 'block';
	
	// Play sound for achievement unlock
		playSound('correct');
		
	// Hide notification after animation completes
	setTimeout(() => {
		notification.style.display = 'none';
	}, 5000);
}

// Enhanced Discovery System
function initializeDiscoveries() {
	console.log('Initializing discoveries');
	
	// Initialize discoveries object if it doesn't exist
	if (!window.discoveries) {
		window.discoveries = {
			cities: [],
			lastUpdated: new Date().toISOString()
		};
	}
	
	// Try to load from localStorage
	const savedDiscoveries = localStorage.getItem('discoveries');
	if (savedDiscoveries) {
		try {
			window.discoveries = JSON.parse(savedDiscoveries);
		} catch (e) {
			console.error('Error parsing saved discoveries:', e);
			// If there's an error parsing, initialize with empty data
			window.discoveries = {
				cities: [],
				lastUpdated: new Date().toISOString()
			};
		}
	}
	
	// Convert from old format if necessary
	const oldDiscoveredCities = localStorage.getItem('discoveredCities');
	if (oldDiscoveredCities && (!window.discoveries.cities || window.discoveries.cities.length === 0)) {
		try {
			const cityNames = JSON.parse(oldDiscoveredCities);
			
			if (Array.isArray(cityNames)) {
				cityNames.forEach(cityName => {
					const cityData = cities.find(c => c.name === cityName);
					if (cityData) {
						window.discoveries.cities.push({
							name: cityData.name,
							country: cityData.country,
							image: cityData.image,
							rarity: cityData.rarity,
							discoveredDate: new Date().toISOString()
						});
					}
				});
				
				// Save the converted format
				localStorage.setItem('discoveries', JSON.stringify(window.discoveries));
				// Remove old format
				localStorage.removeItem('discoveredCities');
			}
		} catch (e) {
			console.error('Error converting old discoveries format:', e);
		}
	}
	
	updateDiscoveriesUI('all');
}

function updateDiscoveriesUI(filter = 'all') {
	console.log('Updating discoveries UI with filter:', filter);
	const grid = document.getElementById('discoveryGrid');
	if (!grid) {
		console.error('Discovery grid element not found');
		return;
	}
	
	// Initialize discoveries if needed
	if (!window.discoveries) {
		window.discoveries = {
			cities: [],
			lastUpdated: new Date().toISOString()
		};
	}
	
	grid.innerHTML = '';
	
	// Get the discovered city names for quick lookup
	const discoveredCityNames = window.discoveries?.cities?.map(city => city.name) || [];
	
	// Filter cities based on the selected filter
	let citiesToShow = cities;
	if (filter !== 'all' && filter !== 'discovered') {
		citiesToShow = cities.filter(city => city.rarity === filter);
	}
	
	// Create cards for each city
	citiesToShow.forEach(city => {
		const isDiscovered = discoveredCityNames.includes(city.name);
		
		// Skip undiscovered cities
		if (!isDiscovered) {
			return;
		}
		
		const card = document.createElement('div');
		card.className = 'discovery-card';
		
		const img = document.createElement('img');
		img.src = city.image;
		img.alt = city.name;
		img.onerror = function() {
			// Use a reliable placeholder URL
			this.src = 'https://placehold.co/200x200?text=No+Image';
		};
		
		const info = document.createElement('div');
		info.className = 'city-info';
		
		const title = document.createElement('h3');
		title.textContent = city.name;
		
		const country = document.createElement('p');
		country.textContent = city.country;
		
		const rarity = document.createElement('div');
		rarity.className = `rarity-badge ${city.rarity}`;
		rarity.textContent = city.rarity;
		
		const discoveryDate = document.createElement('div');
		discoveryDate.className = 'discovery-date';
		const discoveredCity = window.discoveries.cities.find(dc => dc.name === city.name);
		if (discoveredCity && discoveredCity.discoveredDate) {
			const date = new Date(discoveredCity.discoveredDate);
			discoveryDate.textContent = `Discovered: ${date.toLocaleDateString()}`;
		} else {
			discoveryDate.textContent = 'Discovered recently';
		}
		
		info.appendChild(title);
		info.appendChild(country);
		info.appendChild(rarity);
		info.appendChild(discoveryDate);
		
		card.appendChild(img);
		card.appendChild(info);
		
		grid.appendChild(card);
	});
	
	// If no cities match the filter, show a message
	if (grid.children.length === 0) {
		const message = document.createElement('div');
		message.className = 'no-discoveries';
		message.textContent = filter === 'all' ? 
			'You haven\'t discovered any cities yet. Play the game to discover more!' : 
			`You haven\'t discovered any ${filter} cities yet. Keep exploring!`;
		grid.appendChild(message);
	}
}

// Navigation Functions
function showStatistics() {
	showSection('stats-page');
	updateStatsUI();
}

function showDailyTask() {
	showSection('daily-challenge-page');
	updateDailyTaskUI();
}

function unlockAchievement(id, title, description) {
	const achievement = {
		id: id,
		title: title,
		description: description,
		icon: '🏆',
		rarity: 'rare',
		unlocked: true
	};
	localStorage.setItem('achievements', JSON.stringify({ [id]: achievement }));
	updateAchievementUI();
	showAchievementNotification(achievement);
}

// Daily Challenge
let dailyChallenge = {
	currentChallenge: null,
	streak: 0,
	lastCompleted: null,
	progress: 0,
	target: 0
};

function initializeDailyChallenge() {
	const savedChallenge = localStorage.getItem('dailyChallenge');
	if (savedChallenge) {
		dailyChallenge = JSON.parse(savedChallenge);
	}
	
	// Check if we need a new challenge
	const today = new Date().toDateString();
	if (!dailyChallenge.currentChallenge || dailyChallenge.lastCompleted !== today) {
		generateNewDailyChallenge();
	}
	
	updateDailyChallengeUI();
}

function generateNewDailyChallenge() {
	const challenges = [
		{
			type: 'discover',
			target: 5,
			description: 'Discover 5 new cities today',
			reward: 100
		},
		{
			type: 'score',
			target: 1000,
			description: 'Score 1000 points in GeoGuesser',
			reward: 150
		},
		{
			type: 'streak',
			target: 3,
			description: 'Get a 3-city streak in GeoGuesser',
			reward: 200
		}
	];
	
	dailyChallenge.currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
	dailyChallenge.progress = 0;
	dailyChallenge.target = dailyChallenge.currentChallenge.target;
	dailyChallenge.lastCompleted = null;
	
	saveDailyChallenge();
}

function updateDailyChallengeProgress(type, amount = 1) {
	if (!dailyChallenge.currentChallenge || dailyChallenge.lastCompleted === new Date().toDateString()) {
		return;
	}
	
	if (dailyChallenge.currentChallenge.type === type) {
		dailyChallenge.progress += amount;
		
		if (dailyChallenge.progress >= dailyChallenge.target) {
			completeDailyChallenge();
		}
		
		saveDailyChallenge();
		updateDailyChallengeUI();
	}
}

function completeDailyChallenge() {
	const today = new Date().toDateString();
	dailyChallenge.lastCompleted = today;
	dailyChallenge.streak++;
	
	// Award points
	addPoints(dailyChallenge.currentChallenge.reward);
	
	// Show completion message
	showNotification(`Daily Challenge Complete! +${dailyChallenge.currentChallenge.reward} points`);
	
	// Generate new challenge for tomorrow
	generateNewDailyChallenge();
}

function saveDailyChallenge() {
	localStorage.setItem('dailyChallenge', JSON.stringify(dailyChallenge));
}

function updateDailyChallengeUI() {
	const challengeContainer = document.getElementById('daily-challenge-container');
	if (!challengeContainer) return;
	
	if (!dailyChallenge.currentChallenge) {
		challengeContainer.innerHTML = '<p>No active challenge</p>';
		return;
	}
	
	const progressPercent = (dailyChallenge.progress / dailyChallenge.target) * 100;
	
	challengeContainer.innerHTML = `
		<div class="challenge-card">
			<h3>Today's Challenge</h3>
			<p>${dailyChallenge.currentChallenge.description}</p>
			<div class="progress-bar">
				<div class="progress" style="width: ${progressPercent}%"></div>
			</div>
			<p>Progress: ${dailyChallenge.progress}/${dailyChallenge.target}</p>
			<p>Reward: ${dailyChallenge.currentChallenge.reward} points</p>
			<p>Current Streak: ${dailyChallenge.streak} days</p>
		</div>
	`;
}

// Daily Task System
function initializeDailyTask() {
	console.log('Initializing daily tasks');
	// Ensure the dailyTask object is properly defined
	if (!window.dailyTask) {
		window.dailyTask = {
			current: null,
			progress: 0,
			completed: false,
			lastUpdated: null,
			streak: 0,
			bestStreak: 0
		};
	}
	
	const today = new Date().toDateString();
	const savedTask = localStorage.getItem('dailyTask');
	
	if (savedTask) {
		try {
			const parsed = JSON.parse(savedTask);
			window.dailyTask = parsed;
			
			// If task is from a previous day, generate a new one
			if (parsed.lastUpdated !== today) {
				// Check if yesterday's task was completed to track streak
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				if (parsed.completed && parsed.lastUpdated === yesterday.toDateString()) {
					window.dailyTask.streak++;
					if (window.dailyTask.streak > window.dailyTask.bestStreak) {
						window.dailyTask.bestStreak = window.dailyTask.streak;
					}
				} else {
					window.dailyTask.streak = 0;
				}
				generateDailyTask();
			}
		} catch (e) {
			console.error('Error parsing daily task:', e);
			generateDailyTask();
		}
	} else {
		generateDailyTask();
	}
	
	updateDailyTaskUI();
	checkDailyTaskAchievements();
}

function generateDailyTask() {
	console.log('Generating new daily task');
	const tasks = [
		{ type: 'score', target: 200, description: 'Score 200 points in a game' },
		{ type: 'cities', target: 3, description: 'Discover 3 new cities' },
		{ type: 'accuracy', target: 70, description: 'Achieve 70% accuracy in a game' },
		{ type: 'time', target: 45, description: 'Complete a game in under 45 seconds' },
		{ type: 'streak', target: 3, description: 'Guess 3 cities correctly in a row' },
		{ type: 'score', target: 300, description: 'Score 300 points in a game' }
	];
	
	window.dailyTask.current = tasks[Math.floor(Math.random() * tasks.length)];
	window.dailyTask.progress = 0;
	window.dailyTask.completed = false;
	window.dailyTask.lastUpdated = new Date().toDateString();
	
	saveDailyTask();
}

function updateDailyTaskProgress(type, amount) {
	if (!window.dailyTask || !window.dailyTask.current) {
		console.error('Daily task not initialized');
		return;
	}
	
	console.log(`Updating daily task progress: ${type} +${amount}`);
	
	if (window.dailyTask.current.type === type) {
		window.dailyTask.progress += amount;
		
		// Check if task is completed
		if (window.dailyTask.progress >= window.dailyTask.current.target && !window.dailyTask.completed) {
			window.dailyTask.completed = true;
			
			// Track streak and completed count
			window.dailyTask.streak++;
			window.dailyTask.completedCount = (window.dailyTask.completedCount || 0) + 1;
			
			if (window.dailyTask.streak > window.dailyTask.bestStreak) {
				window.dailyTask.bestStreak = window.dailyTask.streak;
			}
			
			showNotification('Daily Task Completed! +100 points');
			score += 100; // Reward for completing daily task
			
			// Update score display
			const scoreDisplay = document.getElementById('score');
			if (scoreDisplay) {
				scoreDisplay.textContent = score;
			}
			
			// Check for achievements
			checkDailyTaskAchievements();
		}
		
		updateDailyTaskUI();
		saveDailyTask();
	}
}

function updateDailyTaskUI() {
	console.log('Updating daily task UI');
	
	// Find the task container - check for both possible IDs
	let taskContainer = document.getElementById('daily-task-container');
	
	if (!taskContainer) {
		console.error('Daily task container not found');
		return;
	}
	
	// Clear the container
	taskContainer.innerHTML = '';
	
	if (!window.dailyTask || !window.dailyTask.current) {
		taskContainer.innerHTML = '<p class="no-task">No active task available. Please try again later.</p>';
		return;
	}
	
	// Calculate progress percentage
	const percentage = Math.min((window.dailyTask.progress / window.dailyTask.current.target) * 100, 100);
	
	// Create task card
	const taskCard = document.createElement('div');
	taskCard.className = 'task-card';
	taskCard.innerHTML = `
		<div class="task-info">
			<h3>Today's Task</h3>
			<p id="taskDescription">${window.dailyTask.current.description}</p>
			<div class="progress-container">
				<div class="progress-bar">
					<div id="taskProgress" class="progress" style="width: ${percentage}%">${Math.round(percentage)}%</div>
				</div>
			</div>
			<div id="taskStreak" class="streak-display">Current Streak: ${window.dailyTask.streak} days</div>
			<div class="points-display">
				<span>Reward: </span>
				<span id="taskPoints">${window.dailyTask.completed ? '200' : '100'}</span>
				<span> points</span>
			</div>
		</div>
	`;
	
	taskContainer.appendChild(taskCard);
}

function saveDailyTask() {
	localStorage.setItem('dailyTask', JSON.stringify(window.dailyTask));
}

function checkDailyTaskAchievements() {
	if (!window.dailyTask) return;
	
	// Set completedCount if it doesn't exist
	if (window.dailyTask.completedCount === undefined) {
		window.dailyTask.completedCount = window.dailyTask.completed ? 1 : 0;
	}
	
	// Daily streak achievement (3 daily tasks in a row)
	if (window.dailyTask.streak >= 3) {
		if (!achievements.dailyStreak.completed) {
			achievements.dailyStreak.progress = 3;
			achievements.dailyStreak.completed = true;
			showAchievementNotification({
				name: achievements.dailyStreak.title,
				description: achievements.dailyStreak.description,
				emoji: achievements.dailyStreak.icon
			});
		}
	} else {
		achievements.dailyStreak.progress = window.dailyTask.streak;
	}
	
	// Consistent explorer achievement (5 daily tasks total)
	if (window.dailyTask.completedCount >= 5) {
		if (!achievements.consistentExplorer.completed) {
			achievements.consistentExplorer.progress = 5;
			achievements.consistentExplorer.completed = true;
			showAchievementNotification({
				name: achievements.consistentExplorer.title,
				description: achievements.consistentExplorer.description,
				emoji: achievements.consistentExplorer.icon
			});
		}
	} else {
		achievements.consistentExplorer.progress = window.dailyTask.completedCount || 0;
	}
	
	// Master explorer achievement (10 daily tasks total)
	if (window.dailyTask.completedCount >= 10) {
		if (!achievements.masterExplorer.completed) {
			achievements.masterExplorer.progress = 10;
			achievements.masterExplorer.completed = true;
			showAchievementNotification({
				name: achievements.masterExplorer.title,
				description: achievements.masterExplorer.description,
				emoji: achievements.masterExplorer.icon
			});
		}
	} else {
		achievements.masterExplorer.progress = window.dailyTask.completedCount || 0;
	}
	
	// Legendary streak achievement (15 daily tasks in a row)
	if (window.dailyTask.streak >= 15) {
		if (!achievements.legendaryStreak.completed) {
			achievements.legendaryStreak.progress = 15;
			achievements.legendaryStreak.completed = true;
			showAchievementNotification({
				name: achievements.legendaryStreak.title,
				description: achievements.legendaryStreak.description,
				emoji: achievements.legendaryStreak.icon
			});
		}
	} else {
		achievements.legendaryStreak.progress = window.dailyTask.streak;
	}
	
	// Save achievements
	saveAchievements();
	updateAchievementUI();
}

// Stats System
function initializeStats() {
	const savedStats = localStorage.getItem('playerStats');
	if (savedStats) {
		playerStats = JSON.parse(savedStats);
	}
	updateStatsUI();
}

function updateStats(type, value) {
	switch (type) {
		case 'gameStarted':
			playerStats.currentGameStartTime = Date.now();
			playerStats.currentGameScore = 0;
			break;
		case 'gamePlayed':
			playerStats.gamesPlayed++;
			playerStats.totalScore += value;
			playerStats.averageScore = playerStats.totalScore / playerStats.gamesPlayed;
			break;
		case 'cityDiscovered':
			playerStats.citiesDiscovered++;
			if (value === 'rare') playerStats.rareCities++;
			if (value === 'legendary') playerStats.legendaryCities++;
			break;
		case 'time':
			if (value < playerStats.bestTime) playerStats.bestTime = value;
			playerStats.averageTime = (playerStats.averageTime * (playerStats.gamesPlayed - 1) + value) / playerStats.gamesPlayed;
			break;
		case 'guess':
			playerStats.totalGuesses++;
			if (value) playerStats.correctGuesses++;
			playerStats.accuracy = (playerStats.correctGuesses / playerStats.totalGuesses) * 100;
			break;
		case 'score':
			playerStats.currentGameScore += value;
			break;
	}
	saveStats();
	updateStatsUI();
}

function updateStatsUI() {
	document.getElementById('totalGames').textContent = playerStats.gamesPlayed;
	document.getElementById('totalScore').textContent = playerStats.totalScore;
	document.getElementById('averageScore').textContent = Math.round(playerStats.averageScore);
	document.getElementById('citiesDiscovered').textContent = playerStats.citiesDiscovered;
	document.getElementById('rareCities').textContent = playerStats.rareCities;
	document.getElementById('legendaryCities').textContent = playerStats.legendaryCities;
	document.getElementById('bestTime').textContent = playerStats.bestTime === Infinity ? 'N/A' : `${playerStats.bestTime}s`;
	document.getElementById('avgTime').textContent = `${Math.round(playerStats.averageTime)}s`;
	document.getElementById('accuracy').textContent = `${Math.round(playerStats.accuracy)}%`;
}

function saveStats() {
	localStorage.setItem('playerStats', JSON.stringify(playerStats));
}

// Settings functionality
function initializeSettings() {
	// Load saved settings
	const savedTheme = localStorage.getItem('theme');
	const savedCookies = localStorage.getItem('cookiesEnabled');
	const savedSound = localStorage.getItem('soundEnabled');

	// Apply saved settings
	if (savedTheme === 'light') {
		document.body.classList.add('light-mode');
		document.getElementById('themeToggle').checked = true;
	}

	if (savedCookies === 'false') {
		document.getElementById('cookiesToggle').checked = false;
		// Cookies will be cleared when toggled off in toggleCookies
	}

	if (savedSound === 'false') {
		document.getElementById('soundToggle').checked = false;
		muteAllSounds();
	}

	// Add event listeners
	document.getElementById('themeToggle').addEventListener('change', toggleTheme);
	document.getElementById('cookiesToggle').addEventListener('change', toggleCookies);
	document.getElementById('soundToggle').addEventListener('change', toggleSound);
}

function toggleTheme() {
	const isLightMode = document.getElementById('themeToggle').checked;
	if (isLightMode) {
		document.body.classList.add('light-mode');
		localStorage.setItem('theme', 'light');
	} else {
		document.body.classList.remove('light-mode');
		localStorage.setItem('theme', 'dark');
	}
}

function toggleCookies() {
	const cookiesToggle = document.getElementById('cookiesToggle');
	if (!cookiesToggle) return;

	const cookiesEnabled = cookiesToggle.checked;
	localStorage.setItem('cookiesEnabled', cookiesEnabled);

	if (!cookiesEnabled) {
		// Clear all cookies
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
		}
		
		// Save toggles before clearing localStorage
		const theme = localStorage.getItem('theme');
		const soundEnabled = localStorage.getItem('soundEnabled');
		
		// Clear localStorage
		localStorage.clear();
		
		// Restore toggles
		localStorage.setItem('theme', theme);
		localStorage.setItem('soundEnabled', soundEnabled);
		localStorage.setItem('cookiesEnabled', 'false');
		
		// Reset game state
		bestScore = 0;
		leaderboard = [];
		usedCities = new Set();
		
		// Reset discoveries
		window.discoveries = {
			cities: [],
			lastUpdated: new Date().toISOString()
		};
		localStorage.setItem('discoveries', JSON.stringify(window.discoveries));
		
		// Reset player stats
		playerStats = {
			gamesPlayed: 0,
			totalScore: 0,
			averageScore: 0,
			citiesDiscovered: 0,
			rareCities: 0,
			legendaryCities: 0,
			bestTime: Infinity,
			averageTime: 0,
			accuracy: 0,
			correctGuesses: 0,
			totalGuesses: 0,
			currentGameStartTime: 0,
			currentGameScore: 0
		};
		saveStats();
		
		// Update UI
		if (bestScoreDisplay) bestScoreDisplay.textContent = '0';
		if (leaderboardScreen) showLeaderboard();
		updateDiscoveriesUI('all');
		updateStatsUI();
	}
}

function toggleSound() {
	const soundEnabled = document.getElementById('soundToggle').checked;
	localStorage.setItem('soundEnabled', soundEnabled);
	
	if (soundEnabled) {
		unmuteAllSounds();
	} else {
		muteAllSounds();
	}
}

function muteAllSounds() {
	Object.values(sounds).forEach(sound => {
		sound.volume = 0;
	});
}

function unmuteAllSounds() {
	Object.values(sounds).forEach(sound => {
		sound.volume = 0.3;
	});
}

// nextBtn handler is attached during DOMContentLoaded to avoid duplicate listeners

function updateNewAchievements() {
	const achievementGrid = document.querySelector('.achievement-grid');
	if (!achievementGrid) return;

	achievementGrid.innerHTML = '';
	
	Object.entries(newAchievements).forEach(([key, achievement]) => {
		const card = document.createElement('div');
		card.className = `achievement-card ${achievement.completed ? 'completed' : ''}`;
		
		const progress = (achievement.progress / achievement.target) * 100;
		
		card.innerHTML = `
			<div class="achievement-icon">${achievement.icon}</div>
			<div class="achievement-title">${achievement.name}</div>
			<div class="achievement-description">${achievement.description}</div>
			<div class="achievement-progress">
				<div class="achievement-progress-bar" style="width: ${progress}%"></div>
			</div>
			<div class="achievement-stats">
				<span>${achievement.progress}/${achievement.target}</span>
				<span>${achievement.globalCompletion}% of players</span>
			</div>
			<div class="achievement-${achievement.rarity}">${achievement.rarity}</div>
		`;
		
		achievementGrid.appendChild(card);
	});
}

// Add this function to handle the Easter egg achievement
function checkSecretAchievement() {
	const secretAchievement = newAchievements.secretExplorer;
	if (!secretAchievement.completed) {
		// Check for specific conditions that would trigger the Easter egg
		// For example, clicking a specific sequence of cities or making a specific guess
		const currentTime = new Date();
		if (currentTime.getHours() === 3 && currentTime.getMinutes() === 33) {
			// Easter egg triggered at 3:33 AM
			secretAchievement.completed = true;
			secretAchievement.name = "Night Owl Explorer 🌙";
			secretAchievement.description = "Discovered the secret of the night!";
			updateNewAchievements();
			showAchievementNotification(secretAchievement);
		}
	}
}

// Add helper function for showing notifications
function showNotification(message) {
	// Create notification element if it doesn't exist
	let notification = document.getElementById('gameNotification');
	if (!notification) {
		notification = document.createElement('div');
		notification.id = 'gameNotification';
		notification.className = 'game-notification';
		document.body.appendChild(notification);
	}
	
	notification.textContent = message;
	notification.classList.add('show');
	
	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

// Helper function for adding points
function addPoints(amount) {
	score += amount;
	const scoreDisplay = document.getElementById('score');
	if (scoreDisplay) {
		scoreDisplay.textContent = score;
	}
}

// Start timer
function startTimer() {
	// Clear any existing timer
	if (timer) {
		clearInterval(timer);
	}
	// Reset per-city time
	hintUsedForCity = false;
	// Reset time
	timeLeft = 90;

	// Update display initially
	const timerElement = document.querySelector('.timer');
	if (timerElement) {
		timerElement.textContent = `Time left: ${timeLeft}s`;
	}

	// Set interval to count down
	timer = setInterval(() => {
		timeLeft--;
		// Update display
		if (timerElement) {
			timerElement.textContent = `Time left: ${timeLeft}s`;
		}
		        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timer);
            showCustomDialog(`Time's up! That was ${currentCity.name}.`);
            const guessInputEl = document.getElementById('guessInput');
            const submitBtnEl = document.getElementById('submitGuess');
            if (guessInputEl) guessInputEl.disabled = true;
            if (submitBtnEl) submitBtnEl.disabled = true;
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.style.display = 'block';
        }
    }, 1000);
}

// Fix cities info functionality
function initializeCitiesInfo() {
	console.log('Initializing cities info');
	
	// Get cities info container
	const citiesGrid = document.querySelector('.cities-grid');
	if (!citiesGrid) {
		console.error('Cities grid not found');
		return;
	}
	
	// Clear existing content
	citiesGrid.innerHTML = '';
	
	// Add each city to the grid
	const allCities = getAllCities ? getAllCities() : cities;
	allCities.forEach(city => {
		const cityCard = document.createElement('div');
		cityCard.className = 'city-card';
		
		const cityImage = document.createElement('div');
		cityImage.className = 'city-image';
		
		const img = document.createElement('img');
		img.src = city.image;
		img.alt = city.name;
		img.loading = 'lazy';
		img.onerror = function() {
			this.src = 'https://placehold.co/300x200?text=Image+Not+Available';
		};
		
		cityImage.appendChild(img);
		
		const cityInfo = document.createElement('div');
		cityInfo.className = 'city-info';
		
		cityInfo.innerHTML = `
			<h3>${city.name}, ${city.country}</h3>
			<div class="city-facts">
				<h4>Fun Facts:</h4>
				<ul>
					${city.facts.map(fact => `<li>${fact}</li>`).join('')}
				</ul>
			</div>
		`;
		
		cityCard.appendChild(cityImage);
		cityCard.appendChild(cityInfo);
		citiesGrid.appendChild(cityCard);
	});
}

// Mouse and touch event handlers for carousel
function handleDragStart(e) {
	isDragging = true;
	if (rotationInterval) {
		clearInterval(rotationInterval);
	}
	lastMouseY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
	lastTime = performance.now();
	rotationSpeed = 0;
	
	// Add temporary event listeners for mouse
	if (e.type === 'mousedown') {
		document.addEventListener('mousemove', handleDragMove);
		document.addEventListener('mouseup', handleDragEnd);
	}
}

function handleDragMove(e) {
	if (!isDragging) return;

	const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
	const deltaY = currentY - lastMouseY;
	const currentTime = performance.now();
	const deltaTime = currentTime - lastTime;

	// Calculate rotation speed (pixels per millisecond)
	rotationSpeed = deltaY / deltaTime;
	
	// Update rotation with smooth factor
	currentRotation += deltaY * 0.3;
	updateCarouselRotation();

	lastMouseY = currentY;
	lastTime = currentTime;
}

function handleDragEnd() {
	if (!isDragging) return;
	isDragging = false;

	// Remove temporary event listeners
	document.removeEventListener('mousemove', handleDragMove);
	document.removeEventListener('mouseup', handleDragEnd);

	// Apply momentum
	rotationMomentum = rotationSpeed * 100;
	applyMomentum();
}

function applyMomentum() {
	if (Math.abs(rotationMomentum) > 0.01) {
		currentRotation += rotationMomentum;
		rotationMomentum *= 0.95; // Decay factor
		updateCarouselRotation();
		requestAnimationFrame(applyMomentum);
	} else {
		// Resume auto-rotation after momentum ends
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
		autoRotate();
	}
}

function updateCarouselRotation() {
	const carousel = document.getElementById('carousel');
	if (carousel) {
		carousel.style.transform = `rotateX(${currentRotation}deg)`;
	}
}

function autoRotate() {
	if (rotationInterval) {
		clearInterval(rotationInterval);
	}
	
	rotationInterval = setInterval(() => {
		currentRotation += 0.5;
		updateCarouselRotation();
	}, 30);
}

// Save achievements to localStorage
function saveAchievements() {
	localStorage.setItem('achievements', JSON.stringify(achievements));
	updateAchievementUI();
}

// Navigation function to show daily challenge page
function showDailyChallenge() {
	showSection('daily-challenge-page');
	updateDailyChallengeUI();
}

// Function to load achievements from localStorage
function loadAchievements() {
	const savedAchievements = localStorage.getItem('achievements');
	if (savedAchievements) {
		try {
			const parsed = JSON.parse(savedAchievements);
			// Update our achievements object with saved values
			for (const key in parsed) {
				if (achievements[key]) {
					achievements[key] = parsed[key];
				}
			}
			console.log('Achievements loaded from localStorage');
		} catch (e) {
			console.error('Error parsing saved achievements:', e);
		}
	} else {
		console.log('No saved achievements found');
	}
	
	// Initialize the UI
	updateAchievementUI();
} 