import { fabric } from 'fabric'
import { Select, Input, Button, Dropdown, IconAlignCenter, IconAlignLeft, IconAlignRight, IconType, IconMinus, IconPlus, Typography } from '@supabase/ui'
import { useEffect, useState, useRef } from 'react'
import * as R from 'ramda'
import { DEFAULT_SWATCHES, DEFAULT_FONTS } from './constants'
import { resizeImageToCanvas, getCanvasJson } from '../../utils/editor'
import { getSignedUrl, saveTemplate } from '../../utils/supabaseClient'

const EDITOR_DIMENSIONS = { width: 800, height: 450 }

const Editor = ({
  stickers = [],
  selectedTemplate = null,
  uploadedFileUrl = '',
  onSelectChangeTemplate = () => {}
}) => {

  const editorRef = useRef(null)
  const [name, setName] = useState('')
  const [selectedObject, setSelectedObject] = useState(null)

  const isTextObjectSelected = R.hasPath(['fontSize'], selectedObject);

  useEffect(() => {
    const editor = new fabric.Canvas('editor', {
      preserveObjectStacking: true
    });

    window.addEventListener('keydown', handleKeyPress)
    editor.on('selection:created', onSelectionCreated)
    editor.on('selection:updated', onSelectionUpdated)
    editor.on('selection:cleared', onSelectionCleared)
    editor.on('object:modified', onObjectModified)

    editorRef.current = editor
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      editorRef.current.__eventListeners = {};
    }
  }, [])

  useEffect(() => {
    if (uploadedFileUrl) {
      mountBackgroundImage(uploadedFileUrl)
    }
  }, [uploadedFileUrl])

  useEffect(() => {
    if (selectedTemplate) {
      editorRef.current.remove(...editorRef.current.getObjects())
      editorRef.current.loadFromJSON(selectedTemplate.json, () => {
        const objects = editorRef.current.getObjects()
        const [backgroundObject] = objects.filter(object => object.isBackground)
        backgroundObject.set({ selectable: false, evented: false })
        editorRef.current.setWidth(backgroundObject.width * backgroundObject.scaleX)
        editorRef.current.setHeight(backgroundObject.height * backgroundObject.scaleY)
        editorRef.current.requestRenderAll()
      })
    }
  }, [selectedTemplate])

  /* Event listeners */
  const handleKeyPress = (event) => {
    const { keyCode } = event
    const activeObject = editorRef.current.getActiveObject()
    const targetType = event.target.tagName.toUpperCase()
    
    if (activeObject && !activeObject.isEditing && targetType !== 'INPUT') {
      switch(keyCode) {
        case 8: {
          // Remove object
          editorRef.current.remove(activeObject)
          break
        }
      }
    }
  }

  const onSelectionCreated = (event) => {
    const objectJSON = JSON.parse(JSON.stringify(event.target))
    setSelectedObject(objectJSON)
  }

  const onSelectionUpdated = (event) => {
    const objectJSON = JSON.parse(JSON.stringify(event.target))
    setSelectedObject(objectJSON)
  }

  const onSelectionCleared = () => {
    setSelectedObject(null)
  }

  const onObjectModified = (event) => {
    // Update fontSize when we scale textboxes
    if (event.action === 'scale' && R.hasPath(['fontSize'], event.target)) {
      event.target.fontSize *= event.target.scaleX;
      event.target.fontSize = event.target.fontSize.toFixed(0);
      event.target.scaleX = 1;
      event.target.scaleY = 1;
      event.target._clearCache();
      updateTextAttribute({ fontSize: event.target.fontSize })
    }
  }

  /* Canvas interaction methods */
  const addNewText = () => {
    const text = new fabric.IText('New textbox', {
      left: editorRef.current.width / 2,
      top: editorRef.current.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 30,
      fontFamily: 'Impact',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 1,
      textAlign: 'center'
    })
    text.setControlsVisibility({
      mt: false,
      mr: false,
      mb: false,
      ml: false
    })
    editorRef.current.add(text)
    editorRef.current.bringToFront(text)
    editorRef.current.setActiveObject(text)
  }

  const updateTextAttribute = (attribute) => {
    const textObject = editorRef.current.getActiveObject()
    textObject.set(attribute)
    editorRef.current.requestRenderAll()

    const updatedSelectedObject = {
      ...selectedObject,
      ...attribute
    }
    setSelectedObject(updatedSelectedObject)
  }

  const addSticker = async (sticker) => {
    const stickerUrl = await getSignedUrl('stickers', sticker.path)
    fabric.Image.fromURL(stickerUrl, (img) => {
      img.set({
        left: editorRef.current.width / 2,
        top: editorRef.current.height / 2,
        originX: 'center',
        originY: 'center',
      })
      editorRef.current.add(img)
    }, { crossOrigin: 'anonymous' })
  }

  const mountBackgroundImage = (url) => {
    editorRef.current.remove(...editorRef.current.getObjects())
    fabric.Image.fromURL(url, (img) => {
      const imageDimensions = { width: img.width, height: img.height }
      const scale = resizeImageToCanvas(imageDimensions, EDITOR_DIMENSIONS)
      
      // Resize the canvas to fit the background snuggly so that we do not export
      // with any whitespace
      // [TODO] Small bug - uploading drake meme, followed by communist bugs meme
      // The canvas resizing isn't updating properly
      if (EDITOR_DIMENSIONS.width > img.width * scale) {
        editorRef.current.setWidth(img.width * scale)
      } else if (EDITOR_DIMENSIONS.height > img.height * scale) {
        editorRef.current.setHeight(img.height * scale)
      }
      editorRef.current.calcOffset()

      img.set({
        left: editorRef.current.width / 2,
        top: editorRef.current.height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        isBackground: true,
      })
      editorRef.current.add(img)
      editorRef.current.sendToBack(img)
    }, { crossOrigin: 'anonymous' })
  }
  
  const onSaveTemplate = async () => {
    const canvasJson = getCanvasJson(editorRef.current)
    if (!name) {
      return console.warn('You need a name for your template')
    }
    if (canvasJson.objects.length === 0) {
      return console.warn('There are no objects on your canvas')
    }
    await saveTemplate(name, canvasJson);
  }

  const onExportCanvas = () => {
    const link = document.createElement('a')
    link.href = editorRef.current.toDataURL('image/png', 1.0)
    link.setAttribute('download', `supameme.png`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="w-full flex items-center justify-between">
        {isTextObjectSelected ? (
          <div className="flex items-center space-x-2">
            <Select
              value={R.pathOr('Unknown', ['fontFamily'], selectedObject)}
              onChange={(event) => updateTextAttribute({ fontFamily: event.target.value })}
            >
              {R.map((font) => (
                <Select.Option key={font} value={font}>{font}</Select.Option>
              ), DEFAULT_FONTS)}
            </Select>
            
            <div className="flex items-center">
              <div
                className="rounded-l-md border border-gray-500 border-r-0 p-2 h-full cursor-pointer transition hover:bg-gray-500"
                onClick={() => updateTextAttribute({ fontSize: selectedObject.fontSize - 1 })}
              >
                <IconMinus size="medium" strokeWidth={2} />
              </div>
              <Input
                type="number"
                className="fontSizeInput"
                value={R.pathOr(0, ['fontSize'], selectedObject)}
                onChange={(event) => updateTextAttribute({ fontSize: event.target.value || 1 })}
              />
              <div
                className="rounded-r-md border border-gray-500 border-l-0 p-2 h-full cursor-pointer transition hover:bg-gray-500"
                onClick={() => updateTextAttribute({ fontSize: selectedObject.fontSize + 1 })}
              >
                <IconPlus size="medium" strokeWidth={2} />
              </div>
            </div>
            
            <Dropdown
              overlay={[
                <div key="fill-swatches" className="flex items-center p-2 space-x-2">
                  {R.map((swatch) => (
                    <div
                      key={swatch}
                      className="w-6 h-6 rounded-full border-2 border-gray-100 shadow cursor-pointer"
                      onClick={() => updateTextAttribute({ fill: swatch })}
                      style={{ backgroundColor: swatch }}
                    />
                  ), DEFAULT_SWATCHES)}
                </div>
              ]}
            >
              <div className="formatButton h-10 flex">
                <Button type="text" onClick={() => {}}>
                  <div className="flex flex-col justify-center">
                    <span className="text-[17px] text-gray-200">A</span>
                    <div
                      className="w-full"
                      style={{
                        height: '2px',
                        backgroundColor: R.pathOr('#000000', ['fill'], selectedObject),
                        marginTop: '1px'
                      }}
                    />
                  </div>
                </Button>
              </div>
            </Dropdown>

            <Dropdown
              overlay={[
                <div key="stroke-swatches" className="flex items-center p-2 space-x-2">
                  {R.map((swatch) => (
                    <div
                      key={swatch}
                      className="w-6 h-6 rounded-full border-2 border-gray-100 shadow cursor-pointer"
                      style={{ backgroundColor: swatch }}
                      onClick={() => updateTextAttribute({ stroke: swatch })}
                    />
                  ), DEFAULT_SWATCHES)}
                </div>
              ]}
            >
              <div className="formatButton h-10 flex">
                <Button type="text" onClick={() => {}}>
                  <div className="flex flex-col justify-center">
                    <span
                      className="text-[20px] text-gray-200"
                      style={{
                        WebkitTextStrokeColor: R.pathOr('#FFFFFF', ['stroke'], selectedObject),
                        WebkitTextStrokeWidth: 1
                      }}
                    >
                      A
                    </span>
                  </div>
                </Button>
              </div>
            </Dropdown>

            <Dropdown
              overlay={[
                <div key="text-align-options" className="flex items-center p-2 space-x-2">
                  <IconAlignLeft className="cursor-pointer text-white" strokeWidth={2} onClick={() => updateTextAttribute({ 'textAlign': 'left' })} />
                  <IconAlignCenter className="cursor-pointer text-white" strokeWidth={2} onClick={() => updateTextAttribute({ 'textAlign': 'center' })} />
                  <IconAlignRight className="cursor-pointer text-white" strokeWidth={2} onClick={() => updateTextAttribute({ 'textAlign': 'right' })} />
                </div>
              ]}
            >
              <div className="h-10 flex">
                <Button type="text" icon={<IconAlignCenter size="medium" strokeWidth={2} />} />
              </div>
            </Dropdown>
            
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Dropdown
              overlay={R.map((sticker) => (
                <Dropdown.Item key={sticker.id} onClick={() => addSticker(sticker)}>
                  <div className="flex items-center">
                    <Typography.Text>{sticker.name}</Typography.Text>
                  </div>
                </Dropdown.Item>
              ), stickers)}
            >
              <div className="h-10 flex">
                <Button type="text">
                  <img className="h-5" src="/img/sticker.svg" />
                </Button>
              </div>
            </Dropdown>
            <div className="h-10 flex">
              <Button type="text" icon={<IconType size="medium" strokeWidth={2} />} onClick={addNewText} />
            </div>
          </div>
          <Button type="secondary" onClick={onSelectChangeTemplate}>Change template</Button>
        </div>
      </div>

      <div className="border border-gray-500 rounded-md flex items-center justify-center" style={{ width: EDITOR_DIMENSIONS.width }}>
        <canvas
          id="editor"
          width={EDITOR_DIMENSIONS.width}
          height={EDITOR_DIMENSIONS.height}
        />
      </div>

      <div className="w-full flex items-center justify-between">
        <Input
          className="w-64"
          placeholder="Name your meme template"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="flex items-center space-x-4">
          <Button type="primary" onClick={onSaveTemplate}>Save template</Button>
          <Button type="primary" onClick={onExportCanvas}>Export meme</Button>
        </div>
      </div>
    </div>
  )
}

export default Editor