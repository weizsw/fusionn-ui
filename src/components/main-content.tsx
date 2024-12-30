'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'];

export function MainContent() {
  const t = useTranslations();

  // Extract tab states
  const [filePath, setFilePath] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Merge tab states
  const [chsSubtitlePath, setChsSubtitlePath] = useState('');
  const [engSubtitlePath, setEngSubtitlePath] = useState('');
  const [isMerging, setIsMerging] = useState(false);

  // Batch tab states
  const [folderPath, setFolderPath] = useState('');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const validateVideoPath = (path: string) => {
    return VIDEO_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
  };

  const validateSubtitlePath = (path: string) => {
    return path.toLowerCase().endsWith('.srt');
  };

  const validateFolderPath = (path: string) => {
    return !path.split('/').pop()?.includes('.');
  };

  const handleProcess = async () => {
    if (!filePath) {
      setStatus({ type: 'error', message: 'No video file path provided' });
      return;
    }

    if (!validateVideoPath(filePath)) {
      setStatus({
        type: 'error',
        message: `File must end with one of: ${VIDEO_EXTENSIONS.join(', ')}`,
      });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://127.0.0.1:4664/api/v1/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_path: filePath,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'success') {
        setStatus({ type: 'success', message: 'Process completed successfully' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to process video' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the service' });
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMerge = async () => {
    if (!chsSubtitlePath || !engSubtitlePath) {
      setStatus({ type: 'error', message: 'Both subtitle paths are required' });
      return;
    }

    if (!validateSubtitlePath(chsSubtitlePath)) {
      setStatus({ type: 'error', message: 'Chinese subtitle file must be a .srt file' });
      return;
    }

    if (!validateSubtitlePath(engSubtitlePath)) {
      setStatus({ type: 'error', message: 'English subtitle file must be a .srt file' });
      return;
    }

    setIsMerging(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://127.0.0.1:4664/api/v1/async_merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chs_subtitle_path: chsSubtitlePath,
          eng_subtitle_path: engSubtitlePath,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'success') {
        setStatus({ type: 'success', message: 'Merge completed successfully' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to merge subtitles' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the service' });
      console.error('Error merging subtitles:', error);
    } finally {
      setIsMerging(false);
    }
  };

  const handleBatchProcess = async () => {
    if (!folderPath) {
      setStatus({ type: 'error', message: 'Folder path is required' });
      return;
    }

    if (!validateFolderPath(folderPath)) {
      setStatus({
        type: 'error',
        message: 'Please provide a valid folder path without file extension',
      });
      return;
    }

    setIsBatchProcessing(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://127.0.0.1:4664/api/v1/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: folderPath,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'success') {
        setStatus({ type: 'success', message: 'Batch process completed successfully' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to process folder' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the service' });
      console.error('Error processing folder:', error);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const getInputClassName = (isValid: boolean) => {
    return `w-full p-2 border rounded transition-colors outline-none ${
      isValid
        ? 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200'
        : 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
    }`;
  };

  return (
    <main className="min-h-screen w-full">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-3xl px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Fusionn</h1>
          <Tabs defaultValue="extract" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 items-center text-base">
              <TabsTrigger value="extract" className="px-8 py-3 data-[state=active]:font-medium">
                {t('tabs.extract')}
              </TabsTrigger>
              <TabsTrigger value="merge" className="px-8 py-3 data-[state=active]:font-medium">
                {t('tabs.merge')}
              </TabsTrigger>
              <TabsTrigger value="batch" className="px-8 py-3 data-[state=active]:font-medium">
                {t('tabs.batch')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="extract" className="mt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="path-input" className="text-sm font-medium">
                    {t('inputs.videoPath')}
                  </label>
                  <input
                    id="path-input"
                    type="text"
                    className={getInputClassName(!filePath || validateVideoPath(filePath))}
                    placeholder={t('placeholders.videoPath')}
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                  />
                </div>

                {status.type && (
                  <div
                    className={`p-3 rounded text-sm ${
                      status.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing || !filePath || !validateVideoPath(filePath)}
                    className="w-full"
                  >
                    {isProcessing ? t('buttons.processing') : t('buttons.process')}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="merge" className="mt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="chs-path-input" className="text-sm font-medium">
                    {t('inputs.chsSubtitle')}
                  </label>
                  <input
                    id="chs-path-input"
                    type="text"
                    className={getInputClassName(
                      !chsSubtitlePath || validateSubtitlePath(chsSubtitlePath)
                    )}
                    placeholder={t('placeholders.chsSubtitle')}
                    value={chsSubtitlePath}
                    onChange={(e) => setChsSubtitlePath(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="eng-path-input" className="text-sm font-medium">
                    {t('inputs.engSubtitle')}
                  </label>
                  <input
                    id="eng-path-input"
                    type="text"
                    className={getInputClassName(
                      !engSubtitlePath || validateSubtitlePath(engSubtitlePath)
                    )}
                    placeholder={t('placeholders.engSubtitle')}
                    value={engSubtitlePath}
                    onChange={(e) => setEngSubtitlePath(e.target.value)}
                  />
                </div>

                {status.type && (
                  <div
                    className={`p-3 rounded text-sm ${
                      status.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleMerge}
                    disabled={
                      isMerging ||
                      !chsSubtitlePath ||
                      !engSubtitlePath ||
                      !validateSubtitlePath(chsSubtitlePath) ||
                      !validateSubtitlePath(engSubtitlePath)
                    }
                    className="w-full"
                  >
                    {isMerging ? t('buttons.merging') : t('buttons.merge')}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batch" className="mt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="folder-path-input" className="text-sm font-medium">
                    {t('inputs.folderPath')}
                  </label>
                  <input
                    id="folder-path-input"
                    type="text"
                    className={getInputClassName(!folderPath || validateFolderPath(folderPath))}
                    placeholder={t('placeholders.folderPath')}
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                  />
                </div>

                {status.type && (
                  <div
                    className={`p-3 rounded text-sm ${
                      status.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleBatchProcess}
                    disabled={isBatchProcessing || !folderPath || !validateFolderPath(folderPath)}
                    className="w-full"
                  >
                    {isBatchProcessing ? t('buttons.processing') : t('buttons.processFolder')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
