import React, { Dispatch, SetStateAction, useState } from "react";

function ProductDeleteDialog({
  setShowDeleteConfirm,
  title,
  id,
}: Readonly<{
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
  title: string;
  id: string;
}>) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  async function handleDelete() {
    const deletedData = await fetch(`/api/delete-product/${id}`, {
      method: "DELETE",
    });

    if (deletedData.ok) {
      setShowSuccessDialog(true);
    }
  }

  function handleReload() {
    window.location.href = "/";
  }

  return (
    <>
      {/* Main Delete Confirmation Dialog */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete &quot;<strong>{title}</strong>
            &quot;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Deleted</h2>
            <p className="text-gray-700 mb-6">
              Product &quot;<strong>{title}</strong> &quot; has been deleted
              successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleReload}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDeleteDialog;
