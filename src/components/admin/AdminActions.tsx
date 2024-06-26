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
import { ReactElement } from "react";

interface AdminActionsProps<T extends Document> {
  item: T & { title: string; color?: string; size?: string };
  onDelete: () => Promise<DeleteItemState>;
  editForm: ReactElement;
}

export default function AdminActions<T extends Document>({
  item,
  onDelete,
  editForm,
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
          <Modal.Content name="edit">{editForm}</Modal.Content>
          <Modal.Content name="delete">
            <ConfirmDelete
              resourceName={`${item?.title}${
                item?.color || item?.size ? "," : ""
              }${item?.color ? ` ${item.color}` : ""}${
                item?.size ? ` ${item.size}` : ""
              }`}
              onConfirm={onDelete}
            />
          </Modal.Content>
        </Popover>
      </Modal>
    </>
  );
}
