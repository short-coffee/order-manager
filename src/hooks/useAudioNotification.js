import { useState } from 'react';

let audioInstance = null;
let globalAudioUnlocked = false;

export const useAudioNotification = () => {
    if (!audioInstance) {
        audioInstance = new Audio('/sounds/sound.mp3');
    }

    const [showAudioModal, setShowAudioModal] = useState(!globalAudioUnlocked);
    const [isClosing, setIsClosing] = useState(false);

    const playNotificationSound = () => {
        if (!audioInstance) return;
        audioInstance.currentTime = 0;
        audioInstance.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    };

    const enableAudio = () => {
        if (!audioInstance) return;

        // Play and immediately pause to unlock audio context without sound
        audioInstance.volume = 0;
        audioInstance.play().then(() => {
            audioInstance.pause();
            audioInstance.currentTime = 0;
            audioInstance.volume = 1; // Reset volume for actual notifications
            globalAudioUnlocked = true;
        }).catch(error => {
            console.log('Audio unlock failed:', error);
        });

        globalAudioUnlocked = true;
        setIsClosing(true);
        setTimeout(() => {
            setShowAudioModal(false);
        }, 500); // Wait for animation
    };

    return {
        showAudioModal,
        isClosing,
        playNotificationSound,
        enableAudio
    };
};
