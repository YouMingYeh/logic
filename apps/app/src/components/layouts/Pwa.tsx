'use client';
import React, { useEffect } from 'react';
import { useToast } from 'ui';

export default function Pwa() {
  const { toast } = useToast();

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        const serviceWorkerRegistration =
          await navigator.serviceWorker.register('/sw.js');
        const serviceWorker =
          serviceWorkerRegistration.installing ||
          serviceWorkerRegistration.waiting ||
          serviceWorkerRegistration.active;
        if (!serviceWorker) {
          toast({
            title: 'Service Worker 不可用',
            description: '無法註冊 Service Worker。',
          });
          return;
        }

        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          toast({
            title: 'Service Worker 未安裝',
            description: '無法安裝 Service Worker。',
          });
          return;
        }

        serviceWorker.addEventListener('statechange', function onStateChange() {
          if (serviceWorker.state === 'activated') {
            // check if the user has installed the PWA
            if (window.matchMedia('(display-mode: standalone)').matches) {
              toast({
                title: '歡迎回來！',
              });
            } else {
              toast({
                title: '你可以點選分享按鈕、加入主畫面，來將 logic 變成 App！',
              });
            }
          }
        });
      }
    };
    registerServiceWorker();
  }, [toast]);

  return <></>;
}
