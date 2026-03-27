// Image slot click handlers
const slots = document.querySelectorAll('.image-slot');
slots.forEach(slot => {
    slot.addEventListener('click', async () => {
        const slotNumber = slot.dataset.slot;
        const filePath = await window.electronAPI.selectImage();
        
        if (filePath) {
            const img = document.getElementById(`image${slotNumber}`);
            const text = slot.querySelector('.slot-text');
            
            img.src = filePath;
            img.style.display = 'block';
            text.style.display = 'none';
        }
    });
});

// Save collage button
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', async () => {
    try {
        // Hide window controls before capturing
        const windowControls = document.querySelector('.window-controls');
        windowControls.style.display = 'none';
        
        const container = document.querySelector('.container');
        const canvas = await html2canvas(container, {
            backgroundColor: null,
            scale: 2,
            logging: false
        });
        
        // Show window controls again
        windowControls.style.display = 'flex';
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Save the image
        const saved = await window.electronAPI.saveCollage(dataUrl);
        
        if (saved) {
            alert('Collage saved successfully!');
        }
    } catch (error) {
        console.error('Error saving collage:', error);
        alert('Failed to save collage. Please try again.');
        
        // Make sure to show window controls again
        const windowControls = document.querySelector('.window-controls');
        windowControls.style.display = 'flex';
    }
});

// Window control buttons
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

minimizeBtn.addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
});

closeBtn.addEventListener('click', () => {
    window.electronAPI.closeWindow();
});