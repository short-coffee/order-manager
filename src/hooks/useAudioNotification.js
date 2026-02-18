import { useRef, useState } from 'react';

export const useAudioNotification = () => {
    const audioRef = useRef(new Audio('/sound.mp3'));
    const [showAudioModal, setShowAudioModal] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const playNotificationSound = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    };

    const enableAudio = () => {
        // Play and immediately pause to unlock audio context without sound
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 1; // Reset volume for actual notifications
        }).catch(error => {
            console.log('Audio unlock failed:', error);
        });

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
