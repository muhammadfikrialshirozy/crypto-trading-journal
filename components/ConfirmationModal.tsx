"use client"

interface ConfirmationModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}

export default function ConfirmationModal({ open, onConfirm, onCancel, title, description }: ConfirmationModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-dark-card p-6 rounded-lg shadow-lg w-80 space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-300">{description}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-1 bg-dark-border rounded-md text-sm hover:bg-dark-surface"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-dark-danger rounded-md text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}