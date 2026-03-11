import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import { Department, DEPARTMENTS } from '../types';
import { cn } from '../lib/utils';

interface OrgTreeProps {
  onSelect: (deptId: string) => void;
  selectedId?: string;
}

const TreeNode: React.FC<{
  dept: Department;
  onSelect: (deptId: string) => void;
  selectedId?: string;
  level: number;
}> = ({ dept, onSelect, selectedId, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = dept.children && dept.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-black/5",
          selectedId === dept.id && "bg-black/10 font-medium"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(dept.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 hover:bg-black/10 rounded mr-1"
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="w-6 mr-1 flex justify-center">
            <Building2 size={14} className="opacity-40" />
          </div>
        )}
        <span className="text-sm">{dept.name}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-1">
          {dept.children!.map((child) => (
            <TreeNode
              key={child.id}
              dept={child}
              onSelect={onSelect}
              selectedId={selectedId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrgTree: React.FC<OrgTreeProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="space-y-1">
      {DEPARTMENTS.map((dept) => (
        <TreeNode
          key={dept.id}
          dept={dept}
          onSelect={onSelect}
          selectedId={selectedId}
          level={0}
        />
      ))}
    </div>
  );
};
