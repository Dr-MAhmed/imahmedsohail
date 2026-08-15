import { useEffect } from 'react';

/**
 * Faithful port of script.js "makeFaviconRounded" (section 8b).
 * Rounds the favicon by drawing the logo clipped to a circle on a 32x32
 * canvas and swapping the <link rel="icon"> to the generated data URL.
 */
export function useRoundedFavicon() {
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/logo.png';
        img.onload = () => {
            // Create a small canvas for the favicon (32x32)
            const canvasFav = document.createElement('canvas');
            canvasFav.width = 32;
            canvasFav.height = 32;
            const ctxFav = canvasFav.getContext('2d');

            // Draw circular clip path
            ctxFav.beginPath();
            ctxFav.arc(16, 16, 16, 0, Math.PI * 2);
            ctxFav.closePath();
            ctxFav.clip();

            // Draw image scaled to 32x32
            ctxFav.drawImage(img, 0, 0, 32, 32);

            // Update favicon elements link
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.type = 'image/x-icon';
            link.href = canvasFav.toDataURL('image/png');
        };
    }, []);
}
