import { format } from 'date-fns';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type HistoryItem = {
  id: string;
  prompt: string;
  platform: 'instagram' | 'twitter';
  captions: string[];
  createdAt: Date;
};

export function History({ items }: { items: HistoryItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (caption: string, id: string) => {
    navigator.clipboard.writeText(caption);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#344966]/30 backdrop-blur-lg rounded-xl border border-[#B4CDED]/20 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Generation History</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#0D1821]/40 backdrop-blur-sm border border-[#B4CDED]/20 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm">
                  {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
                <p className="text-white mt-1">
                  Prompt: {item.prompt}
                </p>
                <p className="text-white/80 text-sm mt-1">
                  Platform: {item.platform}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {item.captions.map((caption, index) => (
                <div key={index} className="bg-black/10 rounded-lg p-4 relative group">
                  <button
                    onClick={() => handleCopy(caption, `${item.id}-${index}`)}
                    className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === `${item.id}-${index}` ? (
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <p className="text-white/90 whitespace-pre-wrap pr-12">
                    {caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 