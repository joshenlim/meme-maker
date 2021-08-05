import { Button, IconLoader, Typography } from '@supabase/ui'
import { useRef } from 'react'

const EmptyState = ({
  uploading = false,
  onFilesUpload = () => {},
  onSelectChangeTemplate = () => {},
}) => {
  const uploadButtonRef = useRef(null)

  const onSelectUpload = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click()
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-4 z-10">
      {uploading ? (
        <>
          <IconLoader className="animate-spin" strokeWidth={2} />
          <Typography.Text>Uploading image</Typography.Text>
        </>
      ) : (
        <>
          <div className="hidden">
            <input ref={uploadButtonRef} type="file" accept=".png, .jpg, .jpeg" onChange={onFilesUpload} />
          </div>
          <Button type="secondary" onClick={onSelectUpload}>
            Upload your own image
          </Button>
          <div className="border-b border-gray-600 w-48" />
          <Button type="primary" onClick={onSelectChangeTemplate}>
            Select a template
          </Button>
        </>
      )}
    </div>
  )
}

export default EmptyState
