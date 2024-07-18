import { SKELETON_EFFECT } from "@/lib/constants";
import { Table, TableContainer, TableHeader, TableRow } from "./Table";
import { SkeletonBlock } from "skeleton-elements/react";

const tableColumns = "grid-cols-[1fr_1fr_0.5fr] mob:grid-cols-[1fr_0.3fr]";

export default function TableSkeleton() {
  return (
    <TableContainer>
      <Table maxWidth="max-w-5xl">
        <TableHeader numColumns={tableColumns}>
          <SkeletonBlock
            tag="p"
            height="20px"
            width="180px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />

          <div className="mob:hidden">
            <SkeletonBlock
              tag="p"
              height="20px"
              width="180px"
              borderRadius="0"
              effect={SKELETON_EFFECT}
            />
          </div>

          <SkeletonBlock
            tag="p"
            height="20px"
            width="60px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </TableHeader>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </Table>
    </TableContainer>
  );
}

function SkeletonRow() {
  return (
    <TableRow numColumns={tableColumns}>
      <SkeletonBlock
        tag="p"
        height="20px"
        width="180px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />

      <div className="mob:hidden">
        <SkeletonBlock
          tag="p"
          height="20px"
          width="180px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>

      <SkeletonBlock
        tag="p"
        height="20px"
        width="60px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </TableRow>
  );
}
