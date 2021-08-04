import { Button, SidePanel } from '@supabase/ui'
import { useRef } from 'react'
import * as R from 'ramda'

const TemplatesPanel = ({
  templates = [],
  uploading = false,
  visible = false,
  loadTemplate = () => {},
  onFilesUpload = () => {},
  hideTemplatesPanel = () => {},
}) => {
  const uploadButtonRef = useRef(null)

  const onSelectUpload = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click()
    }
  }

  return (
    <SidePanel
      hideFooter
      title="Select a template"
      description="Choose from our list of templates or upload your own!"
      visible={visible}
      onCancel={hideTemplatesPanel}
    >
      <div className="flex flex-col h-full">
        <div className="hidden">
          <input ref={uploadButtonRef} type="file" onChange={onFilesUpload} />
        </div>
        <Button block loading={uploading} onClick={onSelectUpload}>
          {!uploading ? 'Upload your own template' : 'Uploading template'}
        </Button>

        <div className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 190px)' }}>
          <div className="grid grid-cols-3 gap-3">
            {R.map(
              (template) => (
                <div
                  key={template.name}
                  className="h-32 bg-center bg-no-repeat bg-cover rounded-md cursor-pointer"
                  style={{ backgroundImage: `url('${template.url}')` }}
                  onClick={() => loadTemplate(template)}
                />
              ),
              templates
            )}
          </div>
        </div>

        {/* Probably add some search or something */}
      </div>
    </SidePanel>
  )
}

export default TemplatesPanel
