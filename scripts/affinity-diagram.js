window.onload = event => {

    let currentCard = null;
    let isDownMouse = false;
    let clickXonCard = 0
    let clickYonCard = 0

    document.onmousemove = onMouseMove => {
        if (isDownMouse) {
            if (currentCard != null) {
                let x = onMouseMove.x - clickXonCard
                let y = onMouseMove.y - clickYonCard
                currentCard.style.left =  x + "px"
                currentCard.style.top = y + "px"

            }
        }
    }

    document.onmouseup = onMouseUP => {
        console.log("onmouseup document")
        isDownMouse = false
        currentCard = null
        clickXonCard = 0
        clickYonCard = 0
    }


    function createNewCard() {
        let card = document.createElement("div")
        card.draggable = false
        card.className = "card"
        card.onmousedown = onMouseDown => {
            if (onMouseDown.target.className === "card") {
                isDownMouse = true
                currentCard = onMouseDown.target
                clickXonCard = onMouseDown.offsetX
                clickYonCard = onMouseDown.offsetY
            }
        }

        card.oncontextmenu = onContextMenuEvent => {
            onContextMenuEvent.preventDefault()
            onContextMenuEvent.stopPropagation()
            document.body.removeChild(onContextMenuEvent.target)
        }

        let cardHead = document.createElement("textarea")
        cardHead.className = "card-head"
        cardHead.placeholder = "Título"

        let cardBody = document.createElement("textarea")
        cardBody.className = "card-body"
        cardBody.placeholder = "Cuerpo"

        card.append(cardHead)
        card.append(cardBody)

        return card
    }

    let postIt = document.getElementById("post-it")
    postIt.onclick = onClickEvent => {
        document.body.appendChild(createNewCard())
    }

}