"use client";

import { Video } from "lucide-react";
import { VideoBlock } from "@/types";

interface Props {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
}

export default function VideoBlockEditor({ block, onChange }: Props) {
  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Video size={14} className="text-purple-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
          Video
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Video title"
          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <textarea
          value={block.description ?? ""}
          onChange={(e) => onChange({ ...block, description: e.target.value || undefined })}
          placeholder="Brief description of what this video covers (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />
      </div>
    </div>
  );
}
