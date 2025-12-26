"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useLanguage } from "@/contexts/language-context";

export default function ReimbursementPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t.reimbursementRequestTitle}
        </h2>
        <p className="text-muted-foreground">{t.reimbursementRequestDesc}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.expenseDetails}</CardTitle>
          <CardDescription>{t.expenseDetailsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="type">{t.expenseType}</Label>
            <Input id="type" placeholder={t.expenseTypePlaceholder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">{t.amount}</Label>
            <Input
              id="amount"
              type="number"
              placeholder={t.amountPlaceholder}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">{t.date}</Label>
            <Input id="date" type="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea id="description" placeholder={t.reasonPlaceholder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="receipt">{t.uploadReceipt}</Label>
            <Input id="receipt" type="file" />
          </div>
          <Button className="w-full">{t.submitRequest}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
