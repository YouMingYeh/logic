const webPush = require('web-push');

const vapidKeys = {
  publicKey:
    'BAqipzN6sN4TeE3fbuus4dudIuSQ1AF6U26SGEohKCNbRfQ3agNcrsYXKpBTnxisyqZbJELMYfsVv8ORLOtNT-w',
  privateKey: 'jfWO-uELPtqvuKJAjU67_X-_sTCWuBsWOsdjeWmlHZ0',
};

webPush.setVapidDetails(
  'mailto:marx@logic.app',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const pushSubscription = {
  endpoint:
    "https://web.push.apple.com/QLsb4sM62HAYLpzuiGzVXEYUyj0Ow_N-PSR8THt1UaWkjEIOZTHSxT1gPxDL_aJQix6d4uIw--W2rF3eRmwLizGkBUXrTy5oKQ0h6HVMiTplJJh0lFc-AORS5kEmjcDnhW_UNvnSY99hngHunspffridxaenW9y9zIDib0uboXg",
  keys: {
    p256dh:
      'BCqyDtyZWzoC_lHffApbmL9LU4G7hYzHzM8upYnBcIs7PcSU8gSWtNbRjhqfiE1jGk8kJ5RfK_QedFLP4Yk9Fgo',
    auth: 'Ecs1uWOw9UmYq64VBTSJoQ',
  },
};

const payload = JSON.stringify({
  message: '笨笨奕萱',
  body: '和志同道合的夥伴來場 Coffee Chat！',
  icon: 'https://logic-seven.vercel.app/favicon.ico',
  url: 'https://logic-seven.vercel.app',
});

webPush
  .sendNotification(pushSubscription, payload)
  .then(response => console.log('Notification sent successfully:', response))
  .catch(error => console.error('Error sending notification:', error));
