"use client";

import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";
import Popover from "../ui/Popover";
import toast from "react-hot-toast";

interface AdminActionsProps<T> {
  item: T;
  onDelete: () => void;
}

export default function AdminActions<T>({
  item,
  onDelete,
}: AdminActionsProps<T>) {
  function handleClick() {
    onDelete();
  }
  return (
    <Popover>
      <Popover.Button>
        <PiDotsThreeVerticalLight className="w-8 h-8" />
      </Popover.Button>
      <Popover.Content>
        <Popover.Row icon={<PiPencilSimpleLineThin />}>Edit</Popover.Row>
        <Popover.Row icon={<PiTrashThin />} onClick={handleClick}>
          Delete
        </Popover.Row>
      </Popover.Content>
    </Popover>
  );
}
