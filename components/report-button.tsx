"use client";

import { reportAction } from "@/lib/actions";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReportButton({
  targetType,
  targetId,
  label = "檢舉",
}: {
  targetType: "post" | "user";
  targetId: string;
  label?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="text-base sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">檢舉</DialogTitle>
          <DialogDescription className="text-base text-foreground">
            若看到詐騙、推銷醫療、要求轉帳或不當內容，請告訴管理員。這不是緊急報案。
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={reportAction}>
          <input type="hidden" name="target_type" value={targetType} />
          <input type="hidden" name="target_id" value={targetId} />
          <label className="grid gap-2 text-base font-medium" htmlFor={`reason-${targetId}`}>
            原因
            <Textarea id={`reason-${targetId}`} name="reason" required minLength={4} className="min-h-32 text-base" />
          </label>
          <Button type="submit">送出檢舉</Button>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
