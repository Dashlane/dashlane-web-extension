window.addEventListener('touchstart', function setHasTouch() {
    document.body.className += ' has-touch';
    window.removeEventListener('touchstart', setHasTouch);
}, false);
