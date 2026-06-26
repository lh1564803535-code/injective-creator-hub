"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";

interface TreeNode {
  name: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
}

interface TreeViewProps {
  data: TreeNode[];
  className?: string;
}

export function TreeView({ data, className = "" }: TreeViewProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {data.map((node, index) => (
        <TreeNodeItem key={index} node={node} level={0} />
      ))}
    </div>
  );
}

function TreeNodeItem({ node, level }: { node: TreeNode; level: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-white/[0.04] ${
          hasChildren ? "cursor-pointer" : "cursor-default"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )
        ) : (
          <div className="w-4" />
        )}

        {node.icon || (
          hasChildren ? (
            <Folder className="h-4 w-4 text-amber-400" />
          ) : (
            <File className="h-4 w-4 text-gray-500" />
          )
        )}

        <span className="text-gray-300">{node.name}</span>
      </button>

      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNodeItem key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
