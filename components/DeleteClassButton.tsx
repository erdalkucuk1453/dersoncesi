"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DeleteClassModal } from "./DeleteClassModal";

interface DeleteClassButtonProps {
  classId: string;
  className: string;
  grade: number;
  subject: string;
  memberCount?: number;
  assignmentCount?: number;
}

export function DeleteClassButton({
  classId,
  className,
  grade,
  subject,
  memberCount = 0,
  assignmentCount = 0,
}: DeleteClassButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
        title="Sınıfı Sil"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Sınıfı Sil</span>
      </button>

      <DeleteClassModal
        isOpen={showModal}
        classId={classId}
        className={className}
        grade={grade}
        subject={subject}
        memberCount={memberCount}
        assignmentCount={assignmentCount}
        onClose={() => setShowModal(false)}
        onDeleted={() => {
          router.push("/teacher/classes");
        }}
      />
    </>
  );
}
