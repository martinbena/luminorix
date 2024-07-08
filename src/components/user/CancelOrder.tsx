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
        <button className="text-red-800 bg-red-100 px-4 py-1 hover:bg-red-200 rounded-md">
          Cancel and Refund
        </button>
      </Modal.Open>

      <Modal.Content name="cancel-order">
        <ConfirmDelete resourceName={`order no. ${id}`} onConfirm={onCancel} />
      </Modal.Content>
    </Modal>
  );
}

// interface AdminActionsProps<T extends Document> {
//   item: T & { title: string; color?: string; size?: string };
//   onDelete: () => Promise<DeleteItemState>;
//   editForm: ReactElement;
// }

// export default function AdminActions<T extends Document>({
//   item,
//   onDelete,
//   editForm,
// }: AdminActionsProps<T>) {
//   return (
//     <>
//       <Modal>
//         <Popover>
//           <Popover.Button>
//             <PiDotsThreeVerticalLight className="w-8 h-8" />
//           </Popover.Button>
//           <Popover.Content>
//             <Modal.Open opens="edit">
//               <Popover.Row icon={<PiPencilSimpleLineThin />}>Edit</Popover.Row>
//             </Modal.Open>
//             <Modal.Open opens="delete">
//               <Popover.Row icon={<PiTrashThin />}>Delete</Popover.Row>
//             </Modal.Open>
//           </Popover.Content>
//           <Modal.Content name="edit">{editForm}</Modal.Content>
//           <Modal.Content name="delete">
//             <ConfirmDelete
//               resourceName={`${item?.title}${
//                 item?.color || item?.size ? "," : ""
//               }${item?.color ? ` ${item.color}` : ""}${
//                 item?.size ? ` ${item.size}` : ""
//               }`}
//               onConfirm={onDelete}
//             />
//           </Modal.Content>
//         </Popover>
//       </Modal>
//     </>
//   );
// }
