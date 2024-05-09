"use client";

import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";
import Popover from "../ui/Popover";
import Overlay from "../ui/Overlay";
import { useState } from "react";
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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  return (
    <>
      <Modal>
        <Popover>
          <Popover.Button>
            <PiDotsThreeVerticalLight className="w-8 h-8" />
          </Popover.Button>
          <Popover.Content>
            <Popover.Row icon={<PiPencilSimpleLineThin />}>Edit</Popover.Row>
            <Modal.Open opens="delete">
              <Popover.Row
                icon={<PiTrashThin />}
                onClick={() => setIsOverlayOpen(true)}
              >
                Delete
              </Popover.Row>
            </Modal.Open>
          </Popover.Content>
        </Popover>
        <Overlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          zIndex="z-40"
        >
          <Modal.Content name="delete">
            <ConfirmDelete
              resourceName={item.title}
              onConfirm={onDelete}
              onClose={() => setIsOverlayOpen(false)}
            />
          </Modal.Content>
        </Overlay>
      </Modal>
    </>
  );
}
