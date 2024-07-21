"use client";

import * as actions from "@/actions";
import ConfirmDelete from "../admin/ConfirmDelete";
import Modal from "../ui/Modal";
import { Message } from "@/models/Message";
import ToggleMessageReadStatus from "./ToggleMessageReadStatus";

interface MessageActionsProps {
  message: Message;
}

export default function MessageActions({ message }: MessageActionsProps) {
  const { _id: id, read: isRead, sender } = message;
  return (
    <div className="flex gap-3 mt-4">
      <form action={actions.toggleMessageReadStatus.bind(null, id)}>
        <ToggleMessageReadStatus isRead={isRead} />
      </form>

      <Modal>
        <Modal.Open opens="delete">
          <button className=" bg-amber-400 hover:bg-amber-500 font-semibold  py-1.5 px-3 rounded-md">
            Delete
          </button>
        </Modal.Open>

        <Modal.Content name="delete">
          <ConfirmDelete
            resourceName={`message from ${sender.name}`}
            onConfirm={actions.deleteMessage.bind(null, id)}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}
