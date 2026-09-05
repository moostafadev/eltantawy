import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/button";
import { toArabicNums } from "@/utils/toArabicNums";

interface OrderSuccessProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

const OrderSuccessPage = async ({ params }: OrderSuccessProps) => {
  const { orderNumber } = await params;

  return (
    <main className="flex flex-1 items-center justify-center py-10">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center bg-success/10 text-success">
          <CheckCircle2 className="size-10" />
        </div>

        <h1 className="text-2xl font-bold">تم استلام طلبك بنجاح</h1>

        <p className="text-sm text-muted-foreground">
          رقم طلبك هو{" "}
          <strong className="text-main">#{toArabicNums(orderNumber)}</strong>،
          هيتم التواصل معك قريبًا لتأكيد الطلب.
        </p>

        <Link href="/">
          <Button color="MAIN">العودة للرئيسية</Button>
        </Link>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
