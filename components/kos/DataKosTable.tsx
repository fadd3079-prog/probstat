"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownUp,
  CheckCircle2,
  Edit,
  ExternalLink,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { softDeleteKosDataAction } from "@/app/(dashboard)/kos-actions";
import { KosDataForm } from "@/components/kos/KosDataForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canCreateKosData, canUpdateKosData } from "@/lib/auth/roles";
import { emptyKosCrudActionState } from "@/lib/kos/action-state";
import type { KosDataRecord } from "@/types/kos";
import type { UserProfile } from "@/types/users";

type DataKosTableProps = Readonly<{
  records: readonly KosDataRecord[];
  profile: UserProfile;
}>;

const columnHelper = createColumnHelper<KosDataRecord>();

export function DataKosTable({ profile, records }: DataKosTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [editingRecord, setEditingRecord] = useState<KosDataRecord | null>(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(
    null,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    softDeleteKosDataAction,
    emptyKosCrudActionState,
  );
  const data = useMemo(() => [...records], [records]);
  const canCreate = canCreateKosData(profile.role);
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No",
        cell: () => null,
      }),
      columnHelper.accessor("namaKos", {
        header: ({ column }) => (
          <SortButton
            label="Nama Kos"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">
              {row.original.namaKos}
            </p>
            <p className="text-xs text-slate-500">
              {row.original.area ?? "Area belum diisi"}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("jarakMeter", {
        header: ({ column }) => (
          <SortButton
            label="Jarak Meter"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="font-mono font-medium text-slate-900">
            {formatMeters(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("dataQualityStatus", {
        header: "Status",
        cell: ({ getValue }) => (
          <Badge
            variant="outline"
            className={getStatusBadgeClassName(getValue())}
          >
            {formatStatus(getValue())}
          </Badge>
        ),
      }),
      columnHelper.accessor("googleMapsUrl", {
        header: "Maps",
        cell: ({ getValue }) =>
          getValue() ? (
            <Button asChild size="sm" variant="ghost">
              <a href={getValue() ?? "#"} rel="noreferrer" target="_blank">
                Buka
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <span className="text-slate-400">-</span>
          ),
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <SortButton
            label="Dibuat"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-slate-600">
            {formatDateTime(getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const record = row.original;
          const canMutate = canUpdateKosData(profile.role, profile.id, record);

          if (!canMutate) {
            return <span className="text-xs text-slate-400">Read only</span>;
          }

          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => {
                  setEditSuccessMessage(null);
                  setEditingRecord(record);
                }}
              >
                <Edit className="size-3.5" aria-hidden="true" />
                Edit
              </Button>
              <form action={deleteAction}>
                <input name="id" type="hidden" value={record.id} />
                <Button
                  disabled={isDeleting}
                  size="sm"
                  type="submit"
                  variant="destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Soft delete
                </Button>
              </form>
            </div>
          );
        },
      }),
    ],
    [deleteAction, isDeleting, profile.id, profile.role],
  );
  // TanStack Table intentionally returns stateful helpers; this client table owns them locally.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      sorting,
    },
  });

  useEffect(() => {
    if (deleteState.status === "success") {
      if (editingRecord) {
        setEditingRecord(null);
      }

      router.refresh();
    }
  }, [deleteState.status, editingRecord, router]);

  return (
    <div className="space-y-6">
      {deleteState.status === "success" ? (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="size-4 text-emerald-700" aria-hidden="true" />
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{deleteState.message}</AlertDescription>
        </Alert>
      ) : null}

      {editSuccessMessage ? (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="size-4 text-emerald-700" aria-hidden="true" />
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{editSuccessMessage}</AlertDescription>
        </Alert>
      ) : null}

      {deleteState.status === "error" ? (
        <Alert variant="destructive">
          <ShieldAlert className="size-4" aria-hidden="true" />
          <AlertTitle>Gagal soft delete</AlertTitle>
          <AlertDescription>{deleteState.message}</AlertDescription>
        </Alert>
      ) : null}

      {editingRecord ? (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Edit Data Kos</CardTitle>
                <CardDescription>
                  Perubahan disimpan melalui Server Action dengan sesi user yang
                  sedang login.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
              onClick={() => setEditingRecord(null)}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Batal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <KosDataForm
              key={editingRecord.id}
              initialValues={{
                namaKos: editingRecord.namaKos,
                area: editingRecord.area ?? "",
                jarakMeter: editingRecord.jarakMeter,
                googleMapsUrl: editingRecord.googleMapsUrl ?? "",
                catatan: editingRecord.catatan ?? "",
              }}
              mode="edit"
              recordId={editingRecord.id}
              submitLabel="Simpan Perubahan"
              onSuccess={(message) => {
                setEditSuccessMessage(message);
                setEditingRecord(null);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Tabel Data Kos</CardTitle>
              <CardDescription>
                Data aktif dari Supabase. Baris yang dihapus secara soft delete
                tidak ditampilkan.
              </CardDescription>
            </div>
            {canCreate ? (
              <Button asChild>
                <Link href="/input">
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Data
                </Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-96">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                placeholder="Cari nama kos, area, status, atau jarak..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
            </div>
            <p className="text-sm text-slate-500">
              {table.getFilteredRowModel().rows.length} dari {records.length}{" "}
              data aktif
            </p>
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="h-28 text-center text-slate-500"
                    colSpan={columns.length}
                  >
                    Tidak ada data yang cocok dengan filter.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, visibleRowIndex) => {
                  const pagination = table.getState().pagination;
                  const displayNumber =
                    pagination.pageIndex * pagination.pageSize +
                    visibleRowIndex +
                    1;

                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.column.id === "no" ? (
                            <span className="font-mono text-slate-500">
                              {displayNumber}
                            </span>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount() || 1}
            </p>
            <div className="flex items-center gap-2">
              <Button
                disabled={!table.getCanPreviousPage()}
                type="button"
                variant="outline"
                onClick={() => table.previousPage()}
              >
                Sebelumnya
              </Button>
              <Button
                disabled={!table.getCanNextPage()}
                type="button"
                variant="outline"
                onClick={() => table.nextPage()}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortButton({
  label,
  onClick,
}: Readonly<{
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-normal text-slate-500"
      type="button"
      onClick={onClick}
    >
      {label}
      <ArrowDownUp className="size-3" aria-hidden="true" />
    </button>
  );
}

function formatMeters(value: number): string {
  const formattedValue = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value);

  return `${formattedValue} m`;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(status: KosDataRecord["dataQualityStatus"]): string {
  const labels: Record<KosDataRecord["dataQualityStatus"], string> = {
    duplicate_suspected: "Duplikat?",
    needs_review: "Review",
    valid: "Valid",
    warning: "Warning",
  };

  return labels[status];
}

function getStatusBadgeClassName(
  status: KosDataRecord["dataQualityStatus"],
): string {
  if (status === "valid") {
    return "border-emerald-200 text-emerald-700";
  }

  if (status === "warning") {
    return "border-amber-200 text-amber-700";
  }

  return "border-red-200 text-red-700";
}
