const audioContext = new (window.AudioContext)();

// Complete frequency array for all keys (white + black)
const frequency = [
    // White keys
    440.00, 493.88, 523.25, 587.33, 659.25,
    698.46, 783.99, 880.00, 987.77, 1046.50,
    // Black keys
    466.16, 554.37, 622.25, 739.99, 830.61, 932.33, 1108.73
];

let gain = 0.5;
const activeOscillators = {};

// Complete key mapping including black keys
const keyMap = {
    // White keys
    'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4,
    'h': 5, 'j': 6, 'k': 7, 'l': 8, ';': 9,
    // Black keys
    'w': 10, 'e': 11, 't': 12, 'y': 13,
    'u': 14, 'o': 15, 'p': 16
};

// Helper function to get visual key element using data-key attribute
function getVisualKey(key) {
    return document.querySelector(`[data-key="${key}"]`);
}

document.addEventListener("keydown", function(e){
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const key = e.key.toLowerCase();
    
    if(keyMap[key] !== undefined && !activeOscillators[key]){
        // Visual feedback
        const visualKey = getVisualKey(key);
        if(visualKey) {
            console.log("Pressing key:", key);
            visualKey.classList.add('pressed');
        } else {
            console.log("Could not find visual key for:", key);
        }
        
        // Audio
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency[keyMap[key]];
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = gain;
        
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
        // Remove visual feedback
        const visualKey = getVisualKey(key);
        if(visualKey) {
            console.log("Releasing key:", key);
            visualKey.classList.remove('pressed');
        }
        
        // Stop audio
        activeOscillators[key].oscillator.stop();
        activeOscillators[key].oscillator.disconnect();
        activeOscillators[key].gainNode.disconnect();
        delete activeOscillators[key];
    }
});