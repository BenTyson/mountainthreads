"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StatusIcons } from "@/components/admin/status-icons";

interface Group {
  id: string;
  name: string;
  paid: boolean;
  pickedUp: boolean;
  returned: boolean;
  expectedSize: number | null;
  rentalStartDate: Date | string | null;
  _count: {
    submissions: number;
  };
}

interface RecentGroupsListProps {
  groups: Group[];
}

export function RecentGroupsList({ groups }: RecentGroupsListProps) {
  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <div className="space-y-2">
        {filteredGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            {search ? "No groups match your search." : "No groups yet. Create your first group to get started."}
          </p>
        ) : (
          filteredGroups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-0.5">
                <p className="font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group._count.submissions}{group.expectedSize ? `/${group.expectedSize}` : ""} submission{group._count.submissions !== 1 ? "s" : ""}
                  {group.rentalStartDate && (
                    <span className="ml-2">
                      • Departs {new Date(group.rentalStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </p>
              </div>
              <StatusIcons
                paid={group.paid}
                pickedUp={group.pickedUp}
                returned={group.returned}
                size="sm"
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
