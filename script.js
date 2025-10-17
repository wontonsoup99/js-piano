const audioContext = new (window.AudioContext)();

// Complete frequency array for all keys (white + black)
const frequency = [
    // White keys
    440.00, 493.88, 523.25, 587.33, 659.25,
    698.46, 783.99, 880.00, 987.77, 1046.50,
    // Black keys
    466.16, 554.37, 622.25, 739.99, 830.61, 932.33, 1108.73
];

const activeOscillators = {};

const keyMap = {
    // White keys
    'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4,
    'h': 5, 'j': 6, 'k': 7, 'l': 8, ';': 9,
    // Black keys
    'w': 10, 'e': 11, 't': 12, 'y': 13,
    'u': 14, 'o': 15, 'p': 16
};

function getVisualKey(key) {
    return document.querySelector(`[data-key="${key}"]`);
}


const volumeSlider = document.getElementById('volume-slider');
let currentVolume = 1; 
const showKeysButton = document.getElementById('show-keys');
let showKeys = true;
const keyLabels = document.querySelectorAll('.label');


volumeSlider.addEventListener("change", function(e) {
    currentVolume = e.currentTarget.value / 100;
})

showKeysButton.addEventListener("click", function(e){
    showKeys = !showKeys;
    
    keyLabels.forEach(label => {
        label.classList.toggle('hidden', !showKeys);
    });
})

document.addEventListener("keydown", function(e){
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const key = e.key.toLowerCase();
    
    if(keyMap[key] !== undefined && !activeOscillators[key]){

        const visualKey = getVisualKey(key);
        if(visualKey) {
            visualKey.classList.add('pressed');
        } else {
        }
        
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency[keyMap[key]];
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = currentVolume;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        activeOscillators[key] = {
            oscillator: oscillator,
            gainNode: gainNode
        };
    }
});

document.addEventListener("keyup", function(e){
    const key = e.key.toLowerCase();
    
    if(activeOscillators[key]){

        const visualKey = getVisualKey(key);
        if(visualKey) {
            visualKey.classList.remove('pressed');
        }
        
        activeOscillators[key].oscillator.stop();
        activeOscillators[key].oscillator.disconnect();
        activeOscillators[key].gainNode.disconnect();
        delete activeOscillators[key];
    }
});

