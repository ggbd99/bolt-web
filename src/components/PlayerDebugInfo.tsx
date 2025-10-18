import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check } from 'lucide-react';

interface PlayerDebugInfoProps {
  playerUrl: string;
  mediaId: number;
  mediaType: string;
  season?: number;
  episode?: number;
}

export const PlayerDebugInfo: React.FC<PlayerDebugInfoProps> = ({
  playerUrl,
  mediaId,
  mediaType,
  season,
  episode,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(playerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    window.open(playerUrl, '_blank');
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-400">Player Debug Info</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-8 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy URL
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={openInNewTab}
              className="h-8 text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open Direct
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-zinc-500">Media Type:</span>
              <span className="ml-2 text-white">{mediaType}</span>
            </div>
            <div>
              <span className="text-zinc-500">TMDB ID:</span>
              <span className="ml-2 text-white">{mediaId}</span>
            </div>
            {season && (
              <div>
                <span className="text-zinc-500">Season:</span>
                <span className="ml-2 text-white">{season}</span>
              </div>
            )}
            {episode && (
              <div>
                <span className="text-zinc-500">Episode:</span>
                <span className="ml-2 text-white">{episode}</span>
              </div>
            )}
          </div>
          
          <div className="pt-2 border-t border-zinc-800">
            <span className="text-zinc-500 block mb-1">Player URL:</span>
            <code className="text-indigo-400 text-[10px] break-all block bg-black/50 p-2 rounded">
              {playerUrl}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
