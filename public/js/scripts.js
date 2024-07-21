document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');

    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/data/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
    }
});

document.getElementById('downloadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    window.location.href = `/data/download?startDate=${startDate}&endDate=${endDate}`;
});
