window.onload = event => {
    let currentCard = null; //Current card selected
    let isDownMouse = false; //Is true when click is down
    let scale = 1 //Current scale for cards
    let clickXonCard = 0 //Original position X clicked on card
    let clickYonCard = 0 //Original position Y clicked on card

    let compensationY = 0
    let compensationX = 0

    let cardZone = document.getElementById("card-zone")
    let compensationCardZoneX = cardZone.offsetLeft
    let compensationCardZoneY = cardZone.offsetTop
    console.log(compensationCardZoneX)
    console.log(compensationCardZoneY)


    let translateX = 0
    let translateY = 0
    let lastYPos = 0
    let lastXPos = 0


    //Update compensationY
    window.onresize = onChange => {
        console.log("onChange")
        compensationCardZoneX = cardZone.offsetLeft
        compensationCardZoneY = cardZone.offsetTop
    }


    document.onmousemove = onMouseMove => {
        if (isDownMouse) {
            //Moving card position
            if (currentCard != null) {
                let x = (onMouseMove.x - ((compensationCardZoneX + (clickXonCard * scale) + compensationX + translateX)))
                let y = (onMouseMove.y - ((compensationCardZoneY + (clickYonCard * scale) + compensationY + translateY)))
                x *= 1 / scale //Scale x and y moving
                y *= 1 / scale
                currentCard.style.left =  x + "px"
                currentCard.style.top = y + "px"
            }

            //Translating card zone
            else {
                let x = onMouseMove.x - lastXPos
                let y = onMouseMove.y - lastYPos

                //Update X position
                if (x > 0) {
                    translateX += 10
                }
                else if (x < 0) {
                    translateX -= 10
                }

                //Update Y position
                if (y > 0) {
                    translateY += 7
                }
                else if (y < 0) {
                    translateY -= 7
                }

                //Apply transform in X and Y translate
                cardZone.style.transform = `translateX(${(translateX)}px) translateY(${(translateY)}px) scale(${scale})`

                lastXPos = onMouseMove.x
                lastYPos = onMouseMove.y
            }
        }
    }

    document.onmousedown = onMouseDownEvent => {
        isDownMouse = true
        document.body.style.cursor = "grabbing" //Change cursor icon
    }

    document.onmouseup = onMouseUP => {
        console.log("onmouseup document")
        isDownMouse = false
        currentCard = null
        clickXonCard = 0
        clickYonCard = 0
        lastXPos = 0
        lastYPos = 0
        document.body.style.cursor = "grab" //Change cursor to default
    }


    document.onwheel = onWheelEvent => {
        console.log("onwheel")

        scale += onWheelEvent.deltaY * -0.001;
        scale = Math.min(Math.max(.100, scale), 1);

        let cardZone = document.getElementById("card-zone")
        cardZone.style.transform = `translateX(${(translateX)}px) translateY(${(translateY)}px) scale(${scale})` //Transform card-zone div

        compensationY = (cardZone.clientHeight - (cardZone.clientHeight * scale)) / 2
        compensationX = (cardZone.clientWidth - (cardZone.clientWidth * scale)) / 2

        console.log("Scale: " + scale)
        console.log("CompensationX: " + compensationX + " CompensationY: " + compensationY)
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
        card.onclick = event => {
            console.log(event.x)
        }
        card.oncontextmenu = onContextMenuEvent => {
            onContextMenuEvent.preventDefault()
            onContextMenuEvent.stopPropagation()
            onContextMenuEvent.target.remove()
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
        let cardZone = document.getElementById("card-zone")
        cardZone.appendChild(createNewCard())
    }

}