class Rect {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    toString() {
        return `Width [${this.x}-${this.x + this.width - 1}] Height [${this.y}-${this.y + this.height - 1}]`;
    }
}

class ColorRGB {
    constructor(r, g, b) {
        this.r = r
        this.g = g
        this.b = b
    }

    getRGBA() {
        return `rgb(${this.r}, ${this.g}, ${this.b}, 255)`
    }

    getHex() {
        function decimalToHex(number) {
            let hex = number.toString(16)
            hex = hex.length === 1 ? "0".concat(hex) : hex
            return hex
        }
        return `#${decimalToHex(this.r)}${decimalToHex(this.g)}${decimalToHex(this.b)}ff`
    }
}

/**
 *
 * @param image {HTMLImageElement}
 */
function generateColorPaletteFromImage(image) {
    //Create canvas element
    let canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    canvas.style.filter = "blur(15px)"

    let context = canvas.getContext("2d")
    context.drawImage(image, 0, 0)

    //0 - 99 = 100
    //Get width and height from image
    let w = canvas.width
    let h = canvas.height

    //Get long for each square
    let wPixels = Math.trunc(w / 3)
    let wRest = w % 3 //Add to last square long

    let hPixels = Math.trunc(h / 2)
    let hRest = h % 2

    console.log(`Image size: ${w} x ${h}`)
    console.log(`Rect size (x3): ${wPixels} [${wRest}] x ${hPixels} [${hRest}]\n`)

    //Adding x and y positions to squares
    let rectList = new Array(6)
    //Top
    let rect0_0 = new Rect(0, 0, wPixels, hPixels)
    let rect0_1 = new Rect(rect0_0.x + rect0_0.width, 0, wPixels, hPixels)
    let rect0_2 = new Rect(rect0_1.x + rect0_1.width, 0, wPixels + wRest, hPixels) //Add rest number
    rectList[0] = rect0_0
    rectList[1] = rect0_1
    rectList[2] = rect0_2
    //Down
    let rect1_0 = new Rect(0, hPixels, wPixels, hPixels + hRest)
    let rect1_1 = new Rect(rect1_0.x + rect1_0.width, hPixels, wPixels, hPixels + hRest)
    let rect1_2 = new Rect(rect1_1.x + rect1_1.width, hPixels, wPixels + wRest, hPixels + hRest)
    rectList[3] = rect1_0
    rectList[4] = rect1_1
    rectList[5] = rect1_2

    let totalPixelsImage = 0
    let colorList = []

    rectList.forEach(rect => {
        console.log("Rect: " + rect.toString())
        let r = 0
        let g = 0
        let b = 0
        let totalPixelsRect = 0

        let data = context.getImageData(rect.x, rect.y, rect.width, rect.height).data
        console.log(data.length / 4)

        for (let i = 0; i < data.length; i += 4) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            //a += data[i + 3]

            ++totalPixelsRect
            ++totalPixelsImage;
        }

        let color = new ColorRGB(Math.round(r/totalPixelsRect),
            Math.round(g/totalPixelsRect), Math.round(b/totalPixelsRect))
        colorList.push(color)
    })

    console.log("Total Pixels: " + totalPixelsImage)

    //return palette color list
    return colorList
}

function configDropFile() {
    //Disable body drop file behavior
    let body = document.getElementById("body")
    body.ondragenter = onDragEnterEvent => {
        onDragEnterEvent.preventDefault()
        onDragEnterEvent.stopPropagation()
        onDragEnterEvent.dataTransfer.dropEffect = "none"
    }
    body.ondragover = onDragOverEvent => {
        onDragOverEvent.preventDefault()
        onDragOverEvent.stopPropagation()
        onDragOverEvent.dataTransfer.dropEffect = "none"
    }

    //Drop file
    let dropArea = document.getElementById("drop-area")
    dropArea.ondragenter = eventOnDragEnter => {
        eventOnDragEnter.preventDefault()
        eventOnDragEnter.stopPropagation()

        let dropArea = document.getElementById("drop-area")
        dropArea.style.borderColor = "#30e53b"
    }

    dropArea.ondragleave = eventOnDragLeave => {
        let dropArea = document.getElementById("drop-area")
        dropArea.style.borderColor = "#ccc"
    }

    dropArea.ondragover = eventOnDragOver => {
        eventOnDragOver.preventDefault()
        eventOnDragOver.stopPropagation()
    }

    dropArea.ondrop = eventOnDrop => {
        eventOnDrop.stopPropagation();
        eventOnDrop.preventDefault();
        let file = eventOnDrop.dataTransfer.files[0]
        processImageFile(file)
        eventOnDrop.dataTransfer.clearData()
    }

    dropArea.onclick = onClickEvent => {
        onClickEvent.preventDefault()
        onClickEvent.stopPropagation()

        const pickerOpts = {
            types: [
                {
                    description: 'Images',
                    accept: {
                        'image/*': ['.png', '.jpeg', '.jpg']
                    }
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false
        };

        window.showOpenFilePicker(pickerOpts).then(value => {
            value[0].getFile().then(imageFile => {
               processImageFile(imageFile)
            })
        })
    }

    function processImageFile(file) {
        console.log(file.type)
        if (file.type === "image/png" || file.type === "image/jpeg") {
            let image = new Image()
            image.src = URL.createObjectURL(file)
            image.onload = onLoadEvent => {
                //Update interface
                updateInterface(image)
            }
        }
    }
}

/**
 *
 * @param image {HTMLImageElement}
 * @param listColors {Array}
 */
function generateColorPaletteIU(image, listColors) {
    let div = document.createElement("div")
    div.className = "palette-area"
    image.className = "image-palette"

    let divImage = document.createElement("div")
    divImage.className = "image-palette-content"
    divImage.append(image)
    div.append(divImage)

    let divPalette = document.createElement("div")
    divPalette.className = "palette-content"

    let divTextColors = document.createElement("div")
    divTextColors.className = "color-tag-content"

    listColors.forEach(color => {
        console.log("Color canvas: " + color.getHex())

        let canvas = document.createElement("canvas")
        canvas.className = "canvas"
        canvas.style.backgroundColor = color.getRGBA()
        canvas.onclick = event => {
            navigator.clipboard.writeText(color.getHex()).then( value => //Copies value to clipboard
                console.log("ClipBoard copied successfully: " + color.getHex()))
        }

        divPalette.append(canvas)

        let label = document.createElement("label")
        label.className = "color-tag-label"
        label.textContent = color.getHex().toUpperCase()
        divTextColors.append(label)

    })

    div.append(divPalette)
    div.append(divTextColors)
    return div
}

function updateInterface(image) {
    //Generate listPaletteColors colors
    let listPaletteColors = generateColorPaletteFromImage(image)
    //Sort colors
    listPaletteColors.sort( (c1, c2) => {
        //c1 > c2 return 1 | c1 < c2 return -1 | c1 == c2 return 0
        let sumC1 = c1.r + c1.g + c1.b
        let sumC2 = c2.r + c2.g + c2.b
        return sumC1 - sumC2
    })

    console.log(listPaletteColors)

    //Update interface
    let paletteIU = generateColorPaletteIU(image, listPaletteColors)
    let dropArea = document.getElementById("drop-area")

    document.body.removeChild(dropArea)
    document.body.append(paletteIU)

    //Style to background
    document.body.style.backgroundColor = listPaletteColors[5].getRGBA()
    document.getElementById("help-button").style.backgroundColor = listPaletteColors[0].getRGBA()
    document.getElementById("nav-bar").style.backgroundColor = listPaletteColors[0].getRGBA()
}

window.onload = event => {
    configDropFile()
}