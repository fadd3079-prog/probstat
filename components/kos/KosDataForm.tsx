"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  createKosDataAction,
  updateKosDataAction,
} from "@/app/(dashboard)/kos-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  MEASUREMENT_METHOD_LABEL,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";
import {
  emptyKosCrudActionState,
  type KosCrudActionState,
} from "@/lib/kos/action-state";
import {
  type KosDataFormInputValues,
  kosDataFormSchema,
  type KosDataFormValues,
} from "@/lib/kos/validation";
import { cn } from "@/lib/utils";

type KosDataFormMode = "create" | "edit";

type KosDataFormProps = Readonly<{
  mode?: KosDataFormMode;
  recordId?: string;
  initialValues?: Partial<KosDataFormValues>;
  disabledReason?: string | null;
  submitLabel?: string;
  onSuccess?: (message: string) => void;
  className?: string;
}>;

const blankValues: KosDataFormInputValues = {
  namaKos: "",
  area: "",
  jarakMeter: 1,
  googleMapsUrl: "",
  catatan: "",
};

export function KosDataForm({
  className,
  disabledReason = null,
  initialValues,
  mode = "create",
  onSuccess,
  recordId,
  submitLabel,
}: KosDataFormProps) {
  const action =
    mode === "create" ? createKosDataAction : updateKosDataAction;
  const [state, formAction, isPending] = useActionState<
    KosCrudActionState,
    FormData
  >(action, emptyKosCrudActionState);
  const [, startTransition] = useTransition();
  const defaultValues = useMemo(
    () => ({
      ...blankValues,
      ...initialValues,
    }),
    [initialValues],
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<KosDataFormInputValues, unknown, KosDataFormValues>({
    resolver: zodResolver(kosDataFormSchema),
    defaultValues,
  });
  const isDisabled = Boolean(disabledReason) || isPending;
  const defaultSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Simpan Perubahan" : "Simpan Data Kos");
  const pendingSubmitLabel =
    mode === "edit" ? "Memperbarui..." : "Menyimpan...";

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    if (mode === "create") {
      reset(blankValues);
    }

    onSuccess?.(state.message);
  }, [mode, onSuccess, reset, state.message, state.status]);

  function submitCurrentForm(values: KosDataFormValues) {
    const formData = new FormData();

    if (recordId) {
      formData.set("id", recordId);
    }

    formData.set("namaKos", values.namaKos);
    formData.set("area", values.area);
    formData.set("jarakMeter", String(values.jarakMeter));
    formData.set("googleMapsUrl", values.googleMapsUrl);
    formData.set("catatan", values.catatan);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit((values) => submitCurrentForm(values))}
    >
      {recordId ? <input name="id" type="hidden" value={recordId} /> : null}

      {disabledReason ? (
        <Alert className="border-amber-200 bg-amber-50">
          <ShieldAlert className="size-4 text-amber-700" aria-hidden="true" />
          <AlertTitle>Akses input dibatasi</AlertTitle>
          <AlertDescription>{disabledReason}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "success" ? (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="size-4 text-emerald-700" aria-hidden="true" />
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "error" ? (
        <Alert variant="destructive">
          <ShieldAlert className="size-4" aria-hidden="true" />
          <AlertTitle>Gagal</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-5">
        <FieldShell
          error={
            errors.namaKos?.message ?? state.fieldErrors?.namaKos?.join(", ")
          }
          helper='Nama kos akan dirapikan otomatis, misalnya "wisma yolandaa" menjadi "Wisma Yolandaa".'
          label="Nama Kos"
          name="namaKos"
        >
          <Input
            id="namaKos"
            placeholder="Contoh: Kos Melati"
            {...register("namaKos")}
            aria-invalid={Boolean(errors.namaKos || state.fieldErrors?.namaKos)}
            disabled={isDisabled}
          />
        </FieldShell>

        <FieldShell
          error={errors.area?.message ?? state.fieldErrors?.area?.join(", ")}
          label="Area"
          name="area"
        >
          <Input
            id="area"
            placeholder="Contoh: Balter, Kalimanah"
            {...register("area")}
            aria-invalid={Boolean(errors.area || state.fieldErrors?.area)}
            disabled={isDisabled}
          />
        </FieldShell>

        <FieldShell
          error={
            errors.jarakMeter?.message ??
            state.fieldErrors?.jarakMeter?.join(", ")
          }
          label="Jarak (Meter)"
          name="jarakMeter"
        >
          <Input
            id="jarakMeter"
            min={1}
            placeholder="Contoh: 850"
            type="number"
            {...register("jarakMeter", { valueAsNumber: true })}
            aria-invalid={Boolean(
              errors.jarakMeter || state.fieldErrors?.jarakMeter,
            )}
            disabled={isDisabled}
          />
        </FieldShell>

        <FieldShell
          error={
            errors.googleMapsUrl?.message ??
            state.fieldErrors?.googleMapsUrl?.join(", ")
          }
          label="Tautan Google Maps"
          name="googleMapsUrl"
        >
          <Input
            id="googleMapsUrl"
            placeholder="https://maps.google.com/..."
            type="url"
            {...register("googleMapsUrl")}
            aria-invalid={Boolean(
              errors.googleMapsUrl || state.fieldErrors?.googleMapsUrl,
            )}
            disabled={isDisabled}
          />
        </FieldShell>
      </div>

      <FieldShell
        error={errors.catatan?.message ?? state.fieldErrors?.catatan?.join(", ")}
        label="Catatan"
        name="catatan"
      >
        <Textarea
          id="catatan"
          placeholder="Catatan opsional tentang data atau sumber pengukuran."
          {...register("catatan")}
          aria-invalid={Boolean(errors.catatan || state.fieldErrors?.catatan)}
          disabled={isDisabled}
        />
      </FieldShell>

      <div className="grid grid-cols-3 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <ReadonlyMethodItem label="Mode rute" value={ROUTE_MODE_LABEL} />
        <ReadonlyMethodItem label="Titik tujuan" value={TARGET_DESTINATION} />
        <ReadonlyMethodItem label="Metode ukur" value={MEASUREMENT_METHOD_LABEL} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <p className="text-sm text-slate-500">
          {isPending
            ? "Mohon tunggu sebentar..."
            : "Pastikan jarak diambil dari Google Maps dengan titik tujuan yang sama."}
        </p>
        <Button aria-busy={isPending} disabled={isDisabled} type="submit">
          {isPending ? (
            <LoadingSpinner className="size-3.5" label={pendingSubmitLabel} />
          ) : null}
          {isPending ? pendingSubmitLabel : defaultSubmitLabel}
        </Button>
      </div>
    </form>
  );
}

function FieldShell({
  children,
  error,
  helper,
  label,
  name,
}: Readonly<{
  children: ReactNode;
  error?: string;
  helper?: string;
  label: string;
  name: keyof KosDataFormInputValues;
}>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {!error && helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function ReadonlyMethodItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
