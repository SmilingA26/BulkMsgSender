document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        populateTable(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');

        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        const sendButton = document.createElement('button');
        sendButton.textContent = 'Send Message';
        sendButton.onclick = () => sendMessage(row[1], row[2]);
        actionTd.appendChild(sendButton);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });
}

function sendMessage(number, message) {
    console.log(`Sending message to: ${number} - ${message}`); // Debug log
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

document.getElementById('sendAll').addEventListener('click', () => {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    rows.forEach((row, index) => {
        setTimeout(() => {
            const cells = row.getElementsByTagName('td');
            const number = cells[1].textContent;
            const message = cells[2].textContent;
            console.log(`Queueing message to: ${number} - ${message}`); // Debug log
            sendMessage(number, message);
        }, index * 2000); // Open a new tab every 2 seconds to avoid browser restrictions
    });
});
