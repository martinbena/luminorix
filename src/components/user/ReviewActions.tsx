"use client";

import { PiNotePencilLight, PiTrashLight } from "react-icons/pi";
import ReviewActionButton from "./ReviewActionButton";
import Modal from "../ui/Modal";
import { Rating } from "@/models/Product";
import { ObjectId } from "mongoose";
import ConfirmDelete from "../admin/ConfirmDelete";
import * as actions from "@/actions";
import AddEditRatingForm from "../products/AddEditRatingForm";

interface ReviewActions {
  rating: { title: string; slug: string; review: Rating };
}

export default function ReviewActions({ rating }: ReviewActions) {
  return (
    <Modal>
      <div className="flex flex-col border-l border-zinc-300 w-[100px]">
        <Modal.Open opens="edit">
          <ReviewActionButton icon={<PiNotePencilLight />}>
            Edit
          </ReviewActionButton>
        </Modal.Open>
        <Modal.Open opens="delete">
          <ReviewActionButton icon={<PiTrashLight />}>
            Delete
          </ReviewActionButton>
        </Modal.Open>
        <Modal.Content name="edit">
          <AddEditRatingForm
            isEditSession
            rating={rating}
            productSlug={rating.slug}
          />
        </Modal.Content>
        <Modal.Content name="delete">
          <ConfirmDelete
            resourceName={`review of ${rating.title}`}
            onConfirm={actions.deleteRating.bind(
              null,
              rating.slug,
              rating.review.postedBy.toString()
            )}
          />
        </Modal.Content>
      </div>
    </Modal>
  );
}

{
  /* <Modal>
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
        resourceName={`${item?.title}${item?.color || item?.size ? "," : ""}${
          item?.color ? ` ${item.color}` : ""
        }${item?.size ? ` ${item.size}` : ""}`}
        onConfirm={onDelete}
      />
    </Modal.Content>
  </Popover>
</Modal>; */
}
