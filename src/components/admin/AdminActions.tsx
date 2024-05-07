"use client";

import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";
import Popover from "../ui/Popover";

export default function AdminActions() {
  return (
    <Popover>
      <Popover.Button>
        <PiDotsThreeVerticalLight className="w-8 h-8" />
      </Popover.Button>
      <Popover.Content>
        <Popover.Row icon={<PiPencilSimpleLineThin />}>Edit</Popover.Row>
        <Popover.Row icon={<PiTrashThin />}>Delete</Popover.Row>
      </Popover.Content>
    </Popover>
  );
}
