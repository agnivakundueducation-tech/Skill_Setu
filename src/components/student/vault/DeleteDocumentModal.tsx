import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { VaultDocument } from '../../../types/document';
import { AlertCircle, Trash2 } from 'lucide-react';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: VaultDocument | null;
  onConfirmDelete: (doc: VaultDocument) => Promise<void>;
}

export const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!doc) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirmDelete(doc);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Document Deletion"
      description="This action cannot be undone."
      size="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 dark:text-red-300">
            <span className="font-bold block mb-1">Are you sure you want to delete this document?</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{doc.fileName}</p>
            <p className="text-[11px] text-red-700 dark:text-red-400 mt-1">
              Category: {doc.category} • The document file and associated cryptographic record will be permanently purged from your Vault.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Permanently Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
