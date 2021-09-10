import { Button, IconLoader, SidePanel, Typography } from '@supabase/ui'
import { useRef } from 'react'
import * as R from 'ramda'

const TemplatesPanel = ({
  templates = [],
  loadingAssets = false,
  uploading = false,
  visible = false,
  loadTemplate = () => {},
  onTemplateUpload = () => {},
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
          <input
            ref={uploadButtonRef}
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={onTemplateUpload}
          />
        </div>
        <Button block loading={uploading} onClick={onSelectUpload}>
          {!uploading ? 'Upload your own template' : 'Uploading template'}
        </Button>

        <div className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 190px)' }}>
          {loadingAssets ? (
            <div
              className="space-y-2 flex flex-col items-center justify-center"
              style={{ height: 'calc(100vh - 190px)' }}
            >
              <IconLoader className="text-white animate-spin" />
              <Typography.Text small>Loading templates</Typography.Text>
            </div>
          ) : (
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
          )}
        </div>

        {/* Probably add some search or something */}
      </div>
    </SidePanel>
  )
}

export default TemplatesPanel
