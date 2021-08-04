export const resizeImageToCanvas = (imageDimensions, canvasDimensions) => {
  const isHorizontalImage = imageDimensions.width >= imageDimensions.height
  if (isHorizontalImage) {
    const scale = canvasDimensions.width / imageDimensions.width
    if (imageDimensions.height * scale > canvasDimensions.height) {
      return canvasDimensions.height / imageDimensions.height
    }
    return scale
  } else {
    const scale = canvasDimensions.height / imageDimensions.height
    if (imageDimensions.width * scale > canvasDimensions.width) { 
      return canvasDimensions.width / imageDimensions.width
    }
    return scale
  }
}

export const getCanvasJson = (canvas) => {
  return canvas.toJSON(['isBackground'])
}