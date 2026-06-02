"use client";

import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GROUP_MEMBERS = [
  { name: "Fardizza Vinda Rahman", nim: "H1D025067" },
  { name: "Muhammad Fattachul Fawwaz", nim: "H1D025068" },
  { name: "Mufaddhol", nim: "H1D025069" },
  { name: "Balqis Safitri", nim: "H1D025070" },
  { name: "Alika Salsabila", nim: "H1D025071" },
] as const;

export function GroupMembersMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="gap-2"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
        variant="outline"
      >
        <Users className="size-4" aria-hidden="true" />
        Anggota Kelompok
      </Button>

      {isOpen ? (
        <div
          aria-label="Anggota Kelompok"
          className="absolute right-0 top-10 z-30 w-[520px] rounded-lg border border-slate-200 bg-white p-4 text-left shadow-lg"
          role="dialog"
        >
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-950">
              Anggota Kelompok
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Daftar anggota kelompok tugas Probabilitas dan Statistika.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-right">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="w-32">NIM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GROUP_MEMBERS.map((member, index) => (
                <TableRow key={member.nim}>
                  <TableCell className="text-right font-mono text-slate-500">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {member.name}
                  </TableCell>
                  <TableCell className="font-mono text-slate-700">
                    {member.nim}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
