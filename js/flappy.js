let setIntervalCriaCanos
let setIntervalMoveCanos
let setIntervalMovePassaro

let rodando = false

let telaInicial = true

let tempTop = 0

let canosSup = []
let canosInf = []

let contadorPontos = 0

let sobe = false

const passaro = document.querySelector('.bird')

function getTop() {
    return Math.floor(Math.random() * (350 - 100) + 150)
}

const intervalCriaCanos = () => {
    canosSup.push(criaCanos('superior'));
    canosInf.push(criaCanos('inferior'));

    removeCanos(canosSup, true);
    removeCanos(canosInf);
};

function criaCanos(pos) {
    const div = document.createElement('div')
    div.className = pos
    div.innerHTML = '<div class="propBarraVert cor"></div><div class="propBarraHoriz cor"></div>'

    if (pos === 'superior') {
        tempTop = getTop()
    }

    document.querySelector('.pontuacao').innerHTML = `SCORE ${contadorPontos + canosSup.filter((c)=> c.left <= 294).length}`;

    const topDefinido = pos === 'superior' ? -tempTop : (-tempTop + 600);
    div.style.top = `${topDefinido}px`
    div.style.left = '1010px'
    document.querySelector('[wm-flappy]').appendChild(div)
    return {
        left: 1010,
        top: topDefinido,
        right: function () { return this.left + 154 },
        bottom: function () { return this.top + 434 },
        cano: div
    }
}

const intervalMoveCanos = () => {
    canosSup.forEach((obj) => {
        styleLeft(obj)
    })
    canosInf.forEach((obj) => {
        styleLeft(obj)
    })
}

function styleLeft(obj) {
    obj.cano.style.left = `${obj.left}px`
    obj.left--
    return
}

function removeCanos(arr, incrementa = false) {
    arr.forEach(obj => {
        if (obj.left <= -235) {
            obj.cano.remove()
            arr.shift()
            if (incrementa) {
                contadorPontos++
            }
            return
        }
    })
}

function limpaSetIntervals() {
    clearInterval(setIntervalCriaCanos)
    clearInterval(setIntervalMoveCanos)
    clearInterval(setIntervalMovePassaro)
    contadorPontos = 0
    rodando = false
    document.querySelector('.fim').style.display = 'block'
    setTimeout(() => {
        telaInicial = true
        document.querySelector('.fim').style.display = 'none'
        document.querySelector('.inicio').style.display = 'block'
        posPassaro.top = 250
    }, 2000);
}

let posPassaro = {
    top: 250,
    bottom: function () { return this.top + 40 },
    left: 450,
    right: 506
}

document.addEventListener('keydown', (event) => {
    if (event.code === "Space") {
        sobe = true
        if (!rodando && telaInicial) {
            canosSup.forEach((obj) => {
                obj.cano.remove()
            })
            canosInf.forEach((obj) => {
                obj.cano.remove()
            })

            canosSup = [criaCanos('superior')]
            canosInf = [criaCanos('inferior')]
            setIntervalCriaCanos = setInterval(intervalCriaCanos, 2000);
            setIntervalMoveCanos = setInterval(intervalMoveCanos, 5);
            setIntervalMovePassaro = setInterval(intervalMovePassaro, 5);
            rodando = true
            telaInicial = false
            document.querySelector('.inicio').style.display = 'none'
            contadorPontos = 0
            document.querySelector('.pontuacao').innerHTML = `SCORE ${contadorPontos}`
        }
    }
})

document.addEventListener('keyup', () => {
    sobe = false
})

const intervalMovePassaro = () => {
    if (sobe) {
        posPassaro.top--;
    } else {
        posPassaro.top++;
    }
    passaro.style.top = `${posPassaro.top}px`;

    canosSup.forEach(element => {
        if ((
            (posPassaro.right > element.left && posPassaro.right < element.right())
            ||
            (posPassaro.left > element.left && posPassaro.left < element.right())
        )
            && posPassaro.top < element.bottom() &&
            posPassaro.top > element.top) {
            limpaSetIntervals();
        }

    });

    canosInf.forEach(element => {
        if ((
            (posPassaro.right > element.left && posPassaro.right < element.right())
            ||
            (posPassaro.left > element.left && posPassaro.left < element.right())
        )
            && posPassaro.bottom() < element.bottom() &&
            posPassaro.bottom() > element.top) {
            limpaSetIntervals();
        }
    });

    if (posPassaro.top === 0 || posPassaro.bottom() === 600) {
        limpaSetIntervals();
    }
};