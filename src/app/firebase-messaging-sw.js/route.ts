import {NextResponse} from 'next/server';

export function GET() {
  // This route serves the Firebase messaging service worker.
  // It's created as a dynamic route to securely inject environment variables.
  const swScript = `
    importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

    const firebaseConfig = {
        apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
        authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
        projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
        storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
        messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
        appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}",
    };
    
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const messaging = firebase.messaging();
    
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
        if (!payload.notification) {
            return;
        }

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon,
            image: payload.notification.image,
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
  `;
  
  return new NextResponse(swScript, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    },
  });
}
