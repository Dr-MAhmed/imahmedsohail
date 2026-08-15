import { useEffect } from 'react';

/**
 * Faithful port of script.js "initTypewriter" (section 8a).
 * Types, pauses, then deletes a rotating list of phrases inside the element
 * referenced by `ref`, followed by the blinking terminal cursor.
 */
const WORDS = [
    "MERN Stack Developer",
    "Cloud & DevOps Enthusiast",
    "Software Engineer",
    "Turning Code Into Products",
    "Architecting Digital Innovations",
    "Backend Engineer"
];

export function useTypewriter(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let wordIndex = 0;
        const timers = [];

        const setTimer = (fn, ms) => {
            const id = setTimeout(fn, ms);
            timers.push(id);
            return id;
        };

        function typingEffect() {
            let word = WORDS[wordIndex].split('');

            const loopTyping = () => {
                if (word.length > 0) {
                    el.innerHTML += word.shift();
                    setTimer(loopTyping, 80);
                } else {
                    setTimer(deletingEffect, 2000);
                    return false;
                }
            };
            loopTyping();
        }

        function deletingEffect() {
            let word = WORDS[wordIndex].split('');

            const loopDeleting = () => {
                if (word.length > 0) {
                    word.pop();
                    el.innerHTML = word.join('');
                    setTimer(loopDeleting, 40);
                } else {
                    if (WORDS.length > (wordIndex + 1)) {
                        wordIndex++;
                    } else {
                        wordIndex = 0;
                    }
                    setTimer(typingEffect, 500);
                    return false;
                }
            };
            loopDeleting();
        }

        typingEffect();

        return () => {
            timers.forEach(clearTimeout);
            el.innerHTML = '';
        };
    }, [ref]);
}
