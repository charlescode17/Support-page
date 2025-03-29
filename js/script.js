// scripts.js
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const supportButton = document.getElementById('supportButton');
    const ussdCode = '*182*1*1*0788267156#';
    
    // Function to check if device supports USSD
    const isUSSDSupported = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Function to encode USSD code for URL
    const encodeUSSDCode = (code) => {
        return encodeURIComponent(code).replace(/%23/g, '#');
    };

    // Function to handle USSD dialing
    const handleUSSDDial = () => {
        // Show loading state
        supportButton.classList.add('loading');
        
        // Create a small delay to show the loading state
        setTimeout(() => {
            try {
                if (!isUSSDSupported()) {
                    throw new Error('USSD not supported on this device');
                }

                const encodedCode = encodeUSSDCode(ussdCode);
                const telUrl = `tel:${encodedCode}`;
                
                // Check if tel: protocol is supported
                if (!navigator.msLaunchUri) {
                    window.location.href = telUrl;
                } else {
                    // Fallback for Windows Phone
                    navigator.msLaunchUri(telUrl, 
                        () => {
                            // Success callback
                            setTimeout(() => {
                                supportButton.classList.remove('loading');
                            }, 1000);
                        },
                        (error) => {
                            // Error callback
                            throw new Error('Failed to launch phone app');
                        }
                    );
                }
            } catch (error) {
                // Handle specific error cases
                console.error('Error dialing USSD code:', error);
                supportButton.classList.remove('loading');
                
                let errorMessage = 'Unable to dial the USSD code. ';
                if (error.message.includes('not supported')) {
                    errorMessage += 'Your device may not support USSD codes. ';
                }
                errorMessage += 'Please try dialing manually: ' + ussdCode;
                
                alert(errorMessage);
            }
        }, 300);
    };

    // Add click event listener with debouncing
    let isProcessing = false;
    supportButton.addEventListener('click', () => {
        if (!isProcessing) {
            isProcessing = true;
            handleUSSDDial();
            
            // Prevent multiple clicks
            setTimeout(() => {
                isProcessing = false;
            }, 1000);
        }
    });

    // Add keyboard support for accessibility
    supportButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleUSSDDial();
        }
    });

    // Add touch feedback for mobile devices
    supportButton.addEventListener('touchstart', () => {
        supportButton.style.transform = 'scale(0.98)';
    });

    supportButton.addEventListener('touchend', () => {
        supportButton.style.transform = 'scale(1)';
    });
});
