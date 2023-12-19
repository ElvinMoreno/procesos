/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let PROCESS = [];
let cyclesDispatcher = 0;
let cyclesInterrupts = 0;
const estadoProcesos = {};
let timeTotal = 0;

function addProcess() {
    const inputElement = document.getElementById('processInput');
    const infoProcess = inputElement.value.trim();

    // Validar que los datos sean números o los caracteres 'I', 'F', 'T'
    const isValidData = /^([1-9]\d{0,3}|10000)(,([0-9]|[1-9]\d{0,3}|I|F|T))*$/i.test(infoProcess);

    if (isValidData) {
        // Divide la cadena de entrada en procesos utilizando la coma como separador
        const separatedProcesses = infoProcess.split(',');

        // Validar que el primer elemento sea un número
        const firstElement = separatedProcesses[0].trim();
        if (!isNaN(firstElement)) {
            // Filtra procesos vacíos y agrega al array bidimensional
            const validProcesses = separatedProcesses.filter(process => process.trim() !== '');
            PROCESS.push(validProcesses);

            inputElement.value = '';
        
            document.getElementById("size").textContent = PROCESS.length;
        } else {
            document.getElementById("size").textContent = ('Datos no válidos.');
            // Puedes tomar otras acciones según tus necesidades, como mostrar un mensaje de error.
        }
    } else {
        document.getElementById("size").textContent = ('Datos no válidos.');
        // Puedes tomar otras acciones según tus necesidades, como mostrar un mensaje de error.
    }
}











function showR() {
    const outBody = document.getElementById('outBody');
    outBody.innerHTML = '';

    for (let i = 0; i < PROCESS.length; i++) {
        const Out = procesarinfoProcess(PROCESS[i]);

        const row = document.createElement('tr');
        const cellinfoProcess = document.createElement('td');
        const cellOut = document.createElement('td');

        cellinfoProcess.textContent = "P-" + i;
        cellOut.textContent = PROCESS[i];

        row.appendChild(cellinfoProcess);
        row.appendChild(cellOut);

        outBody.appendChild(row);
    }
}
function processInfo(info) {
    // Realizar cualquier procesamiento necesario en la información del proceso
    return info.length;
}

function displayDispatcher() {
    roundRobinScheduling();
    document.getElementById("outDispatcher").textContent = "Must print the dispatcher run table";

    const body = document.getElementById('body');
    body.innerHTML = '';

    for (let i = 0; i < PROCESS.length; i++) {
        const row = document.createElement('tr');
        const cellProcessIndex = document.createElement('td');
        cellProcessIndex.textContent = "P-" + i;
        row.appendChild(cellProcessIndex);

        for (let j = 0; j < PROCESS[i].length; j++) {
            const cellData = document.createElement('td');
            cellData.textContent = PROCESS[i][j];

            if (PROCESS[i][j].includes('F')) {
                cellData.style.backgroundColor = 'red';
            } else if (!isNaN(PROCESS[i][j])) {
                cellData.style.backgroundColor = 'green';
            }
            row.appendChild(cellData);
        }
        body.appendChild(row);
    }
}

function readAndDisplayData() {
    cyclesDispatcher = prompt("Dispatcher Cycles:");
    cyclesInterrupts = prompt("Interrupts Cycles:");

    if (!validateDispatcherInput(cyclesDispatcher, cyclesInterrupts)) {
        alert("Invalid dispatcher or interrupts cycles. Please check the guidelines.");
        return;
    }

    document.getElementById("result").innerHTML = `
        <p>Dispatcher Cycles: ${cyclesDispatcher}</p>
        <p>Interrupts Cycles: ${cyclesInterrupts}</p>
    `;
}

function roundRobinScheduling() {
    let allLinesExecuted = false;
    let time = 1 - cyclesDispatcher;
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Time</th><th>Trace</th></tr>';

    const intervalId = setInterval(() => {
        allLinesExecuted = true;

        for (let i = 0; i < PROCESS.length; i++) {
            let dispatch = 100;

            for (let k = 0; k < cyclesDispatcher; k++) {
                const row = table.insertRow();
                const timeCell = row.insertCell(0);
                const traceCell = row.insertCell(1);

                if (time > 0) {
                    timeCell.textContent = time;
                }
                traceCell.textContent = dispatch;
                dispatch = dispatch + 1;
                time++;
            }

            const currentProcess = PROCESS[i][0];
            let currentLineIndex = processStates[currentProcess] || 0;

            for (let j = 0; j < cyclesInterrupts; j++) {
                const line = PROCESS[i][currentLineIndex];

                if (line != null) {
                    if (line.toLowerCase() === 'i' || line.toLowerCase() === 't') {
                        allLinesExecuted = false;
                        displayExecutionRow(time, line);
                        currentLineIndex++;
                        processStates[currentProcess] = currentLineIndex;
                        time++;
                        j = cyclesInterrupts + 1;
                    } else {
                        allLinesExecuted = false;
                        displayExecutionRow(time, line, true);
                        currentLineIndex++;
                        processStates[currentProcess] = currentLineIndex;
                        time++;
                        timeTotal = time - 1;
                    }
                }
            }
        }

        totalTime();

        if (allLinesExecuted || cyclesInterrupts <= 0) {
            clearInterval(intervalId);
            document.getElementById("outDispatcher").innerHTML = '';
            document.getElementById("outDispatcher").appendChild(table);
        };
    }, 1000);
}

function totalTime() {
    document.getElementById("output").textContent = ('Tiempo consumido por el sistema: ' + timeTotal);
}

function displayExecutionRow(time, trace, isNumber = false) {
    const row = table.insertRow();
    const timeCell = row.insertCell(0);
    const traceCell = row.insertCell(1);

    if (time > 0) {
        timeCell.textContent = time;
    }

    traceCell.textContent = trace;

    if (isNumber) {
        traceCell.style.backgroundColor = 'green';
    }
}

