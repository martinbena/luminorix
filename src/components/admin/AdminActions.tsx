"use client";

import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";
import Popover from "../ui/Popover";
import Modal from "../ui/Modal";
import ConfirmDelete from "./ConfirmDelete";
import { Document } from "mongoose";
import { DeleteItemState } from "@/actions/category";

interface AdminActionsProps<T extends Document> {
  item: T & { title: string };
  onDelete: () => Promise<DeleteItemState>;
}

export default function AdminActions<T extends Document>({
  item,
  onDelete,
}: AdminActionsProps<T>) {
  return (
    <>
      <Modal>
        <Popover>
          <Popover.Button>
            <PiDotsThreeVerticalLight className="w-8 h-8" />
          </Popover.Button>
          <Popover.Content>
            <Modal.Open opens="edit">
              <Popover.Row icon={<PiPencilSimpleLineThin />}>Edit</Popover.Row>
            </Modal.Open>
            <Modal.Open opens="delete">
              <Popover.Row icon={<PiTrashThin />}>Delete</Popover.Row>
            </Modal.Open>
          </Popover.Content>
        </Popover>
        <Modal.Content name="edit">
          <p>edit form</p>
        </Modal.Content>
        <Modal.Content name="delete">
          <ConfirmDelete resourceName={item.title} onConfirm={onDelete} />
        </Modal.Content>
      </Modal>
    </>
  );
}
