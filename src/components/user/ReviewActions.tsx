"use client";

import { PiNotePencilLight, PiTrashLight } from "react-icons/pi";
import ReviewActionButton from "./ReviewActionButton";
import Modal from "../ui/Modal";
import ConfirmDelete from "../admin/ConfirmDelete";
import * as actions from "@/actions";
import AddEditRatingForm from "../products/AddEditRatingForm";
import { UserRating } from "@/db/queries/user";

interface ReviewActions {
  rating: UserRating;
}

export default function ReviewActions({ rating }: ReviewActions) {
  return (
    <Modal>
      <div className="flex flex-col border-l border-amber-500 w-24 mob:w-12">
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
