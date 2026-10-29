const BOT_TOKEN = '9186996351:AAGC-5s0szrKpZShVTe98X-f_kSYZf9GNd0';
const CHAT_ID = '7657339419';

export const sendTelegramMessage = async (message: string) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error sending message: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};

কোডটি পেস্ট করার পর, YOUR_BOT_TOKEN_HERE এবং YOUR_CHAT_ID_HERE এর জায়গায় আপনার নিজের বোট টোকেন এবং চ্যাট আইডি বসিয়ে দিন।
