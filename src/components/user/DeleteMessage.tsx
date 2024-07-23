"use client";

import * as actions from "@/actions";
import ConfirmDelete from "../admin/ConfirmDelete";
import Modal from "../ui/Modal";
import { Message } from "@/models/Message";
import { useMessagesContext } from "@/app/contexts/MessagesContext";

interface DeleteMessageProps {
  message: Message;
}

export default function DeleteMessage({ message }: DeleteMessageProps) {
  const { _id: id, read: isRead, sender } = message;
  const { setUnreadMessagesCount } = useMessagesContext();
  return (
    <Modal>
      <Modal.Open opens="delete">
        <button className=" bg-amber-400 hover:bg-amber-500 font-semibold focus:outline-none focus:bg-amber-500 py-1.5 px-3 rounded-md">
          Delete
        </button>
      </Modal.Open>

      <Modal.Content name="delete">
        <ConfirmDelete
          resourceName={`message from ${sender.name}`}
          onConfirm={actions.deleteMessage.bind(null, id)}
          onClick={() =>
            setUnreadMessagesCount((prevCount) =>
              isRead ? prevCount + 1 : prevCount - 1
            )
          }
        />
      </Modal.Content>
    </Modal>
  );
}
