"use client";

import { ReactNode, useState, useRef, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
  hidden?: "mobile" | "tablet" | "none";
}

export interface TableAction<T = unknown> {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  variant?: "primary" | "danger" | "secondary";
}

interface AdminTableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  /** Enable expandable rows on mobile for hidden columns */
  expandableOnMobile?: boolean;
}

export default function AdminTable<T extends object>({
  columns,
  data,
  actions,
  loading = false,
  emptyMessage = "No data available",
  expandableOnMobile = true,
}: AdminTableProps<T>) {
  // Only one row can be expanded at a time
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(
    null
  );

  const toggleRow = (id: string | number) => {
    // If clicking the same row, close it; otherwise open the new one (closes previous)
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const getVisibilityClass = (hidden?: "mobile" | "tablet" | "none") => {
    switch (hidden) {
      case "mobile":
        return "hidden sm:table-cell";
      case "tablet":
        return "hidden lg:table-cell";
      default:
        return "";
    }
  };

  // Check if there are any hidden columns that should be shown in expanded view
  const hasHiddenColumns = columns.some(
    (col) => col.hidden === "mobile" || col.hidden === "tablet"
  );

  return (
    <div className="stat-card">
      <div className="table-responsive">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary ${getVisibilityClass(
                    column.hidden
                  )}`}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions?.length ? 1 : 0)}
                  className="py-8 px-4 text-center text-text-secondary"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions?.length ? 1 : 0)}
                  className="py-8 px-4 text-center text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowId = (row as { id?: string | number }).id || index;
                const isExpanded = expandedRowId === rowId;
                const hiddenColumns = columns.filter(
                  (col) => col.hidden === "mobile" || col.hidden === "tablet"
                );

                return (
                  <ExpandableRow
                    key={rowId}
                    row={row}
                    rowId={rowId}
                    columns={columns}
                    hiddenColumns={hiddenColumns}
                    actions={actions}
                    isExpanded={isExpanded}
                    hasHiddenColumns={hasHiddenColumns}
                    expandableOnMobile={expandableOnMobile}
                    getVisibilityClass={getVisibilityClass}
                    onRowClick={() => toggleRow(rowId)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Separate component for expandable row with animation
interface ExpandableRowProps<T = unknown> {
  row: T;
  rowId: string | number;
  columns: TableColumn<T>[];
  hiddenColumns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isExpanded: boolean;
  hasHiddenColumns: boolean;
  expandableOnMobile: boolean;
  getVisibilityClass: (hidden?: "mobile" | "tablet" | "none") => string;
  onRowClick: () => void;
}

function ExpandableRow<T extends object>({
  row,
  rowId,
  columns,
  hiddenColumns,
  actions,
  isExpanded,
  hasHiddenColumns,
  expandableOnMobile,
  getVisibilityClass,
  onRowClick,
}: ExpandableRowProps<T>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // DOM measurement in useLayoutEffect is a valid pattern for animations
  useLayoutEffect(() => {
    if (contentRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const canExpand = expandableOnMobile && hasHiddenColumns;

  return (
    <>
      <tr
        className={`table-row ${
          canExpand ? "sm:cursor-default cursor-pointer" : ""
        } ${isExpanded ? "bg-gray-50" : ""}`}
        onClick={() => {
          // Only expand on mobile (when hidden columns exist)
          if (canExpand && window.innerWidth < 640) {
            onRowClick();
          }
        }}
      >
        {columns.map((column, colIndex) => (
          <td
            key={`${rowId}-${column.key}`}
            className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-primary ${getVisibilityClass(
              column.hidden
            )}`}
          >
            <div className="flex items-center gap-2">
              {/* Show chevron on first visible column on mobile */}
              {colIndex === 0 && canExpand && (
                <ChevronDown
                  className={`w-4 h-4 text-text-secondary sm:hidden flex-shrink-0 transition-transform duration-300 ease-in-out ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
              <span className="truncate">
                {column.render
                  ? column.render(
                      (row as Record<string, unknown>)[column.key],
                      row
                    )
                  : ((row as Record<string, unknown>)[column.key] as ReactNode)}
              </span>
            </div>
          </td>
        ))}
        {actions && actions.length > 0 && (
          <td
            className="py-2 sm:py-3 px-2 sm:px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-1 sm:space-x-2">
              {actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  onClick={() => action.onClick(row)}
                  className={`p-1 sm:p-2 rounded transition-colors ${
                    action.variant === "danger"
                      ? "hover:bg-red-100 text-red-600 hover:text-red-700"
                      : action.variant === "secondary"
                      ? "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                      : "hover:bg-blue-100 text-primary hover:text-primary-dark"
                  }`}
                  title={action.label}
                >
                  {action.icon ? (
                    <span className="w-4 h-4 sm:w-5 sm:h-5">{action.icon}</span>
                  ) : (
                    action.label
                  )}
                </button>
              ))}
            </div>
          </td>
        )}
      </tr>
      {/* Animated expanded row for mobile - shows hidden columns */}
      {canExpand && (
        <tr className="sm:hidden">
          <td
            colSpan={
              columns.filter((c) => !c.hidden).length +
              (actions?.length ? 1 : 0)
            }
          >
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ height: `${height}px` }}
            >
              <div
                ref={contentRef}
                className="bg-gray-50 border-t border-gray-100 py-3 px-4"
              >
                <div className="space-y-2">
                  {hiddenColumns.map((column) => (
                    <div key={column.key} className="flex flex-col">
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                        {column.label}
                      </span>
                      <span className="text-sm text-text-primary mt-0.5">
                        {column.render
                          ? column.render(
                              (row as Record<string, unknown>)[column.key],
                              row
                            )
                          : ((row as Record<string, unknown>)[
                              column.key
                            ] as ReactNode) || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
