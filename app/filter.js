const image64based = ''

function draw(data, func) {
    const canvas = document.getElementById('avatar')
    const image = new Image()
    image.onload = () => {
        const ctx = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height

        const imageCanvas = document.createElement('canvas')
        imageCanvas.width = image.width
        imageCanvas.height = image.height
        const context = imageCanvas.getContext('2d');
        context?.drawImage(image, 0, 0);
        const dat = context?.getImageData(0, 0, image.width, image.height);

        //ctx.fillStyle = 'rgb(100, 0, 0)';
        // @ts-ignore
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        func(image, dat, ctx)              
        }
        
    image.src = data;
}

function pixelise(image, dat, ctx) {
    for (let y = 0; y < image.height; y += 5) {
        for (let x = 0; x < image.width; x += 5) {
            let red = dat.data[((image.width * y) + x) * 4]
            let green = dat.data[((image.width * y) + x) * 4 + 1]
            let blue = dat.data[((image.width * y) + x) * 4 + 2]

            if (red + green + blue / 3 > 100) {
                ctx.fillStyle = 'cyan';
                ctx.fillRect(x, y, 3, 3);
            }
        }
    }
}

function chromatic_aberration(image, dat, ctx) {
    const data = dat.data;
    for (let i = 0 % 4; i < data.length; i += 4) {
        data[i] = data[i + 4 * 10];
    }
    ctx.putImageData(dat, 0, 0);
}

const set = {
    'chromatic_aberration': chromatic_aberration,
    'pixelise': pixelise
}
