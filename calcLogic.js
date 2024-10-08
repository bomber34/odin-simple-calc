const resultLabel = document.getElementById("result");
const previousInfo = document.getElementById("helperInfo");
const MAX_RESULT_LEN = 16;
const MAX_PREV_CALC_LEN = 25;

const mathObj = {
    lhs: '',
    chosenOperation: '',
    rhs: '',
    isChained: false
}
const VALID_OPERATIONS = ['+', '-', '*', '/'];

// Actual math part
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    if (y == 0) {
        return "ERROR";
    }

    return x / y;
}

// String operations for number inputs
function removeLastDigit() {
    let displayNum = mathObj.lhs;
    if (mathObj.rhs === '') {
        mathObj.lhs = mathObj.lhs.slice(0, mathObj.lhs.length-1);
        mathObj.lhs = mathObj.lhs === '' ? '0' : mathObj.lhs
        displayNum = mathObj.lhs;
    } else if (mathObj.isChained) {
        mathObj.rhs = mathObj.rhs.slice(0, mathObj.rhs.length-1);
        mathObj.rhs = mathObj.rhs === '' ? '0' : mathObj.rhs
        displayNum = mathObj.rhs;
    }
    updateResultLabel(displayNum);
}

function addDigitToNumber(digit) {
    let output = "0";
    let isLhs = false;
    if (mathObj.chosenOperation === '') {
        output = addDigitToMathObj(digit, mathObj.lhs);
        isLhs = true;
    } else {
        output = addDigitToMathObj(digit, mathObj.rhs);
    }
    updateObjNumber(output, isLhs);
    updateResultLabel(output);
}

function addDigitToMathObj(digit, currentNum) {
    if (currentNum.length >= MAX_RESULT_LEN) {
        currentNum = currentNum.slice(0, -1);
    }
    const dot = '.'
    if (isSpecialInput(digit, currentNum)) {
        currentNum = handleDot(digit, currentNum);
    } else {
        currentNum += digit;
    }

    return currentNum;
}

function handleDot(digit, currentNum) {
    if (currentNum == '' || currentNum == '0') {
        currentNum = digit == '.' ? "0." : digit;
    }
    return currentNum;
}

function isSpecialInput(digit, currentNum) {
    const dot = '.'
    return currentNum === ''
        || currentNum === '0'
        || (digit == dot && currentNum.split('').includes(dot));
}

function updateObjNumber(number, isLhs) {
    if (isLhs) {
        mathObj.lhs = number;
    } else {
        mathObj.rhs = number
        mathObj.isChained = true;
    }
}

function operateOnObj(obj) {
    return operate(obj.lhs, obj.chosenOperation, obj.rhs);
}

function operate(x, op, y) {
    if ([x, op, y].some((val) => val === '')) {
        return 0;
    }
    [x, y] = [x, y].map((val) => parseFloat(val));

    let func;
    switch (op) {
        case '+':
            func = add;
            break;
        case '-':
            func = subtract;
            break;
        case '*':
            func = multiply;
            break;
        case '/':
            func = divide;
            break;
        default:
            return "UNSUPPORTED OPERATION";
    }
    return func(x, y);
}

function clearOp() {
    for (let prop in mathObj) {
        mathObj[prop] = '';
    }
    updateResultLabel("0");
    clearPreviousInfo();
}

function handleResult(res) {
    if (typeof res === 'string') {
        clearOp();
    } else {
        mathObj.lhs = parseFloat(res);

    }
}

function displayResult(isChained) {
    const opRes = operateOnObj(mathObj);
    updatePreviousInfo(mathObj.lhs, mathObj.chosenOperation, mathObj.rhs);
    handleResult(opRes);
    updateResultLabel(opRes);
    mathObj.isChained = isChained;
}

// UI Functions
function chooseOperationBtnClick(chosenOp) {
    if (mathObj.lhs !== '') {

        if (mathObj.isChained
            && mathObj.rhs !== '' 
            && mathObj.chosenOperation !== '') {
            displayResult(true);
        }

        mathObj.chosenOperation = chosenOp;
        mathObj.rhs = '';
        updatePreviousInfo(mathObj.lhs, chosenOp);
    }
}

function clearPreviousInfo() {
    previousInfo.textContent = " ";
}

function updatePreviousInfo(left, op, right) {
    const lastSymbol = previousInfo.textContent.charAt(previousInfo.textContent.length-1);
    if (VALID_OPERATIONS.includes(lastSymbol)) {
        previousInfo.textContent.slice(0, previousInfo.textContent.length-1);
    }

    previousInfo.textContent = `${left} ${op}`;

    if (right !== undefined) {
        previousInfo.textContent += ` ${right}`;
    }

    if (previousInfo.textContent.length > MAX_PREV_CALC_LEN) {
        const startIndex = previousInfo.textContent.length - MAX_PREV_CALC_LEN - 3;
        previousInfo.textContent = "..." + previousInfo.textContent.slice(startIndex);
    }
}

function updateResultLabel(output) {
    if (typeof output == "number") {
        let displayableNum = `${output}`;
        let overSpaceLen = displayResult.length - MAX_RESULT_LEN;
        if (displayableNum.charAt(displayableNum.length-overSpaceLen == '.')) {
            overSpaceLen++;
        }

        if (overSpaceLen > 0) {
            displayableNum = displayableNum.slice(0, displayableNum.length-overSpaceLen);
        }

        output = displayableNum;
    }

    resultLabel.textContent = output;
}

document.querySelector("body").addEventListener("keydown", (event) => {
    const pressedKey = event.key
    if (VALID_OPERATIONS.includes(pressedKey)) {
        chooseOperationBtnClick(pressedKey);
    } else if (parseInt(pressedKey) >= 0) {
        addDigitToNumber(pressedKey);
    } else if (pressedKey == '.') {
        addDigitToNumber(pressedKey);
    } else if (pressedKey == '=' || pressedKey == "Enter") {
        displayResult(false);
    } else if (pressedKey == "Escape" || pressedKey == "Delete") {
        clearOp()
    } else if (pressedKey == "Backspace") {
        removeLastDigit();
    }
})

// Initialize UI
previousInfo.textContent = " "
resultLabel.textContent = "0";