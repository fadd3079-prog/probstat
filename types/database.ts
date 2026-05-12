import type { DataQualityStatus, MeasurementMethod, RouteMode } from "./kos";
import type { ExportFormat } from "./report";
import type { UserRole } from "./users";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      kos_data: {
        Row: {
          id: string;
          nama_kos: string;
          area: string | null;
          jarak_meter: number;
          google_maps_url: string | null;
          mode_rute: RouteMode;
          titik_tujuan: string;
          metode_pengukuran: MeasurementMethod;
          catatan: string | null;
          data_quality_status: DataQualityStatus;
          created_by: string | null;
          updated_by: string | null;
          is_deleted: boolean;
          deleted_at: string | null;
          deleted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama_kos: string;
          area?: string | null;
          jarak_meter: number;
          google_maps_url?: string | null;
          mode_rute?: RouteMode;
          titik_tujuan?: string;
          metode_pengukuran?: MeasurementMethod;
          catatan?: string | null;
          data_quality_status?: DataQualityStatus;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean;
          deleted_at?: string | null;
          deleted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["kos_data"]["Insert"]>;
        Relationships: [];
      };
      app_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["app_settings"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]> & {
          action: string;
          table_name: string;
        };
        Update: never;
        Relationships: [];
      };
      dataset_snapshots: {
        Row: {
          id: string;
          snapshot_name: string;
          description: string | null;
          data: Json;
          statistics: Json | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          snapshot_name: string;
          description?: string | null;
          data: Json;
          statistics?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["dataset_snapshots"]["Insert"]
        >;
        Relationships: [];
      };
      report_exports: {
        Row: {
          id: string;
          export_type: ExportFormat;
          file_name: string;
          file_url: string | null;
          export_metadata: Json | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          export_type: ExportFormat;
          file_name: string;
          file_url?: string | null;
          export_metadata?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["report_exports"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
