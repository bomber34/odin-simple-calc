const resultLabel = document.getElementById("result");

const mathObj = {
    lhs: '',
    chosenOperation: '',
    rhs: ''
}
const validOperations = ['+', '-', '*', '/'];

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
    const dot = '.'
    if (isSpecialInput(digit, currentNum)) {
        currentNum = handleDot(digit, currentNum);
    } else {
        currentNum += digit;
    }
    return currentNum;
}

function handleDot(digit, currentNum) {
    if (currentNum == '') {
        currentNum = digit == '.' ? "0." : digit;
    }
    return currentNum;
}

function isSpecialInput(digit, currentNum) {
    const dot = '.'
    return currentNum === ''
        || (currentNum === '0' && digit === '0')
        || (digit == dot && currentNum.split('').includes(dot));
}

function updateObjNumber(number, isLhs) {
    if (isLhs) {
        mathObj.lhs = number;
    } else {
        mathObj.rhs = number
    }
}

function updateResultLabel(output) {
    resultLabel.textContent = output;
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

function chooseOperationBtnClick(chosenOp) {
    if (mathObj.lhs !== '') {
        mathObj.chosenOperation = chosenOp;
        mathObj.rhs = '';
    }
}

function clearOp() {
    for (let prop in mathObj) {
        mathObj[prop] = '';
    }
    updateResultLabel("0");
}

function displayResult() {
    const opRes = operate(mathObj.lhs, mathObj.chosenOperation, mathObj.rhs);
    resultLabel.textContent = opRes;

    if (typeof opRes === 'string') {
        clearOp();
    } else {
        mathObj.lhs = parseFloat(opRes);
    }
}