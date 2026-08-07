import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { StoreSettingsForm } from "@/features/settings/components/StoreSettingsForm";
import { DeliveryAreasManager } from "@/features/delivery-areas/components/DeliveryAreasManager";
import { UnitsManager } from "@/features/settings/components/UnitsManager";
import { NotificationSettings } from "@/features/notifications/components/NotificationSettings";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" className="max-w-3xl" />

      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>بيانات المتجر</CardTitle>
            <CardDescription>البيانات دي بتظهر للعملاء وبتتحسب على كل طلب جديد.</CardDescription>
          </CardHeader>
          <CardContent>
            <StoreSettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مناطق التوصيل</CardTitle>
            <CardDescription>كل منطقة وسعر توصيلها. العميل بيختار منطقته عند الطلب.</CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryAreasManager />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>وحدات البيع</CardTitle>
            <CardDescription>الاختيارات اللي بتظهر في خانة الوحدة عند إضافة منتج.</CardDescription>
          </CardHeader>
          <CardContent>
            <UnitsManager />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إشعارات الطلبات</CardTitle>
            <CardDescription>على الجهاز ده فقط — كل جهاز بيتفعّل لوحده.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
