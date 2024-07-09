"use client";

import Modal from "../ui/Modal";
import ConfirmDelete from "../admin/ConfirmDelete";
import { DeleteItemState } from "@/actions/category";

interface CancelOrderProps {
  id: string;
  onCancel: () => Promise<DeleteItemState>;
}

export default function CancelOrder({ id, onCancel }: CancelOrderProps) {
  return (
    <Modal>
      <Modal.Open opens="cancel-order">
        <button className="text-red-800 font-medium bg-red-100 px-4 py-1 hover:bg-red-200 rounded-md">
          Cancel and Refund
        </button>
      </Modal.Open>

      <Modal.Content name="cancel-order">
        <ConfirmDelete resourceName={`order no. ${id}`} onConfirm={onCancel} />
      </Modal.Content>
    </Modal>
  );
}
