"use client";

import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/shared/lib/format";
import { DeleteButton } from "@/shared/components/DeleteButton";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useAdmins, useDeleteAdmin } from "@/features/admins/hooks/useAdmins";
import { AddAdminForm } from "@/features/admins/components/AddAdminForm";

export function AdminsManager() {
  const { data: currentUser } = useCurrentUser();
  const { data: admins, isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();

  // The API enforces this too; this just avoids showing a page that can only fail.
  if (currentUser && currentUser.role !== "superadmin") {
    return (
      <p className="rounded-xl border border-dashed bg-card py-12 text-center text-sm text-muted-foreground">
        الصفحة دي متاحة للمدير العام فقط.
      </p>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة مشرف</CardTitle>
        </CardHeader>
        <CardContent>
          <AddAdminForm />
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {admins?.map((admin) => {
            const isSuperadmin = admin.role === "superadmin";

            return (
              <li
                key={admin._id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-brand-900">
                    {admin.name}
                    {isSuperadmin && (
                      <Badge variant="secondary" className="gap-1">
                        <ShieldCheck className="size-3" aria-hidden />
                        مدير عام
                      </Badge>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground" dir="ltr">
                    {admin.email}
                  </p>
                  <p className="text-xs text-muted-foreground">أُضيف {formatDate(admin.createdAt)}</p>
                </div>

                {!isSuperadmin && (
                  <DeleteButton
                    title={`حذف حساب "${admin.name}"؟`}
                    description="هيتشال الحساب فورًا ومش هيقدر يدخل اللوحة تاني."
                    onConfirm={() => deleteAdmin.mutate(admin._id)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
